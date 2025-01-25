import os
from openai import OpenAI
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def simplify_medical_info(page_type, situation, original_info, target_age):
    prompt = f"""
    당신은 복잡한 의학 정보를 누구나 이해할 수 있게 설명하는 전문가입니다.
    현재 상황: {situation}
    페이지 유형: {page_type}
    대상 연령: {target_age}세
    
    다음의 의학 정보를 {target_age}세 어린이가 이해할 수 있도록 다시 설명해주세요:

    {original_info}

    설명할 때 다음 사항을 지켜주세요:
    1. {target_age}세 어린이가 이해할 수 있는 단어와 개념을 사용하세요.
    2. 짧고 쉬운 문장으로 설명하세요.
    3. 복잡한 의학 용어는 사용하지 마세요.
    4. 풍선이나 일상적인 물건을 활용한 비유를 사용해 설명하세요.
    5. 전체 설명을 3-4개의 짧은 단락으로 나눠주세요.
    6. 중요한 점은 별표(*)로 강조해주세요.
    7. 어린이가 무서워하지 않도록 부드럽고 친근한 톤을 사용하세요.
    8. 각 증상이나 상태를 설명할 때 정확성을 유지하세요.
    9. 질병의 주요 특징을 간단히 요약하여 마무리하세요.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful medical information translator for children."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"설명을 생성하는 중 오류가 발생했습니다: {str(e)}"

# 서버에서 받은 질병 정보
original_info = """[CDATA[ 직장탈출증 환자는 직장이 복강 내에서 정상적으로 붙어있어야 할 천골 및 주위 조직으로부터 분리되어 느슨하게 되어 항문 밖으로 나와 있습니다. 이에 따라 항문조임근도 심하게 늘어나 괄약근 기능이 약화되므로 변실금이 동반되는 경우가 많습니다. 여성에서는 직장과 함께 골반장기가 같이 하강하여 자궁이나 방광이 같이 탈출되거나, 요실금을 동반하는 경우도 있습니다. 직장이 서로 겹쳐있으나 항문 밖으로 튀어나오지 않은 잠복된 직장탈출 형태도 있으며, 직장은 나오지 않고 직장점막만 탈출되는 직장점막탈출도 직장탈출증의 한가지 형태입니다. ]]"""

# 사용 예시
if __name__ == "__main__":
    disease_name = "직장탈출증"
    page_type = "어린이용 질병 정보 페이지"
    situation = "어린이가 가족의 질병에 대해 궁금해하는 상황"
    target_age = 7
    
    print(f"서버에서 받은 {disease_name} 정보:")
    print(original_info)
    print("\n" + "="*50 + "\n")
    
    simplified_info = simplify_medical_info(page_type, situation, original_info, target_age)
    print(f"{disease_name}에 대한 어린이용 쉬운 설명 (페이지: {page_type}, 상황: {situation}, 대상 연령: {target_age}세):")
    print(simplified_info)
