import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiseaseDetail.css';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle, FaBraille } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
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
      <section className="search-container" role="search" aria-label="의약품 검색">
        <h2 id="search-title">의약품 정보 검색하기</h2>
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
          <div className="result-item" role="article" aria-label="의약품 상세 정보">
            <h2>의약품명: 타이레놀</h2>
            <div className="result-details">
              <p><strong>성분:</strong> 아세트아미노펜</p>
              <p><strong>효능/효과:</strong> 감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 염좌통</p>
              <p><strong>용법/용량:</strong></p>
              <ul role="list">
                <li role="listitem">성인: 1회 1~2정씩 1일 3-4회 복용</li>
                <li role="listitem">1일 최대 4그램을 초과하지 말 것</li>
                <li role="listitem">식후 30분에 물과 함께 복용</li>
              </ul>
              <p><strong>주의사항:</strong></p>
              <ul role="list">
                <li role="listitem">알코올과 함께 복용하지 말 것</li>
                <li role="listitem">간장애 또는 신장애가 있는 환자는 복용 전 의사와 상담</li>
                <li role="listitem">과다복용 시 간손상 위험이 있으므로 지시된 용량만 복용</li>
              </ul>
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
