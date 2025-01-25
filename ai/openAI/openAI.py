import os
from dotenv import load_dotenv
from openai import OpenAI

# .env 파일에서 환경 변수 로드
load_dotenv()

# OpenAI API 키 설정
api_key = os.getenv("OPENAI_API_KEY")

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=api_key)

def generate_response(prompt):
    try:
        # API 호출
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # 또는 다른 적절한 모델
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens= 500 # 150
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"

# 메인 실행 부분
if __name__ == "__main__":
    #user_input = input("질문을 입력하세요: ")
    user_input = '''"아래 질병에 대해 설명해줘.

먼저 일반 성인이 이해할 수 있도록 어려운 용어를 쉽게 풀어서 설명해줘.
다음으로 초등학생이 이해할 수 있는 수준으로 더 단순한 말로 바꿔줘.
마지막으로 7살 어린이가 이해할 수 있도록 짧고 쉬운 문장으로 다시 설명해줘.
풍선이 터지는 상황 같은 비유나 일상적인 예시를 꼭 포함해줘. 답변 후 내가 이해했는지 확인할 수 있도록 질문할게."

[CDATA[ 직장탈출증 환자는 직장이 복강 내에서 정상적으로 붙어있어야 할 천골 및 주위 조직으로부터 분리되어 느슨하게 되어 항문 밖으로 나와 있습니다. 이에 따라 항문조임근도 심하게 늘어나 괄약근 기능이 약화되므로 변실금이 동반되는 경우가 많습니다. 여성에서는 직장과 함께 골반장기가 같이 하강하여 자궁이나 방광이 같이 탈출되거나, 요실금을 동반하는 경우도 있습니다. 직장이 서로 겹쳐있으나 항문 밖으로 튀어나오지 않은 잠복된 직장탈출 형태도 있으며, 직장은 나오지 않고 직장점막만 탈출되는 직장점막탈출도 직장탈출증의 한가지 형태입니다. ]]'''
    response = generate_response(user_input)
    print("응답:", response)
