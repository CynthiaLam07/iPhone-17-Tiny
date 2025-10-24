from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_community.vectorstores import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

def vectorstore_gemini(persist_dir, docs_dir, rebuild=False):
    if rebuild:
        loader_txt = DirectoryLoader(
            docs_dir, glob="**/*.txt", loader_cls=TextLoader,
            show_progress=True, use_multithreading=True
        )
        loader_md = DirectoryLoader(
            docs_dir, glob="**/*.md", loader_cls=TextLoader,
            show_progress=True, use_multithreading=True
        )
        docs = loader_txt.load() + loader_md.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=150)
        splits = splitter.split_documents(docs)

        embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
        vs = Chroma.from_documents(splits, embeddings, persist_directory=persist_dir)
        vs.persist()
        return vs
    else:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
        return Chroma(persist_directory=persist_dir, embedding_function=embeddings)

def build_chain_gemini(vs, model_name="gemini-2.5-flash"):
    retriever = vs.as_retriever(search_kwargs={"k": 4})

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are AUSWO, the official chatbot of the "Australia Smart Way Out" platform.

Core goals:
- Simplify the migration, study, and visa processes for people who want to move to or stay in Australia.
- Provide clear, reliable, and user-friendly guidance on Australian visa categories, requirements, and processes.

Response policy:
1. Only respond to questions directly related to Australian visas and migration processes.
2. Always check the provided context first and prioritize quoting or referencing it.
3. If the context is insufficient, explicitly state: "Not certain, based on the provided context." Then you may attempt to answer using your own knowledge, but clarify it may not be fully up to date.
4. If a user asks about something unrelated to visas or migration, politely explain that your role is limited to visa-related topics and respond with "I don’t know.".
"""),
        ("user", "Question:\n{question}\n\nContext:\n{context}")
    ])

    llm = ChatGoogleGenerativeAI(model=model_name, temperature=0)
    parser = StrOutputParser()

    def format_docs(ds):
        return "\n\n".join([f"[Source {i+1}]\n{d.page_content}" for i, d in enumerate(ds)])

    def invoke(inputs):
        q = inputs["question"]
        docs = retriever.get_relevant_documents(q)
        ctx = format_docs(docs)
        messages = prompt.format_messages(question=q, context=ctx)
        llm_out = llm.invoke(messages)
        return parser.parse(llm_out)

    return {"invoke": invoke, "retriever": retriever}
