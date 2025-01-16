from fastapi import FastAPI
from fastapi.responses import FileResponse
from langchain_ollama import OllamaLLM
import os

print("Starting the FastAPI application...")

app = FastAPI()
llm = OllamaLLM(model="llama3")

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

@app.post("/generate")
async def generate_text(prompt: str):
    response = llm(prompt)
    return {"generated_text": response}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse(os.path.join("static", "favicon.ico"))

if __name__ == "__main__":
    print("FastAPI application is ready.")
