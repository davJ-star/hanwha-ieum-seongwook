from langchain import HuggingFacePipeline
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch

def load_eeve_model():
    model_name = "yanolja/EEVE-Korean-Instruct-10.8B-v1.0"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")
    
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_new_tokens=512,
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
        
        response = llm(user_input)
        print("EEVE:", response)

if __name__ == "__main__":
    eeve_model = load_eeve_model()
    chat_with_eeve(eeve_model)

# python eeveKorean.py