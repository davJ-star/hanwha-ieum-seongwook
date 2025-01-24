// utils/accessibilityHandleTTS.ts
export const speakText = (text: string, lang = 'ko-KR', rate = 1, pitch = 1) => {
    if (!text) {
      console.error('No text provided for TTS.');
      return;
    }
  
    // 현재 진행 중인 음성이 있다면 중지
    window.speechSynthesis.cancel();
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // 언어 설정
    utterance.rate = rate; // 속도
    utterance.pitch = pitch; // 음높이
  
    window.speechSynthesis.speak(utterance);
  };
  
// 페이지 콘텐츠를 읽기 위한 새로운 함수 추가
export const speakPageContent = async (container: HTMLElement) => {
  const text = extractTextContent(container);
  const dynamicDelay = text.length * 50; // 글자 수에 따라 딜레이 조정
  await new Promise(resolve => setTimeout(resolve, dynamicDelay));
  speakText(text);
};

// HTML 요소에서 텍스트 콘텐츠를 추출하는 헬퍼 함수
const extractTextContent = (element: HTMLElement): string => {
  const resultContainer = element.querySelector('.results-container');
  if (!resultContainer) return '';

  // 결과 컨테이너의 텍스트만 추출
  return resultContainer.textContent?.trim() || '';
};
