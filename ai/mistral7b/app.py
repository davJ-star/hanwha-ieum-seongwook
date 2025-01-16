import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer

app = FastAPI()

# Mistral 7B 모델 및 토크나이저 로드
model_name = "mistralai/Mistral-7B-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")

class Query(BaseModel):
    text: str

@app.post("/generate")
async def generate_text(query: Query):
    try:
        # 입력 텍스트 토큰화
        inputs = tokenizer(query.text, return_tensors="pt").to(model.device)
        
        # 텍스트 생성
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=100,
                do_sample=True,
                temperature=0.7,
                top_k=50,
                top_p=0.95
            )
        
        # 생성된 텍스트 디코딩
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        return {"generated_text": generated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Mistral 7B API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
