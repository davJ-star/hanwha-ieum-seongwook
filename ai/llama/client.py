import requests

def send_prompt(prompt):
    # 로컬 주소는 알아서 변경해봐야함.
    url = "http://127.0.0.1:8000/generate"
    data = {"prompt": prompt}
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"오류 발생: {e}")
        if response.status_code == 422:
            print("서버 응답:", response.text)
        return None


if __name__ == "__main__":
    prompt = input("프롬프트를 입력하세요: ")
    result = send_prompt(prompt)
    if result and 'generated_text' in result:
        print("생성된 텍스트:", result["generated_text"])
    else:
        print("텍스트 생성에 실패했습니다.")
