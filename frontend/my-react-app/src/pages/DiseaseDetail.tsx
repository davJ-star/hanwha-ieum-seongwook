import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiseaseDetail.css';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle, FaBraille } from 'react-icons/fa'; // 점자 해설
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout';
import VolumeUpIcon from '@mui/icons-material/VolumeUp'; //음성 해설
import SignLanguageIcon from '@mui/icons-material/SignLanguage'; // 수어 해설
import { speakPageContent } from '../utils/accessibilityHandleTTS';

function DiseaseDetail() {
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
      <section className="search-container" role="search" aria-label="질병 검색">
        <h2 id="search-title">질병 정보 검색하기</h2>
        <form role="search" aria-labelledby="search-title">
          <select name="type" aria-label="검색 조건 선택">
            <option value="" disabled selected>검색 조건</option>
            <option value="medicine">의약품</option>
            <option value="disease">질병</option>
          </select>
          <input type="text" placeholder="검색어를 입력하세요" aria-label="검색어 입력" />
          <button type="submit" style={{ color: '#000000' }} aria-label="검색">검색</button>
        </form>

        <div className="image-search-container">
          <h3 id="image-search-title">이미지로 검색하기</h3>
          <div className="image-upload-box" 
               role="button" 
               tabIndex={0} 
               aria-labelledby="image-search-title">
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
      <section className="search-results" role="region" aria-label="검색 결과">
        <div className="result-header">
          <h2>검색 결과</h2>
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
        <article className="results-container">
          <div className="result-item" role="article" aria-label="질병 상세 정보">
            <h2>질병명: 감기</h2>
            <div className="result-details">
              <p><strong>뜻과 이유:</strong> 바이러스성 상기도 감염으로 인한 급성 호흡기 질환으로, 
                주로 날씨 변화나 면역력 저하로 인해 발생</p>
              <p><strong>대표증상:</strong> 발열, 기침, 인후통, 콧물, 두통, 피로감</p>
              <p><strong>치료방법:</strong> 
                <ul role="list">
                  <li role="listitem">충분한 휴식과 수분 섭취</li>
                  <li role="listitem">해열제 및 진통제 복용</li>
                  <li role="listitem">따뜻한 차나 물로 목을 편안하게 하기</li>
                  <li role="listitem">실내 습도 유지</li>
                </ul>
              </p>
            </div>
          </div>
        </article>
      </section>

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}

export default DiseaseDetail;
