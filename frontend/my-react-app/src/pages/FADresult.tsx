import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FADresult.css';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille'; //점자 클릭 핸들러 호출
import Layout from '../components/Layout';
import { MdCheckCircle, MdError } from "react-icons/md";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import { FaBraille } from 'react-icons/fa';
import { speakPageContent } from '../utils/accessibilityHandleTTS';

function FADresult() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBrailleOptions, setShowBrailleOptions] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleBrailleOptionsClick = () => {
    setShowBrailleOptions(!showBrailleOptions);
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
      {/* 검색 섹션 */}
      <section className="search-container" role="search" aria-label="의약품 허위광고 검색">
        <form role="search">
          <input 
            type="text" 
            placeholder="검색어를 입력하세요" 
            aria-label="검색어 입력"
          />
          <button 
            type="submit" 
            style={{ color: '#000000' }} 
            aria-label="검색"
          >검색</button>
        </form>

        <div className="image-search-container">
          <h3 id="image-search-title">이미지로 검색하기</h3>
          <div 
            className="image-upload-box"
            role="button"
            tabIndex={0}
            aria-labelledby="image-search-title"
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
      </section>

      {/* 검색 결과 섹션 */}
      <section className="search-results" role="region" aria-label="허위광고 판별 결과">
        <div className="result-header">
          <h2>의약품 허위광고 판별 결과</h2>
          <div className="accessibility-icons" role="toolbar" aria-label="접근성 도구">
            <VolumeUpIcon 
              className="icon" 
              onClick={handleTTSClick}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label="텍스트 음성 변환"
              tabIndex={0}
            />
            <SignLanguageIcon 
              className="icon"
              role="button"
              aria-label="수어 번역"
              tabIndex={0}
            />
            <div className="braille-dropdown">
              <FaBraille 
                className="icon" 
                onClick={handleBrailleOptionsClick}
                role="button"
                aria-expanded={showBrailleOptions}
                aria-haspopup="true"
                aria-label="점자 변환 옵션"
                tabIndex={0}
              />
              {showBrailleOptions && (
                <div className="braille-options" role="menu" aria-label="점자 변환 메뉴">
                  <button onClick={() => handleBrailleOptionSelect('convert')} role="menuitem">
                    점자로 변환
                  </button>
                  <button onClick={() => handleBrailleOptionSelect('revert')} role="menuitem">
                    점자 역변환
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <p role="note" style={{ textAlign: 'center', color: '#666666' }}>
          건강기능식품, 의약품 인증 및 허가 여부를 통해 제품의 효능을 검증할 수 있어요.
        </p>
        <div className="results-container">
          <article className="result-item" role="article" aria-labelledby="health-food-title">
            <h3 id="health-food-title">건강기능식품 인증내역 분석</h3>
            <div className="result-details">
              <div className="status-indicator" role="status" aria-live="polite">
                <MdCheckCircle style={{ color: '#4CAF50', fontSize: '24px' }} aria-hidden="true" />
                <span>인증 확인됨</span>
              </div>
              <dl>
                <dt>제품명:</dt>
                <dd>비타민C 1000</dd>
                <dt>인증번호:</dt>
                <dd>제2023-12345호</dd>
                <dt>제조업체:</dt>
                <dd>건강식품(주)</dd>
                <dt>인증일자:</dt>
                <dd>2023.01.15</dd>
              </dl>
            </div>
          </article>

          <article className="result-item" role="article" aria-labelledby="medicine-title">
            <h3 id="medicine-title">의약품 허가내역 분석</h3>
            <div className="result-details">
              <div className="status-indicator" role="status" aria-live="polite">
                <MdError style={{ color: '#f44336', fontSize: '24px' }} aria-hidden="true" />
                <span>허가 내역 없음</span>
              </div>
              <dl>
                <dt>분석결과:</dt>
                <dd>의약품 허가 이력이 확인되지 않았습니다.</dd>
                <dt>주의사항:</dt>
                <dd>해당 제품은 의약품으로 허가되지 않은 제품입니다.</dd>
                <dt>권고사항:</dt>
                <dd>의약품으로서의 효능·효과를 표방하는 광고는 허위광고에 해당될 수 있습니다.</dd>
              </dl>
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}

export default FADresult;
