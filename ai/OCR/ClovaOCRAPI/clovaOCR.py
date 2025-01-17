import os
import requests
import uuid
import time
import json
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# API 설정
api_url = os.getenv('CLOVA_OCR_API_URL')
secret_key = os.getenv('CLOVA_OCR_API_SECRET_KEY').strip('"')
image_path = 'C:\\Users\\82106\\develop\\hanwha-ieum\\ai\\img\\test.jpg'

# API 요청 준비
request_json = {
    'images': [
        {
            'format': 'jpg',
            'name': 'demo'
        }
    ],
    'requestId': str(uuid.uuid4()),
    'version': 'V2',
    'timestamp': int(round(time.time() * 1000))
}

payload = {'message': json.dumps(request_json).encode('UTF-8')}
files = [
    ('file', open(image_path, 'rb'))
]
headers = {
    'X-OCR-SECRET': secret_key
}

# API 요청 보내기
response = requests.request("POST", api_url, headers=headers, data=payload, files=files)

# 결과 저장
result = response.json()
with open('result.json', 'w', encoding='utf-8') as make_file:
    json.dump(result, make_file, indent="\t", ensure_ascii=False)

# 텍스트 추출
text = ""
for field in result['images'][0]['fields']:
    text += field['inferText'] + " "

print("추출된 텍스트:")
print(text)
