import requests

base_url = "http://127.0.0.1:8000"

# /generate 엔드포인트 테스트
generate_data = {
    "model": "llama3",
    #"prompt": "'너는 한국어에 능통한 의사야. 7살이 아래 질병에 대해 이해할 수 있도록 상황 같은 비유와 일상적인 예시를 꼭 포함해줘. 7살에게 어려운 단어를 쉽게 풀어썼는지 확실하게 체크해서  한국어로 번역한 전체 문장으로 출력해줘.'[CDATA[ 직장탈출증 환자는 직장이 복강 내에서 정상적으로 붙어있어야 할 천골 및 주위 조직으로부터 분리되어 느슨하게 되어 항문 밖으로 나와 있습니다. 이에 따라 항문조임근도 심하게 늘어나 괄약근 기능이 약화되므로 변실금이 동반되는 경우가 많습니다. 여성에서는 직장과 함께 골반장기가 같이 하강하여 자궁이나 방광이 같이 탈출되거나, 요실금을 동반하는 경우도 있습니다. 직장이 서로 겹쳐있으나 항문 밖으로 튀어나오지 않은 잠복된 직장탈출 형태도 있으며, 직장은 나오지 않고 직장점막만 탈출되는 직장점막탈출도 직장탈출증의 한가지 형태입니다. ]]" #"prompt": "Why is the sky blue?"
    "prompt": "너는 최고의 번역가로 월드 베스트셀러도 수백권 번역했고, 영화도 번역했어. 이 경험을 바탕으로 한국어로 자연스럽게 모든 문장을 번역해서 출력해줘'I\'d be happy to help! 😊\n\nHere\'s a translation of the text into child-friendly language, with examples and analogies that a 7-year-old can understand:\n\nHey kids! Let\'s talk about something called \'constipation\'. You know how sometimes you feel like you really need to go to the bathroom, but it doesn\'t come out easily? That\'s kind of what happens when someone has constipation. Their intestines get a bit mixed up and can\'t push poop out properly.\n\nImagine your intestines are like a long, winding road that poop needs to travel down to get out of your body. When you have constipation, it\'s like the road gets blocked or bumpy, so the poop can\'t move along easily. Sometimes, this can make the poop come out in small pieces, or even stay stuck inside for a really long time.\n\nFor girls, having constipation can be especially tricky because their intestines and uterus (the organ that holds a baby) are connected. When the intestines get mixed up, it can affect how well the uterus works too! It\'s like when you\'re trying to ride a bike, but your seat is all wonky and makes it hard to balance.\n\nThere are even times when someone might have constipation, but their intestines don\'t actually push poop out. Instead, just the lining of the intestines comes out, like when you peel an orange! It\'s not super fun, but doctors can help people feel better by giving them special medicine or teaching them how to eat foods that are good for their tummies.\n\nLet me know if this meets your requirements! 🤗'}"
}
generate_response = requests.post(f"{base_url}/generate", json=generate_data)
print("Generate Response:", generate_response.json())

# /chat 엔드포인트 테스트 -> chat은 계속 오류가 남. 확인 바람람
chat_data = {
    "model": "llama3",
    "prompt": "'7살이 아래 질병에 대해 이해할 수 있도록 상황 같은 비유와 일상적인 예시를 꼭 포함하여 한국어로 번역한 전체 문장으로 출력해줘.  '[CDATA[ 직장탈출증 환자는 직장이 복강 내에서 정상적으로 붙어있어야 할 천골 및 주위 조직으로부터 분리되어 느슨하게 되어 항문 밖으로 나와 있습니다. 이에 따라 항문조임근도 심하게 늘어나 괄약근 기능이 약화되므로 변실금이 동반되는 경우가 많습니다. 여성에서는 직장과 함께 골반장기가 같이 하강하여 자궁이나 방광이 같이 탈출되거나, 요실금을 동반하는 경우도 있습니다. 직장이 서로 겹쳐있으나 항문 밖으로 튀어나오지 않은 잠복된 직장탈출 형태도 있으며, 직장은 나오지 않고 직장점막만 탈출되는 직장점막탈출도 직장탈출증의 한가지 형태입니다. ]]" #"prompt": "Why is the sky blue?"
}
chat_response = requests.post(f"{base_url}/chat", json=chat_data)
print("Chat Response:", chat_response.json())
