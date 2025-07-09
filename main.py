from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_cpp import Llama
import os

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

# Load the LLaMA model only once
llm = Llama(
    model_path=r"D:/llama-3-open-hermes-disco.i1-Q4_K_M.gguf",  # Use raw string or forward slashes
    n_ctx=4096,
    n_threads=8,
    verbose=True,
)

@app.get("/")
def read_root():
    return {"message": "Sitharth's Assistant is running."}

@app.post("/ask")
async def ask_question(data: Question):
    prompt = f"""You are a helpful AI assistant with access to the following profile:

{profile_context}

Use this profile to answer the question.

User: {data.question}
Assistant:"""

    response = llm(prompt, max_tokens=300, stop=["User:", "Assistant:"], temperature=0.7)
    return {"answer": response["choices"][0]["text"].strip()}

# Run the app if script is executed directly (required for deployment)
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))  # Required by Render or Railway
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
