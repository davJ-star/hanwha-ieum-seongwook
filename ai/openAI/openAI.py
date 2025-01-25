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

# 서버에서 받은 질병 정보를 시뮬레이션하는 함수
def get_disease_info_from_server(disease_name):
    # 실제로는 여기서 서버 API를 호출하여 정보를 받아옵니다
    return f"{disease_name}은 혈압이 정상보다 높은 만성 질환입니다. 수축기 혈압 140mmHg 이상 또는 이완기 혈압 90mmHg 이상일 때 진단됩니다. 주요 위험 요인으로는 나이, 가족력, 비만, 염분 과다 섭취, 스트레스 등이 있습니다. 합병증으로 심장병, 뇌졸중, 신장 질환 등이 발생할 수 있어 주의가 필요합니다."

# 사용 예시
if __name__ == "__main__":
    disease_name = "고혈압"
    page_type = "질병 정보 페이지"
    situation = "사용자가 처음으로 고혈압 진단을 받은 상황"
    
    original_info = get_disease_info_from_server(disease_name)
    print(f"서버에서 받은 {disease_name} 정보:")
    print(original_info)
    print("\n" + "="*50 + "\n")
    
    simplified_info = simplify_medical_info(page_type, situation, original_info)
    print(f"{disease_name}에 대한 쉬운 설명 (페이지: {page_type}, 상황: {situation}):")
    print(simplified_info)
