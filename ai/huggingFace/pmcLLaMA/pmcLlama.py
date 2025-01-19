from transformers import LlamaTokenizer, LlamaForCausalLM
import torch

# 모델 및 토크나이저 로드
model_name = "chaoyi-wu/PMC_LLAMA_7B"
tokenizer = LlamaTokenizer.from_pretrained(model_name)
model = LlamaForCausalLM.from_pretrained(model_name)

def generate_text(prompt, max_length=200):
    inputs = tokenizer(prompt, return_tensors="pt")
    
    with torch.no_grad():
        generated = model.generate(
            inputs["input_ids"],
            max_length=max_length,
            num_return_sequences=1,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.7
        )
    
    return tokenizer.decode(generated[0], skip_special_tokens=True)

# 예시 사용
prompt = "The role of antibiotics in treating bacterial infections is"
generated_text = generate_text(prompt)
print(generated_text)
