from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import logging

app = FastAPI()

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 요청 모델 정의
class PromptRequest(BaseModel):
    model: str
    prompt: str

# Llama3 API URL
LLAMA3_API_URL = "http://localhost:11434/api"

# /generate 엔드포인트
@app.post("/generate")
async def generate_text(request: PromptRequest):
    logger.info(f"Received generate request: {request}")
    url = f"{LLAMA3_API_URL}/generate"
    headers = {'Content-Type': 'application/json'}
    
    data = {
        "model": request.model,
        "prompt": request.prompt
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail="Generate request failed")
    except Exception as e:
        logger.error(f"Generate request failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generate request failed: {str(e)}")

# /chat 엔드포인트

# chat은 계속 오류가 남. 확인 바람!
@app.post("/chat")
async def chat_with_llama(request: PromptRequest):
    logger.info(f"Received chat request: {request}")
    url = f"{LLAMA3_API_URL}/chat"
    headers = {'Content-Type': 'application/json'}
    
    data = {
        "model": request.model,
        "messages": [{"role": "user", "content": request.prompt}]
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail="Chat request failed")
    except Exception as e:
        logger.error(f"Chat request failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat request failed: {str(e)}")

# 서버 실행 (uvicorn main:app --reload)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

