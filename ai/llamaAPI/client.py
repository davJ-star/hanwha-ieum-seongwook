import requests

base_url = "http://127.0.0.1:8000"

# /generate 엔드포인트 테스트
generate_data = {
    "model": "llama3",
    "prompt": "Tell me about the history of South Korea."
}
generate_response = requests.post(f"{base_url}/generate", json=generate_data)
print("Generate Response:", generate_response.json())

# /chat 엔드포인트 테스트 -> chat은 계속 오류가 남. 확인 바람람
chat_data = {
    "model": "llama3",
    "prompt": "Why is the sky blue?"
}
chat_response = requests.post(f"{base_url}/chat", json=chat_data)
print("Chat Response:", chat_response.json())
