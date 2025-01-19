import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from huggingface_hub import snapshot_download

# 모델 다운로드
model_name = "BioMistral/BioMistral-7B"
print("모델 다운로드 중...")
snapshot_download(repo_id=model_name, local_dir="./biomistral_model")
print("모델 다운로드 완료")

# 토크나이저와 모델 로드
print("토크나이저와 모델 로딩 중...")
tokenizer = AutoTokenizer.from_pretrained("./biomistral_model")
model = AutoModelForCausalLM.from_pretrained("./biomistral_model")
print("토크나이저와 모델 로딩 완료")

# GPU 사용 가능 여부 확인 및 설정
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)
print(f"사용 중인 디바이스: {device}")

# 텍스트 생성 함수
def generate_text(prompt, max_length=100):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(**inputs, max_length=max_length)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# 사용자 입력 및 텍스트 생성
while True:
    user_prompt = input("질문을 입력하세요 (종료하려면 'quit' 입력): ")
    if user_prompt.lower() == 'quit':
        break
    
    print("응답 생성 중...")
    response = generate_text(user_prompt)
    print("생성된 응답:", response)
    print()

print("프로그램을 종료합니다.")
