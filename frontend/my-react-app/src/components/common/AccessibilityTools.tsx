import { FaBraille, FaVolumeUp } from "react-icons/fa";
import SignLanguageIcon from '@mui/icons-material/SignLanguage';

interface AccessibilityToolsProps {
  onBraille?: () => void;
  onSpeak?: () => void;
  onSignLanguage?: () => void;
}

const AccessibilityTools = ({ onBraille, onSpeak, onSignLanguage }: AccessibilityToolsProps) => {
  return (
    <div className="accessibility-icons" role="toolbar" aria-label="접근성 도구">
      {onSpeak && (
        <FaVolumeUp 
          className="icon"
          onClick={onSpeak}
          aria-label="음성으로 읽기"
        />
      )}
      {onBraille && (
        <FaBraille 
          className="icon"
          onClick={onBraille}
          aria-label="점자로 변환"
        />
      )}
      {onSignLanguage && (
        <SignLanguageIcon 
          className="icon"
          onClick={onSignLanguage}
          aria-label="수어 보기"
        />
      )}
    </div>
  );
};
