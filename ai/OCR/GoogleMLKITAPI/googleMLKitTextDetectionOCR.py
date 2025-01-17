from google.cloud import vision
import io

def detect_text(path):
    """이미지 파일에서 텍스트를 감지합니다."""
    client = vision.ImageAnnotatorClient()

    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    print('텍스트:')
    for text in texts:
        print(f'\n"{text.description}"')
        vertices = [f'({vertex.x},{vertex.y})' for vertex in text.bounding_poly.vertices]
        print('경계: {}'.format(','.join(vertices)))

    if response.error.message:
        raise Exception(f'{response.error.message}\n자세한 오류 정보: https://cloud.google.com/apis/design/errors')

# 이미지 파일 경로를 지정하여 함수 호출
detect_text('C:\\Users\\82106\\develop\\hanwha-ieum\\ai\\img\\test.jpg')
