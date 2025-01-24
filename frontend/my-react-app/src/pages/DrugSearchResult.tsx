import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DrugSearchResult.css';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle, FaBraille } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
import { speakPageContent } from '../utils/accessibilityHandleTTS';

function DrugSearchResult() {
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

  const handleBrailleOptionsClick = () => {
    setShowBrailleOptions(!showBrailleOptions);
  };

  const handleTTSClick = () => {
    const container = document.querySelector('.search-results');
    if (container instanceof HTMLElement) {
      speakPageContent(container);
    }
  };

  return (
    <Layout>
      {/* 검색 섹션 */}
      <div className="search-container">
        <h2>의약품 정보 검색하기</h2>
        <form>
          <select name="type">
            <option value="" disabled selected>검색 조건</option>
            <option value="medicine">의약품</option>
            <option value="disease">질병</option>
          </select>
          <input type="text" placeholder="검색어를 입력하세요" />
          <button type="submit" style={{ color: '#000000' }}>검색</button>
        </form>

        <div className="image-search-container">
          <h3>이미지로 검색하기</h3>
          <div className="image-upload-box">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                console.log('이미지 업로드:', e.target.files?.[0]);
              }}
            />
            <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
          </div>
        </div>
      </div>

      {/* 검색 결과 섹션 */}
      <div className="search-results">
        <div className="result-header">
          <h2>검색 결과</h2>
          <div className="accessibility-icons">
            <VolumeUpIcon 
              className="icon" 
              onClick={handleTTSClick}
              style={{ cursor: 'pointer' }}
            />
            <SignLanguageIcon className="icon" />
            <div className="braille-dropdown">
              <FaBraille className="icon" onClick={handleBrailleOptionsClick} />
              {showBrailleOptions && (
                <div className="braille-options">
                  <button onClick={() => handleBrailleOptionSelect('convert')}>
                    점자로 변환
                  </button>
                  <button onClick={() => handleBrailleOptionSelect('revert')}>
                    점자 역변환
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="results-container">
          <div className="result-item">
            <h3>의약품명: 타이레놀</h3>
            <div className="result-details">
              <p><strong>성분:</strong> 아세트아미노펜</p>
              <p><strong>효능/효과:</strong> 해열, 감기로 인한 통증, 두통, 근육통</p>
              <p><strong>용법/용량:</strong> 1회 1~2정, 1일 3~4회 복용(4~6시간 간격)</p>
              <p><strong>주의사항:</strong> 
                - 일일 최대 복용량(4,000mg) 초과 금지<br/>
                - 음주 시 복용 주의</p>
            </div>
          </div>
        </div>
      </div>

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}

export default DrugSearchResult;
