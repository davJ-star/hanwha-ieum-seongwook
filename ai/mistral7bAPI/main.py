from fastapi import FastAPI
import requests

app = FastAPI()

@app.post("/mistral")
async def call_mistral_api(data: dict):
    url = "http://localhost:14434/api"  # Mistral API endpoint
    response = requests.post(url, json=data)
    return response.json()
