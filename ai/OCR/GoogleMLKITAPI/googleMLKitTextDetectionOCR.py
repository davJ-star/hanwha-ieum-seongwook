from langchain_community.llms import HuggingFacePipeline
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
import warnings

# 경고 무시 설정
warnings.filterwarnings("ignore", category=UserWarning)

def load_eeve_model():
    model_name = "yanolja/EEVE-Korean-Instruct-10.8B-v1.0"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")
    
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_new_tokens=512,
        do_sample=True,  # 샘플링 활성화
        temperature=0.7,
        top_p=0.95,
        repetition_penalty=1.15
    )
    
    local_llm = HuggingFacePipeline(pipeline=pipe)
    return local_llm

def chat_with_eeve(llm):
    print("EEVE-Korean 챗봇에 오신 것을 환영합니다! (종료하려면 'quit'를 입력하세요)")
    while True:
        user_input = input("사용자: ")
        if user_input.lower() == 'quit':
            break
        
        response = llm.invoke(user_input)  # __call__ 대신 invoke 사용
        print("EEVE:", response)

if __name__ == "__main__":
    eeve_model = load_eeve_model()
    chat_with_eeve(eeve_model)
