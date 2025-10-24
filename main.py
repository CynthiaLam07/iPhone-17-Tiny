from config import DOCS_DIR, PERSIST_DIR
from rag_core import vectorstore_gemini, build_chain_gemini

if __name__ == "__main__":
    vs = vectorstore_gemini(PERSIST_DIR, DOCS_DIR, rebuild=False)
    chain = build_chain_gemini(vs, model_name="gemini-2.5-flash")

    question = "How can I apply for a student visa?"
    answer = chain["invoke"]({"question": question})
    print("Question:", question)
    print("Answer:", answer)
