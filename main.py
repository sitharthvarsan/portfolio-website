from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_cpp import Llama

# Read profile.txt content
with open("profile.txt", "r", encoding="utf-8") as f:
    profile_context = f.read()

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str

# Load the LLaMA model
llm = Llama(
    model_path="D:\llama-3-open-hermes-disco.i1-Q4_K_M.gguf",  # <-- Change to your actual model file
    n_ctx=3000,
    n_threads=8,
    verbose=False,
)

@app.get("/")
def read_root():
    return {"message": "Sitharth's Assistant running."}

@app.post("/ask")
async def ask_question(data: Question):
    prompt = f"""You are an AI assistant trained only on the following profile context:

{profile_context}

Only use the above profile to answer the user's question.

User: {data.question}
Answer:"""

    response = llm(prompt, max_tokens=200, stop=["\n"])
    return {"answer": response["choices"][0]["text"].strip()}

