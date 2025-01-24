import React, { useRef } from 'react';
import './styles.css'; // 스타일 파일 import

// 딜레이 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const TextSpeaker: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 텍스트 블록을 순차적으로 읽으면서 딜레이 추가
  const speakAllTextBlocksWithDelay = async () => {
    // 텍스트 블록 선택
    const textBlocks = containerRef.current?.querySelectorAll('.text-block');

    if (!textBlocks || textBlocks.length === 0) {
      alert('출력할 텍스트가 없습니다.');
      return;
    }

    for (const block of textBlocks) {
      const text = block.textContent || '';

      // 음성 객체 생성
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1; // 속도 설정
      utterance.pitch = 1; // 음높이 설정

      // 음성 출력
      window.speechSynthesis.speak(utterance);

      // 태그 사이 딜레이 추가 (예: 0.05~0.15초)
      await delay(150); // 150ms 딜레이
    }
  };

  return (
    <main>
      <h1>Sequential Text to Speech with Delay</h1>

      {/* 텍스트 블록 컨테이너 */}
      <div 
        ref={containerRef}
        role="region" 
        aria-label="음성으로 읽을 텍스트 목록"
      >
        <div className="text-block" role="article">안녕하세요! 첫 번째 텍스트입니다.</div>
        <p className="text-block" role="article">두 번째 텍스트를 읽습니다.</p>
        <span className="text-block" role="article">세 번째 텍스트는 여기에 있습니다.</span>
        <h2 className="text-block" role="article">네 번째 텍스트 블록입니다.</h2>
      </div>

      {/* 버튼 클릭 시 텍스트 블록을 순차적으로 음성 출력 */}
      <button 
        onClick={speakAllTextBlocksWithDelay}
        aria-label="텍스트를 순차적으로 음성으로 읽기"
        aria-controls="text-container"
      >
        텍스트 음성으로 읽기
      </button>
    </main>
  );
};

export default TextSpeaker;
