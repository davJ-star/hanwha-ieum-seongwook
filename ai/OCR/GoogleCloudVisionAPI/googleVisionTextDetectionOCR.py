from dotenv import load_dotenv
import os
from google.cloud import vision
from google.oauth2 import service_account
import io

# .env 파일 로드
load_dotenv()

def detect_text(image_path):
    # 서비스 계정 키 파일 경로
    key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS').strip('"')
    print(f"서비스 계정 키 파일 경로: {key_path}")  # 디버깅을 위해 추가

    # 파일 존재 여부 확인
    if not os.path.exists(key_path):
        raise FileNotFoundError(f"서비스 계정 키 파일을 찾을 수 없습니다: {key_path}")
    
    """이미지 파일에서 텍스트를 감지합니다."""
    # 인증 정보 로드
    credentials = service_account.Credentials.from_service_account_file(key_path)

    # Vision 클라이언트 생성
    client = vision.ImageAnnotatorClient(credentials=credentials)

    # 이미지 파일 열기
    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    # 텍스트 감지 요청
    response = client.text_detection(image=image)
    texts = response.text_annotations

    print('감지된 텍스트:')
    for text in texts:
        print(f'"{text.description}"')

    if response.error.message:
        raise Exception(
            f'텍스트 감지 중 오류 발생: {response.error.message}')

# 사용 예시
if __name__ == "__main__":
    # 'path_to_image.jpg'를 실제 이미지 파일 경로로 바꾸세요
    image_path = 'C:\\Users\\82106\\develop\\hanwha-ieum\\ai\\img\\test.jpg'

    detect_text(image_path)
