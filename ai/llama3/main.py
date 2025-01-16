from fastapi import FastAPI
from pydantic import BaseModel
import httpx

app = FastAPI()

class LlamaRequest(BaseModel):
    model: str
    prompt: str

@app.post("/generate")
async def generate_response(request: LlamaRequest):
    url = "http://localhost:11434/api/generate"  # Adjust based on your LLaMA 3 API endpoint
    headers = {'Content-Type': 'application/json'}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=request.dict(), headers=headers)
        
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to generate response", "status_code": response.status_code}

@app.get("/")
def read_root():
    return {"message": "Welcome to the LLaMA 3 FastAPI service!"}
