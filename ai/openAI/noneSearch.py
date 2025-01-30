import os
from openai import OpenAI
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def fetch_medical_info(category, query):
    """
    category: "질병" 또는 "의약품"
    query: 사용자가 검색한 질병 또는 의약품명
    """

    prompt = f"""
    당신은 의학 전문가이자 의료 검색 어시스턴트입니다.  
    사용자가 특정 **질병 또는 의약품**을 검색했으나, 내부 데이터베이스에서 해당 정보를 찾을 수 없습니다.  
    이를 보완하기 위해 당신은 신뢰할 수 있는 정보에 기반하여 사용자에게 도움이 될 만한 대체 정보를 제공해야 합니다.  

    [📝 요청 정보]
    - 검색 유형: {category} (질병 또는 의약품)
    - 검색어: "{query}"
    - 추가 설명: 사용자가 "{query}"을(를) 검색했으나 내부 DB에 존재하지 않음.

    [📌 출력 형식]
    1️⃣ **요약 설명** (100자 이내)  
       - 해당 질병 또는 의약품의 간단한 개요 제공  
       - 일반적으로 어떤 상황에서 사용되는지 설명  

    2️⃣ **세부 정보**  
       - (질병인 경우) 주요 증상, 원인, 일반적인 치료법  
       - (의약품인 경우) 주요 성분, 일반적인 용도, 복용 방법  

    3️⃣ **주의 사항**  
       - (질병인 경우) 응급 상황인지 여부, 병원 방문이 필요한 경우  
       - (의약품인 경우) 부작용, 복용 시 주의해야 할 점  

    4️⃣ **관련 검색어 추천**  
       - 사용자가 유사한 정보를 찾을 수 있도록 관련 검색어 3~5개 추천  
       - 예: 감기 -> "독감", "알레르기성 비염", "코막힘"  
       - 예: 타이레놀 -> "아세트아미노펜", "해열제", "진통제"  

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
    2️⃣ **의학적 신뢰성을 유지**하며 너무 단정적인 진단은 하지 않음  
    3️⃣ **데이터 형식을 유지**하여 프론트엔드에서 일관되게 표시 가능하도록 설계  
    4️⃣ 너무 긴 설명은 피하고, 최대한 **간결하게 요점만 정리**  
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a medical expert who provides accurate and concise medical information."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"의료 정보를 생성하는 중 오류가 발생했습니다: {str(e)}"

# ===== 테스트 실행 ===== #
if __name__ == "__main__":
    category = "질병"
    query = "일본뇌염"

    print(f"\n\n🔍 '{query}' 검색 결과:")
    result = fetch_medical_info(category, query)
    print(result)
