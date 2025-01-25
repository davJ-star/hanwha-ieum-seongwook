import { FaSearch, FaUniversalAccess, FaExclamationTriangle, FaPlus, FaTimes } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import './FloatingButton.css';

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
  onNavigate,
}: FloatingButtonsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [onZoomIn, onZoomOut]);

  return (
    <div className="floating-buttons" role="complementary" aria-label="접근성 도구">
      {/* FAB 메인 버튼 */}
      <button
        className={`floating-button round fab-main-button ${isExpanded ? 'active' : ''}`}
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-label={isExpanded ? "메뉴 닫기" : "메뉴 열기"}
        title={isExpanded ? "메뉴 닫기" : "메뉴 열기"}
      >
        {isExpanded ? <FaTimes /> : <FaPlus />}
      </button>

      {/* 하위 버튼들 */}
      {isExpanded && (
        <div className="fab-options">
          <div className="zoom-controls">
            <button
              className="floating-button round"
              onClick={onZoomIn}
              aria-label="화면 확대 (단축키: Ctrl +)"
              title="화면 확대 (Ctrl +)"
            >
              <span>확대</span>
              <FaSearch aria-hidden="true" />
            </button>
            <button
              className="floating-button round"
              onClick={onZoomOut}
              aria-label="화면 축소 (단축키: Ctrl -)"
              title="화면 축소 (Ctrl -)"
            >
              <span>축소</span>
              <FaSearch aria-hidden="true" />
            </button>
          </div>
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
      )}
    </div>
  );
};

export default FloatingButtons;
