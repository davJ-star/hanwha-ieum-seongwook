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
    situation: 현재 상황 설명 (예: "7살이 질병에 대해 궁금해하는 상황")
    original_info: 변환할 원본 의학 정보
    target_age: 대상 연령 (예: 7)
    """

    prompt = f"""
    당신은 복잡한 의학 정보를 누구나 이해할 수 있게 설명하는 전문가입니다.
    
    [📌 현재 설명할 정보]
    - 유형: {category}
    - 대상 연령: {target_age}세
    - 원본 정보:
      {original_info}
    
    [📝 변환 규칙]
    1️⃣ {target_age}세 어린이가 이해할 수 있도록 쉽게 설명하세요.
    2️⃣ 짧고 쉬운 문장을 사용하세요.
    3️⃣ 어려운 의학 용어는 일상적인 표현으로 바꾸세요.
    4️⃣ 풍선, 컵, 문 등 **일상적인 물건을 활용한 비유**를 사용해 설명하세요.
    5️⃣ 설명을 **3~4개의 짧은 단락**으로 나누어 주세요.
    6️⃣ 어린이가 무서워하지 않도록 **부드럽고 친근한 톤**으로 설명하세요.
    7️⃣ **"주의해야 할 점"**이 있는 경우 가장 마지막 단락에서 강조하세요.

    [📌 추가 규칙 - 카테고리별 맞춤 변환]
    - 질병: ❗ 주요 증상과 영향을 강조하세요. 치료 방법도 간단히 설명하세요.
    - 의약품: 🚨 **복용 시 주의사항, 부작용, 보관 방법을 명확히 정리**하세요.

    이제 {target_age}세 어린이를 위해 설명을 쉽게 다시 써 주세요.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful medical information translator for children."},
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