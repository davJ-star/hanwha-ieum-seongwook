import React, { useState } from 'react';
import './easyModal.css';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { FaBraille } from 'react-icons/fa';
import { speakText } from '../utils/accessibilityHandleTTS';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';

interface EasyModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string | null;
}

const EasyModal: React.FC<EasyModalProps> = ({ isOpen, onClose, content }) => {
  const [showBrailleOptions, setShowBrailleOptions] = useState(false);
  const [brailleContent, setBrailleContent] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTTSClick = () => {
    if (content) {
      speakText(content); // TTS 기능 호출
    }
  };

  const handleBrailleIconClick = () => {
    setShowBrailleOptions(!showBrailleOptions); // 옵션 메뉴 토글
  };

  const handleBrailleOptionSelect = (option: string) => {
    if (content) {
      if (option === 'convert') {
        const brailleText = handleBrailleClick(content); // 점자 변환
        setBrailleContent(brailleText); // 변환된 점자 텍스트 설정
      } else if (option === 'revert') {
        const originalText = handleBrailleRevert(brailleContent || ''); // 점자 역변환
        setBrailleContent(originalText); // 역변환된 텍스트 설정
      }
      setShowBrailleOptions(false); // 옵션 메뉴 닫기
    }
  };

  return (
    <div className="easy-modal-overlay" onClick={onClose}>
      <div className="easy-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>쉬운 설명</h2>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0 }}>{brailleContent || content}</p>
          <div className="modal-icons" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
            <VolumeUpIcon
              className="icon"
              onClick={handleTTSClick}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label="텍스트 음성 변환"
            />
            <FaBraille
              className="icon"
              onClick={handleBrailleIconClick}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label="점자 변환 옵션"
            />
          </div>
        </div>
        {showBrailleOptions && (
          <div className="braille-options">
            <button onClick={() => handleBrailleOptionSelect('convert')}>점자 변환</button>
            <button onClick={() => handleBrailleOptionSelect('revert')}>점자 역변환</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EasyModal;
