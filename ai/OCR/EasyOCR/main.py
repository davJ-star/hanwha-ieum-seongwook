import easyocr
import cv2

# EasyOCR 리더 초기화 (한국어와 영어 지원)
reader = easyocr.Reader(['ko']) # reader = easyocr.Reader(['ko', 'en'])

# 이미지 파일 경로
image_path = 'C:\\Users\\82106\\develop\\hanwha-ieum\\ai\\img\\test.jpg'

# 이미지 읽기
image = cv2.imread(image_path)

# 텍스트 추출
results = reader.readtext(image)

# 결과 출력 및 이미지에 바운딩 박스 그리기
for (bbox, text, prob) in results:
    print(f'텍스트: {text}, 확률: {prob:.2f}')
    
    # 바운딩 박스 좌표
    (top_left, top_right, bottom_right, bottom_left) = bbox
    top_left = tuple(map(int, top_left))
    bottom_right = tuple(map(int, bottom_right))
    
    # 이미지에 바운딩 박스 그리기
    cv2.rectangle(image, top_left, bottom_right, (0, 255, 0), 2)
    
    # 텍스트 표시
    cv2.putText(image, text, (top_left[0], top_left[1] - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

# 결과 이미지 표시
cv2.imshow('OCR Result', image)
cv2.waitKey(0)
cv2.destroyAllWindows()
