from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_ollama import OllamaLLM
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("Starting the FastAPI application...")

app = FastAPI()
llm = OllamaLLM(model="llama3")

class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

@app.post("/generate")
async def generate_text(request: PromptRequest):
    try:
        response = llm(request.prompt)
        return {"generated_text": response}
    except Exception as e:
        logger.error(f"Error generating text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    print("FastAPI application is ready.")
