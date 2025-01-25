import { FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';
import React, { useEffect } from 'react';

interface FloatingButtonsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onAccessibilityToggle: () => void;
  onNavigate: (path: string) => void;
}

const FloatingButtons = ({ 
  onZoomIn, 
  onZoomOut, 
  onAccessibilityToggle,
  onNavigate 
}: FloatingButtonsProps) => {
  
  // 키보드 단축키 이벤트 핸들러 추가
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        if (event.key === '+' || event.key === '=') {
          event.preventDefault();
          onZoomIn();
        } else if (event.key === '-') {
          event.preventDefault();
          onZoomOut();
        }
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [onZoomIn, onZoomOut]);

  return (
    <div className="floating-buttons" role="complementary" aria-label="접근성 도구">
      <button 
        className="floating-button round"
        onClick={onZoomIn}
        aria-label="화면 확대 (단축키: Ctrl +)"
        title="화면 확대 (Ctrl +)"
      >
        <FaSearch aria-hidden="true" />
        <span>확대</span>
      </button>
      <button 
        className="floating-button round"
        onClick={onZoomOut}
        aria-label="화면 축소 (단축키: Ctrl -)"
        title="화면 축소 (Ctrl -)"
      >
        <FaSearch aria-hidden="true" />
        <span>축소</span>
      </button>
      <button 
        className="floating-button accessibility-button"
        onClick={onAccessibilityToggle}
        title="접근성 기능 가이드"
        style={{ backgroundColor: '#00ff00' }}
      >
        <FaUniversalAccess aria-hidden="true" />
        <span>접근성 기능 가이드라인</span>
      </button>
      <button 
        className="floating-button fad-check-button"
        onClick={() => onNavigate('/FADsearch')}
        title="허위광고 판별"
      >
        <FaExclamationTriangle aria-hidden="true" />
        <span>허위광고 판별</span>
      </button>
    </div>
  );
};

export default FloatingButtons;
