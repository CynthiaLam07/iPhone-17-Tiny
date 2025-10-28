from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from config import DOCS_DIR, PERSIST_DIR
from rag_core import vectorstore_gemini, build_chain_gemini

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vs = vectorstore_gemini(PERSIST_DIR, DOCS_DIR, rebuild=False)
chain = build_chain_gemini(vs)

class Query(BaseModel):
    question: str

@app.post("/chat")
def chat(query: Query):
    result = chain["invoke"]({"question": query.question})

    if hasattr(result, "content"):
        result = result.content
    elif isinstance(result, dict) and "answer" in result:
        result = result["answer"]
    else:
        result = str(result)

    return {"answer": result}


if __name__ == "__main__":
    uvicorn.run("run_chatbot:app", host="0.0.0.0", port=8000)

