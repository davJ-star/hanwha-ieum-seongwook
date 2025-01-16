from fastapi import FastAPI
import requests
from pydantic import BaseModel

app = FastAPI()

# Define a request model for the prompt input
class PromptRequest(BaseModel):
    model: str
    prompt: str

# Endpoint to generate text using Llama3 API
@app.post("/generate")
async def generate_text(request: PromptRequest):
    url = "http://localhost:11434/api/generate"  # Replace with your Llama3 API URL
    headers = {'Content-Type': 'application/json'}
    
    data = {
        "model": request.model,
        "prompt": request.prompt
    }
    
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Request failed with status code: {response.status_code}"}

# Endpoint to chat with Llama3 API
@app.post("/chat")
async def chat_with_llama(request: PromptRequest):
    url = "http://localhost:11434/api/chat"  # Replace with your Llama3 API URL
    headers = {'Content-Type': 'application/json'}
    
    data = {
        "model": request.model,
        "messages": [{"role": "user", "content": request.prompt}]
    }
    
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Request failed with status code: {response.status_code}"}

# Run the application with 'uvicorn filename:app --reload'
