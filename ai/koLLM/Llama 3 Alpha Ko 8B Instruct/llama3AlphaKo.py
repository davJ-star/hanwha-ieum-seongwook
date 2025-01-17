import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import os

def load_model():
    model_name = "beomi/llama-3-ko-8b-instruct"
    tokenizer = AutoTokenizer.from_pretrained(model_name, token=os.environ.get("HUGGINGFACE_TOKEN"))
    model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto", token=os.environ.get("HUGGINGFACE_TOKEN"))
    return tokenizer, model

def generate_response(tokenizer, model, prompt, max_length=512):
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_length=max_length, num_return_sequences=1, do_sample=True, temperature=0.7)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

def main():
    tokenizer, model = load_model()
    
    while True:
        user_input = input("사용자: ")
        if user_input.lower() == 'quit':
            break
        
        prompt = f"사용자: {user_input}\n시스템: 사용자의 질문에 친절하고 정확하게 답변해주세요.\n답변: "
        response = generate_response(tokenizer, model, prompt)
        print("모델:", response)

if __name__ == "__main__":
    main()
