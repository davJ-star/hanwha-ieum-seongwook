from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os, uuid, time, json, requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


# 기본 요청 모델
class MedicalRequest(BaseModel):
    page_type: str
    situation: str
    original_info: str
    target_age: int


# 상세 요청 모델
class DetailedMedicalRequest(BaseModel):
    category: str
    page_type: str
    situation: str
    original_info: str
    target_age: int


# 약품 검색 요청 모델
class DrugSearchRequest(BaseModel):
    query: str
    ocr_words: Optional[List[str]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "query": "타이레놀",
                "ocr_words": ["타이레놀", "진통", "해열"]
            }
        }


# OCR 엔드포인트
@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    try:
        load_dotenv()
        api_url = os.getenv('CLOVA_OCR_API_URL')
        secret_key = os.getenv('CLOVA_OCR_API_SECRET_KEY').strip()

        request_json = {
            'images': [{'format': file.filename.split('.')[-1], 'name': 'demo'}],
            'requestId': str(uuid.uuid4()),
            'version': 'V2',
            'timestamp': int(round(time.time() * 1000))
        }

        payload = {'message': json.dumps(request_json).encode('UTF-8')}
        files = [('file', await file.read())]
        headers = {'X-OCR-SECRET': secret_key}

        response = requests.request("POST", api_url, headers=headers, data=payload, files=files)
        result = response.json()

        text = ""
        for field in result['images'][0]['fields']:
            text += field['inferText'] + " "

        return {"text": text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 기본 간단화 엔드포인트
@app.post("/simplify")
async def simplify_endpoint(request: MedicalRequest):
    try:
        load_dotenv()
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        prompt = f"""
        당신은 복잡한 의학 정보를 누구나 이해할 수 있게 설명하는 전문가입니다.
        현재 상황: {request.situation}
        페이지 유형: {request.page_type}
        대상 연령: {request.target_age}세

        다음의 의학 정보를 {request.target_age}세 어린이가 이해할 수 있도록 다시 존댓말로 설명해주세요:

        {request.original_info}

        설명할 때 다음 사항을 지켜주세요:
        1. {request.target_age}세 어린이가 이해할 수 있는 단어와 개념을 사용하세요.
        2. 짧고 쉬운 문장으로 설명하세요.
        3. 어렵고, 복잡한 의학 용어는 사용하지 마세요.
        4. 풍선이나 일상적인 물건을 활용한 비유를 사용해 설명하세요.
        5. 전체 설명을 3-4개의 짧은 단락으로 나눠주세요.
        6. 어린이가 무서워하지 않도록 부드럽고 친근한 톤을 사용하세요.
        7. 각 증상이나 상태를 설명할 때 정확성을 유지하세요.
        8. 질병의 주요 특징을 간단히 요약하여 마무리하세요.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful medical information translator for children."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000
        )

        return {"simplified_text": response.choices[0].message.content.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 상세 간단화 엔드포인트
@app.post("/simplify/detailed")
async def detailed_simplify_endpoint(request: DetailedMedicalRequest):
    try:
        load_dotenv()
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        prompt = f"""
        당신은 **어린이를 위한 의학 정보 전문가**입니다.  
        어려운 의학 정보를 **쉽고 친절하게** 설명하는 것이 목표입니다.  
        현재 설명해야 할 내용은 다음과 같습니다.

        [📌 현재 설명할 정보]
        - 유형: {request.category}
        - 대상 연령: {request.target_age}세
        - 페이지 유형: {request.page_type}
        - 상황: {request.situation}
        - 원본 정보:
          {request.original_info}

        [📝 설명할 때 지켜야 할 규칙]
        1️⃣ **{request.target_age}세 어린이가 이해할 수 있도록 쉽고 친근한 표현을 사용하세요.**  
        2️⃣ **어려운 의학 용어는 절대 사용하지 마세요.**  
            ❌ 금지 예시: "쇽 증상", "천식발작", "혈소판 감소", "간손상"  
            ⭕ 쉬운 표현 예시: "피부가 가려울 수 있어요.", "배가 아플 수도 있어요."  
        3️⃣ **설명을 짧고 쉽게 정리하세요.** (한 문장은 15단어 이하)  
        4️⃣ **어린이가 공감할 수 있는 친근한 비유를 사용하세요.**  
            예) "이 약은 감기에 걸렸을 때, 따뜻한 차처럼 몸을 편하게 해줘요."  
        5️⃣ **설명을 5개의 단락으로 나누세요. (각 단락은 2~3문장)**  
        6️⃣ **약 이름을 첫 문장에서 *꼭* (반드시)) 언급하세요.**  
        7️⃣ **어린이가 불안해하지 않도록 부드러운 어조를 사용하세요.**  
        8️⃣ **약 복용 시 주의사항을 강조하되, 무서운 표현은 피하세요.**  
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a medical expert who simplifies information for children."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000
        )

        return {"simplified_text": response.choices[0].message.content.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 새로운 요청 모델 추가
class BasicSearchRequest(BaseModel):
    query: str

    class Config:
        json_schema_extra = {
            "example": {
                "query": "타이레놀"
            }
        }

# 약품 검색 (OCR 없이) 엔드포인트 추가
@app.post("/search/drug/basic")
async def basic_drug_search_endpoint(request: BasicSearchRequest):
    try:
        load_dotenv()
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        prompt = f"""
        당신은 의학 전문가이자 의료 검색 어시스턴트입니다.  
        사용자가 특정 **의약품** 정보를 검색했으나, 내부 데이터베이스에서 해당 정보를 찾을 수 없습니다.  
        이에 따라 신뢰할 수 있는 정보를 제공하여 사용자가 유사한 의료 정보를 얻을 수 있도록 도와주세요.  

        [📝 요청 정보]
        - 검색 유형: 의약품
        - 검색어: "{request.query}"

        [⚠️ 주의 사항]
        1️⃣ **검색된 정보가 없는 경우**  
           - "{request.query}"라는 정확한 명칭의 의약품이 확인되지 않으면 **존재하지 않는다**고 명확히 안내  
           - 유사한 검색어를 제공하더라도, **"단, 유사한 이름일 수 있으니 추가 검색을 권장합니다."**라고 안내  

        2️⃣ **잘못된 정보 제공 금지**  
           - LLM이 유사한 단어를 판단하더라도, 없는 의약품은 **있다고 가정하지 않음**  
           - 검색어가 불명확할 경우, `"유사한 의약품이 존재할 수 있으니 직접 검색을 추천합니다."`라고 안내  

        3️⃣ **유사 검색어 제공 방식**  
           - 단순히 비슷한 발음의 단어를 제공하지 않고, **실제 존재하는 의약품만 추천**  
           - 5자 이상 차이나면 추천하지 않음  

        [📌 출력 형식]
        ```
        ❗ 찾으시는 정보가 내부 데이터베이스에 없습니다.

        📌 **{request.query}란?**
        "{request.query}"이라는 정확한 명칭의 의약품은 확인되지 않습니다.

        🔎 **유사 검색어 추천**  
        - [추천 검색어 1], [추천 검색어 2], [추천 검색어 3]
        - 단, 유사한 이름일 수 있으니 추가 검색을 권장합니다.

        📖 **추가 정보**  
        - 검색된 정보가 없을 경우, 관련된 범주의 의료 정보 제공
        ```
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a medical expert providing accurate and concise medical information."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=750
        )

        return {"result": response.choices[0].message.content.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 질병 검색 엔드포인트 추가
@app.post("/search/disease/basic")
async def basic_disease_search_endpoint(request: BasicSearchRequest):
    try:
        load_dotenv()
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        prompt = f"""
        당신은 의학 전문가이자 의료 검색 어시스턴트입니다.  
        사용자가 특정 **질병**을 검색했으나, 내부 데이터베이스에서 해당 정보를 찾을 수 없습니다.  
        이에 따라 신뢰할 수 있는 정보를 제공하여 사용자가 유사한 의료 정보를 얻을 수 있도록 도와주세요.  

        [📝 요청 정보]
        - 검색 유형: 질병
        - 검색어: "{request.query}"

        [📌 출력 형식]
        ```
        ❗ 찾으시는 정보가 내부 데이터베이스에 없습니다.

        📌 **{request.query}란?**  
        {request.query}은(는) [간략한 설명].

        📖 **자세한 정보**  
        - 주요 증상: [설명]  
        - 원인: [설명]  
        - 일반적인 치료법: [설명]  

        ⚠️ **주의 사항**  
        - 응급 상황 여부: [설명]  
        - 병원 방문이 필요한 경우: [설명]  

        🔍 **관련 검색어 추천**  
        - [추천 검색어 1], [추천 검색어 2], [추천 검색어 3]
        ```
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a medical expert providing accurate and concise medical information."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=750
        )

        return {"result": response.choices[0].message.content.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8001)
