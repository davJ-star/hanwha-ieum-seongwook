import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/DiseaseSearchResult.css';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle, FaBraille } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
import { speakPageContent } from '../utils/accessibilityHandleTTS';

// 검색 폼 컴포넌트
interface SearchFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm = ({ onSubmit }: SearchFormProps) => (
  <form onSubmit={onSubmit} role="search">
    <select name="type" aria-label="검색 조건 선택">
      <option value="" disabled selected>검색 조건</option>
      <option value="medicine">의약품</option>
      <option value="disease">질병</option>
    </select>
    <input 
      type="text" 
      placeholder="검색어를 입력하세요" 
      aria-label="검색어 입력"
    />
    <button 
      type="submit" 
      style={{ color: '#000000' }}
      aria-label="검색"
    >
      검색
    </button>
  </form>
);

// 이미지 업로드 컴포넌트
const ImageUpload = () => (
  <div className="image-search-container">
    <h3>이미지로 검색하기</h3>
    <div 
      className="image-upload-box"
      role="button"
      tabIndex={0}
      aria-label="이미지 업로드 영역"
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          console.log('이미지 업로드:', e.target.files?.[0]);
        }}
        aria-label="이미지 파일 선택"
      />
      <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
    </div>
  </div>
);

// 접근성 도구 컴포넌트
interface AccessibilityToolsProps {
  onTTSClick: () => void;
  showBrailleOptions: boolean;
  onBrailleOptionsClick: () => void;
  onBrailleOptionSelect: (option: string) => void;
}

const AccessibilityTools = ({
  onTTSClick,
  showBrailleOptions,
  onBrailleOptionsClick,
  onBrailleOptionSelect
}: AccessibilityToolsProps) => (
  <div className="accessibility-icons" role="toolbar" aria-label="접근성 도구">
    <VolumeUpIcon 
      className="icon" 
      onClick={onTTSClick}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label="텍스트 음성 변환"
    />
    <SignLanguageIcon 
      className="icon"
      role="button"
      aria-label="수어 번역"
    />
    <div className="braille-dropdown">
      <FaBraille 
        className="icon" 
        onClick={onBrailleOptionsClick}
        role="button"
        aria-expanded={showBrailleOptions}
        aria-haspopup="true"
        aria-label="점자 변환 옵션"
      />
      {showBrailleOptions && (
        <div className="braille-options" role="menu">
          <button 
            onClick={() => onBrailleOptionSelect('convert')}
            role="menuitem"
          >
            점자로 변환
          </button>
          <button 
            onClick={() => onBrailleOptionSelect('revert')}
            role="menuitem"
          >
            점자 역변환
          </button>
        </div>
      )}
    </div>
  </div>
);

// 검색 결과 컴포넌트
const SearchResult = () => (
  <div className="result-item" role="article">
    <h3>질병명: 감기</h3>
    <div className="result-details">
      <p><strong>증상:</strong> 발열, 기침, 인후통, 콧물</p>
      <p><strong>설명:</strong> 바이러스성 상기도 감염으로 인한 급성 호흡기 질환</p>
      <p><strong>치료방법:</strong> 충분한 휴식과 수분 섭취, 해열제 복용</p>
    </div>
  </div>
);

function DiseaseSearchResult() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBrailleOptions, setShowBrailleOptions] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.');
  };

  const handleZoom = (zoomType: string) => {
    const currentZoom = document.body.style.zoom ? parseFloat(document.body.style.zoom) : 1;
    if (zoomType === 'in') document.body.style.zoom = (currentZoom + 0.1).toString();
    if (zoomType === 'out') document.body.style.zoom = (currentZoom - 0.1).toString();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrailleOptionSelect = (option: string) => {
    if (option === 'convert') {
      handleBrailleClick();
    } else if (option === 'revert') {
      handleBrailleRevert();
    }
    setShowBrailleOptions(false);
  };

  const handleTTSClick = () => {
    const container = document.querySelector('.search-results');
    if (container instanceof HTMLElement) {
      speakPageContent(container);
    }
  };

  return (
    <Layout>
      <div className="search-container">
        <h2>질병 정보 검색하기</h2>
        <SearchForm onSubmit={(e) => e.preventDefault()} />
        <ImageUpload />
      </div>

      <div className="search-results">
        <div className="result-header">
          <h2>검색 결과</h2>
          <AccessibilityTools 
            onTTSClick={handleTTSClick}
            showBrailleOptions={showBrailleOptions}
            onBrailleOptionsClick={() => setShowBrailleOptions(!showBrailleOptions)}
            onBrailleOptionSelect={handleBrailleOptionSelect}
          />
        </div>
        <div className="results-container">
          <SearchResult />
        </div>
      </div>

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}

export default DiseaseSearchResult;
