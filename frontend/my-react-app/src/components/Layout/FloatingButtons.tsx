import { FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';

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
  return (
    <div className="floating-buttons" role="complementary" aria-label="접근성 도구">
      <button 
        className="floating-button round"
        onClick={onZoomIn}
        aria-label="화면 확대"
        title="화면 확대"
      >
        <FaSearch aria-hidden="true" />
        <span>확대</span>
      </button>
      <button 
        className="floating-button round"
        onClick={onZoomOut}
        aria-label="화면 축소"
        title="화면 축소"
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
