import os
from openai import OpenAI
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
def simplify_medical_info(category, page_type, situation, original_info, target_age):
    """
    category: "질병" 또는 "의약품"
    page_type: 페이지 유형 (예: "어린이용 질병 정보 페이지" 또는 "어린이용 의약품 정보 페이지")
    situation: 현재 상황 설명 (예: "7살이 약을 먹어도 되는지 궁금해하는 상황")
    original_info: 변환할 원본 의학 정보
    target_age: 대상 연령 (예: 7)
    """

    prompt = f"""
    당신은 **어린이를 위한 의학 정보 전문가**입니다.  
    어려운 의학 정보를 **쉽고 친절하게** 설명하는 것이 목표입니다.  
    현재 설명해야 할 내용은 다음과 같습니다.

    [📌 현재 설명할 정보]
    - 유형: {category}
    - 대상 연령: {target_age}세
    - 페이지 유형: {page_type}
    - 상황: {situation}
    - 원본 정보:
      {original_info}
    
    [📝 설명할 때 지켜야 할 규칙]

    1️⃣ **{target_age}세 어린이가 이해할 수 있도록 쉽고 친근한 표현을 사용하세요.**  
    2️⃣ **어려운 의학 용어는 절대 사용하지 마세요.**  
        ❌ 금지 예시: "쇽 증상", "천식발작", "혈소판 감소", "간손상"  
        ⭕ 쉬운 표현 예시: "피부가 가려울 수 있어요.", "배가 아플 수도 있어요."  
    3️⃣ **설명을 짧고 쉽게 정리하세요.** (한 문장은 15단어 이하)  
    4️⃣ **어린이가 공감할 수 있는 친근한 비유를 사용하세요.**  
        예) "이 약은 감기에 걸렸을 때, 따뜻한 차처럼 몸을 편하게 해줘요."  
    5️⃣ **설명을 5개의 단락으로 나누세요. (각 단락은 2~3문장)**  
    
    6️⃣ **약 이름을 첫 문장에서 *꼭* (반드시)) 언급하세요.**  
        예) "아세트아미노펜은 아플 때 도움을 주는 약이에요."  
    7️⃣ **어린이가 불안해하지 않도록 부드러운 어조를 사용하세요.**  
    8️⃣ **약 복용 시 주의사항을 강조하되, 무서운 표현은 피하세요.**  
        예) "약을 너무 많이 먹으면 몸이 놀랄 수 있어요. 그러니 엄마, 아빠와 함께 먹어요!"  
    9️⃣ **마지막 문장은 어린이가 약을 올바르게 복용하도록 유도하는 말로 마무리하세요.**  
        예) "건강을 지키려면 약을 바르게 먹는 게 중요해요! 😊"

    [📌 출력 예시 (정확히 이 형식으로 출력해야 함)]
    ```
    안녕! 이 약은 아프거나 열이 날 때 먹어요. 이 약을 먹으면 몸이 더 편안해질 거야.

    하지만 너무 많이 먹으면 몸이 깜짝 놀랄 수 있어. 하루에 네 번 이상 먹으면 안 돼.

    이 약은 어린이보다는 어른들이 더 자주 먹는 약이야. 아프면 엄마나 아빠에게 도움을 요청해야 해!

    약은 따뜻한 곳에 두면 안 돼. 그리고 어린이가 쉽게 찾을 수 없는 곳에 보관해야 해.

    약을 먹을 땐 언제나 조심해야 해! 몸이 이상하면 바로 엄마나 아빠에게 이야기하자! 😊
    ```
    
    이제 위의 규칙을 엄격하게 지켜서 {target_age}세 어린이를 위한 쉬운 설명을 작성하세요.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a medical expert who simplifies information for children."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"설명을 생성하는 중 오류가 발생했습니다: {str(e)}"



# ===== 질병 변환 테스트 ===== #
if __name__ == "__main__":
    medicine_name = "아세트아미노펜"
    page_type = "어린이용 의약품 정보 페이지"
    situation = "7살이 약을 먹어도 되는지 궁금해하는 상황"
    target_age = 7
    original_medicine_info = """
    {
        "atpnWarnQesitm": "매일 세 잔 이상 정기적 음주자가 이 약 또는 다른 해열진통제를 복용할 때는 의사 또는 약사와 상의하십시오. 간손상을 일으킬 수 있습니다.\n\n매우 드물게 치명적일 수 있는 급성 전신성 발진성 고름물집증, 스티븐스-존슨 증후군, 독성 표피 괴사용해와 같은 중대한 피부반응이 보고되었고 이 약 복용후 피부발진 또는 다른 과민반응의 징후가 나타나는 경우 즉시 복용을 중단하십시오.\n\n아세트아미노펜으로 일일 최대 용량(4,000 mg)을 초과하여 복용하지 마십시오. 간손상을 일으킬 수 있습니다. 아세트아미노펜을 포함하는 다른 제품과 함께 복용하지 마십시오.\n",
        "atpnQesitm": "이 약에 과민증, 소화성궤양, 심한 혈액 이상, 간장애, 신장(콩팥)장애, 심장기능저하 환자, 아스피린 천식(비스테로이드성 소염(항염)제에 의한 천식발작 유발) 환자 또는 경험자, 바르비탈계 약물 또는 삼환계 항우울제 복용한 환자, 알코올을 복용한 사람, 12세 미만의 소아는 이 약을 복용하지 마십시오.\n",
        "seQesitm": "쇽 증상(호흡곤란, 온몸이 붉어짐, 혈관부기, 두드러기 등), 천식발작, 혈소판감소, 과립구감소 등이 나타날 수 있습니다.\n",
        "depositMethodQesitm": "실온에서 보관하십시오. 어린이의 손이 닿지 않는 곳에 보관하십시오.\n"
    }
    """

    print(f"\n\n서버에서 받은 {medicine_name} 정보:")
    print(original_medicine_info)
    print("\n" + "="*50 + "\n")

    simplified_medicine_info = simplify_medical_info("의약품", page_type, situation, original_medicine_info, target_age)
    print(f"{medicine_name}에 대한 어린이용 쉬운 설명 (페이지: {page_type}, 상황: {situation}, 대상 연령: {target_age}세):")
    print(simplified_medicine_info)