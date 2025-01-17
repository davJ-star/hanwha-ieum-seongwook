from dotenv import load_dotenv
import os
from google.cloud import vision
import io

# .env 파일 로드
load_dotenv()
image_path = 'C:\\Users\\82106\\develop\\hanwha-ieum\\ai\\img\\test.jpg'


def detect_text(image_path):
    """이미지 파일에서 텍스트를 감지합니다."""
    client = vision.ImageAnnotatorClient()

    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations

    print('감지된 텍스트:')
    for text in texts:
        print(f'"{text.description}"')

    if response.error.message:
        raise Exception(
            f'텍스트 감지 중 오류 발생: {response.error.message}')

# 사용 예시
# 'path_to_image.jpg'를 실제 이미지 파일 경로로 바꾸세요
detect_text(image_path)
