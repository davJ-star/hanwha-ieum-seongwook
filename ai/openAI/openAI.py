import os
from openai import OpenAI
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def simplify_medical_info(page_type, situation, original_info):
    prompt = f"""
    당신은 의학 정보를 일반인들이 이해하기 쉽게 설명하는 전문가입니다.
    현재 상황: {situation}
    페이지 유형: {page_type}
    
    다음의 의학 정보를 주어진 상황과 페이지 유형에 맞게, 일반인들이 쉽게 이해할 수 있도록 다시 설명해주세요:

    {original_info}

    설명할 때 다음 사항을 지켜주세요:
    1. 원본 정보의 내용만을 다루고, 새로운 정보를 추가하지 마세요.
    2. 의학 용어를 가능한 쉬운 일상 용어로 바꿔주세요.
    3. 복잡한 개념은 비유나 예시를 사용해 설명해주세요.
    4. 중요한 정보는 강조해주세요.
    5. 전체 설명을 2-3개의 짧은 단락으로 나눠주세요.
    6. 페이지 유형과 상황에 맞는 톤과 스타일을 사용하세요.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful medical information translator."},
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
    page_type = "질병 정보 페이지"
    situation = "사용자가 직장탈출증 증상으로 병원을 방문한 후 추가 정보를 찾는 상황"
    
    print(f"서버에서 받은 {disease_name} 정보:")
    print(original_info)
    print("\n" + "="*50 + "\n")
    
    simplified_info = simplify_medical_info(page_type, situation, original_info)
    print(f"{disease_name}에 대한 쉬운 설명 (페이지: {page_type}, 상황: {situation}):")
    print(simplified_info)
