import os
from openai import OpenAI
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def fetch_medical_info_with_ocr(category, query, ocr_words):
    """
    OCR을 활용하여 의약품 또는 질병 검색을 수행하는 함수.
    """
    ocr_text = ", ".join(ocr_words) if ocr_words else "없음"

    prompt = f"""
    당신은 의료 검색 AI이며, OCR 기반으로 유사한 의료 정보를 제공하는 역할을 합니다.  
    사용자가 특정 **{category}** 정보를 검색했으나, 내부 데이터베이스에서 해당 정보를 찾을 수 없습니다.  
    따라서 OCR로 추출된 단어를 참고하여 신뢰할 수 있는 정보를 제공하세요.

    [📝 요청 정보]
    - 검색 유형: {category}
    - 검색어: "{query}"
    - OCR 추출 단어: "{ocr_text}"

    [⚠️ OCR 기반 검색 가이드라인]
    1️⃣ OCR 결과를 이용해 유사한 검색어를 추출하되, **검색어가 다를 경우 경고 메시지 제공**  
    2️⃣ OCR 단어가 실제 존재하는 의약품/질병과 5자 이상 차이나면 추천하지 않음  
    3️⃣ **유사한 단어를 추천할 경우**, "이것을 찾으신 것이 맞습니까?" 형식으로 먼저 확인 요청  

    [📌 출력 형식]
    ```
    ❗ 찾으시는 정보가 내부 데이터베이스에 없습니다.

    📌 **{query}란?**
    "{query}"이라는 정확한 명칭의 {category}은 확인되지 않습니다.

    🔎 **OCR 기반 유사 검색어 추천**  
    - OCR로 유사한 검색어를 찾았습니다: [추천 검색어 1], [추천 검색어 2]  
    - 단, OCR 인식 오류 가능성이 있으므로 추가 검색을 권장합니다.  

    📖 **추가 정보**  
    - 검색된 정보가 없을 경우, 관련된 범주의 의료 정보 제공  
    - 예: "항생제에 대한 일반적인 정보는 다음과 같습니다."
    ```
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
    category = "의약품"
    query = "자일로펙스"  # 없는 의약품
    ocr_words = ["자일로메타졸린", "자이로펜"]  # OCR에서 추출된 유사한 단어

    print(f"\n\n🔍 '{query}' 검색 결과 (OCR 기반):")
    result = fetch_medical_info_with_ocr(category, query, ocr_words)
    print(result)




# import os
# from openai import OpenAI
# from dotenv import load_dotenv

# # .env 파일에서 환경 변수 로드
# load_dotenv()

# # OpenAI 클라이언트 초기화
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# def fetch_medical_info(category, query=None, ocr_words=None):
#     """
#     특정 질병 또는 의약품에 대한 정보를 검색하고,  
#     OCR 결과를 기반으로 유사한 검색어를 유추하는 기능을 포함한 함수.

#     :param category: "질병" 또는 "의약품" (검색 유형)
#     :param query: 사용자가 검색한 질병 또는 의약품명
#     :param ocr_words: OCR로 추출된 단어 리스트 (기본값: None)
#     :return: OpenAI의 응답 메시지 (의학 정보)
#     """

#     # OCR에서 추출된 단어가 있을 경우, 이를 이용해 검색어를 유추하는 부분 추가
#     ocr_info = ""
#     if ocr_words:
#         ocr_text = ", ".join(ocr_words)
#         ocr_info = f"""
#         추가적으로, OCR을 통해 아래 단어들이 추출되었습니다:
#         - 추출된 단어: {ocr_text}
        
#         만약 사용자가 `{query}`을(를) 찾고자 한 것이 맞다면, 확신을 갖고 정보를 제공해 주세요.
#         그렇지 않다면, OCR 단어를 참고하여 가장 확률 높은 질병 또는 의약품을 유추하고 
#         "이것을 찾으신 것이 맞습니까?" 형식으로 먼저 확인해 주세요.
#         """

#     prompt = f"""
#     당신은 의학 전문가이자 의료 검색 어시스턴트입니다.  
#     사용자가 특정 **{category}** 정보를 검색했으나, 내부 데이터베이스에서 해당 정보를 찾을 수 없습니다.  
#     이에 따라 신뢰할 수 있는 정보를 제공하여 사용자가 유사한 의료 정보를 얻을 수 있도록 도와주세요.  

#     [📝 요청 정보]
#     - 검색 유형: {category}
#     - 검색어: "{query}"
#     {ocr_info}

#     [⚠️ 주의 사항]
#     1️⃣ **검색된 정보가 없는 경우**  
#        - 사용자가 입력한 검색어가 존재하지 않으면 **"존재하지 않는다"**라고 명확히 안내  
#        - 유사한 검색어를 제공하더라도, 사용자가 오해하지 않도록 `"단, 유사한 이름일 수 있으니 추가 검색을 권장합니다."`라고 안내  

#     2️⃣ **잘못된 정보 제공 금지**  
#        - LLM이 유사한 단어를 판단하더라도, 없는 의약품은 **있다고 가정하지 않음**  
#        - 검색어가 불명확할 경우, `"유사한 의약품이 존재할 수 있으니 직접 검색을 추천합니다."`라고 안내  

#     3️⃣ **유사 검색어 제공 방식 개선**  
#        - 단순히 비슷한 발음의 단어를 제공하지 않고, **실제 존재하는 의약품 또는 질병만 추천**  
#        - "유사한 단어"라 하더라도, **5자 이상 차이가 나면 추천하지 않음**  

#     [📌 출력 형식]
#     ```
#     ❗ 찾으시는 정보가 내부 데이터베이스에 없습니다.

#     📌 **{query}란?**
#     "{query}"이라는 정확한 명칭의 {category}은 확인되지 않습니다.

#     🔎 **유사 검색어 추천**  
#     - [추천 검색어 1], [추천 검색어 2], [추천 검색어 3]
#     - 단, 유사한 이름일 수 있으니 추가 검색을 권장합니다.

#     📖 **추가 정보**  
#     - 검색된 정보가 없을 경우, 관련된 범주의 의료 정보 제공  
#     - 예: "항생제에 대한 일반적인 정보는 다음과 같습니다."
#     ```

#     """

#     try:
#         response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "You are a medical expert providing accurate and concise medical information."},
#                 {"role": "user", "content": prompt}
#             ],
#             max_tokens=750
#         )
#         return response.choices[0].message.content.strip()
#     except Exception as e:
#         return f"❗ 의료 정보를 생성하는 중 오류가 발생했습니다: {str(e)}"

# # ===== 테스트 실행 ===== #
# if __name__ == "__main__":
#     category = "의약품"
#     # query = "타이레놀"  # 유사한 의약품 검색
#     query = "아세트아미노펜" # 정확한 의약품명 검색
#     # query = None
#     #query = "자일로펙스"  # 없는 의약품
#     ocr_words = None

#     print(f"\n\n🔍 '{query if query else '입력값넣지않음'}' 검색 결과:")
#     result = fetch_medical_info(category, query, ocr_words)
#     print(result)
