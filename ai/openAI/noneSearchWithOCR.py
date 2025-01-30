import os
from openai import OpenAI
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def fetch_medical_info(category, query=None, ocr_words=None):
    """
    특정 질병 또는 의약품에 대한 정보를 검색하고,  
    OCR 결과를 기반으로 유사한 검색어를 유추하는 기능을 포함한 함수.

    :param category: "질병" 또는 "의약품" (검색 유형)
    :param query: 사용자가 검색한 질병 또는 의약품명
    :param ocr_words: OCR로 추출된 단어 리스트 (기본값: None)
    :return: OpenAI의 응답 메시지 (의학 정보)
    """

    # OCR에서 추출된 단어가 있을 경우, 이를 이용해 검색어를 유추하는 부분 추가
    ocr_info = ""
    if ocr_words:
        ocr_text = ", ".join(ocr_words)
        ocr_info = f"""
        추가적으로, OCR을 통해 아래 단어들이 추출되었습니다:
        - 추출된 단어: {ocr_text}
        
        만약 사용자가 `{query}`을(를) 찾고자 한 것이 맞다면, 확신을 갖고 정보를 제공해 주세요.
        그렇지 않다면, OCR 단어를 참고하여 가장 확률 높은 질병 또는 의약품을 유추하고 
        "이것을 찾으신 것이 맞습니까?" 형식으로 먼저 확인해 주세요.
        """

    prompt = f"""
    당신은 의학 전문가이자 의료 검색 어시스턴트입니다.  
    사용자가 특정 **{category}** 정보를 검색했으나, 내부 데이터베이스에서 해당 정보를 찾을 수 없습니다.  
    이에 따라 신뢰할 수 있는 정보를 제공하여 사용자가 유사한 의료 정보를 얻을 수 있도록 도와주세요.  

    [📝 요청 정보]
    - 검색 유형: {category}
    - 검색어: "{query}"
    {ocr_info}

    [📌 출력 형식]
    1️⃣ **검색어 유추** (OCR 포함)  
       - OCR로 추출된 단어와 비교하여 가장 가능성 높은 검색어 판단  
       - 만약 확신할 수 있다면, "이것을 찾으신 것이 맞습니까?" 대신 바로 정보를 제공  
       - 확신할 수 없다면, "이것을 찾으신 것이 맞습니까?" 질문 포함  

    2️⃣ **요약 설명** (100자 이내)  
       - 해당 {category}의 간략한 개요 제공  
       - 일반적인 사용 목적 또는 발생 원인 설명  

    3️⃣ **세부 정보**  
       - (질병) 주요 증상, 원인, 치료법  
       - (의약품) 주요 성분, 일반적인 용도, 복용 방법  

    4️⃣ **주의 사항**  
       - (질병) 응급 여부 및 병원 방문이 필요한 경우  
       - (의약품) 부작용, 복용 시 주의할 점  

    5️⃣ **관련 검색어 추천**  
       - 사용자가 유사한 정보를 찾을 수 있도록 관련 검색어 3~5개 추천  

    [📌 출력 예시]
    ```
    ❗ 찾으시는 정보가 내부 데이터베이스에 없습니다. 하지만 다음 정보를 참고하세요.

    📌 **{query}란?**  
    {query}은(는) [간략한 설명].

    📖 **자세한 정보**  
    - 주요 증상 또는 성분: [설명]  
    - 원인 또는 사용 목적: [설명]  
    - 치료법 또는 복용법: [설명]  

    ⚠️ **주의 사항**  
    - 응급 상황 여부: [설명]  
    - 복용 시 주의해야 할 점: [설명]  

    🔍 **관련 검색어 추천**  
    - [추천 검색어 1], [추천 검색어 2], [추천 검색어 3]
    ```

    [⚠️ 중요한 점]  
    1️⃣ 검색 결과가 없는 경우, 사용자가 당황하지 않도록 **명확하고 친절한 안내** 제공  
    2️⃣ **의학적 신뢰성을 유지**하며 확정적인 진단을 내리지 않음  
    3️⃣ OCR 기반 검색 시, 검색어 유추 결과를 명확히 안내하여 혼란 방지  
    4️⃣ 너무 긴 설명을 피하고, **간결하게 핵심 정보만 정리**  
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a medical expert providing accurate and concise medical information."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=750
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"❗ 의료 정보를 생성하는 중 오류가 발생했습니다: {str(e)}"

# ===== 테스트 실행 ===== #
if __name__ == "__main__":
    # category = "질병"
    # query = "일본뇌염"
    # ocr_words = ["일본", "뇌", "염", "감기", "백신"]
    category = "질병"
    
    #ocr_words = ["이저", "닞나", "노", "에아", "가나"]
    #ocr_words = ["아세", "mg", "100", "노펜", "트아미"]
    ocr_words = None
    # query = None
    #query = "Zylophex"
    query = "자일로펙스"
    print(f"\n\n🔍 '{query if query else '입력값넣지않음'}' 검색 결과:")
    result = fetch_medical_info(category, query, ocr_words)
    #result = fetch_medical_info(category, query, ocr_words)
    print(result)
