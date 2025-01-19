import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import './FADsearch.css';

const FADsearch = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  return (
    <div>
      {/* 상단 로고 및 회원관리 */}
      <header className="logo-header">
        <h3>MediLink</h3>
        <div className="user-menu">
          {isLoggedIn ? (
            <>
              <a onClick={() => navigate('/mypage')}>회원관리 | 마이페이지</a>
              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <a onClick={() => navigate('/login')}>로그인</a>
          )}
        </div>
      </header>

      {/* 단축키 안내 */}
      <header className="navbar">
        <h3>단축키 안내</h3>
        <a href="#search">① 정보 검색</a>
        <a href="#medications">② 복용약 관리</a>
        <a onClick={() => navigate('/FADsearch')}>③ 허위광고 판별</a>
        <a onClick={() => navigate('/login')}>④ 로그인</a>
      </header>

      {/* 검색 섹션 */}
      <div className="search-container">
        <h2>의약품 허위광고 판별하기</h2>
        <p style={{ textAlign: 'center', color: '#666666' }}>의심되는 의약품 광고 내용을 입력하시면 허위광고 여부를 판별해드립니다!</p>
        <form>
          <textarea 
            placeholder="광고 내용을 입력하세요" 
            rows={5}
            className="ad-input"
          />
          <button type="submit" className="submit-button">판별하기</button>
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

      {/* 플로팅 버튼 */}
      <div className="floating-buttons">
        <button 
          className="floating-button zoom-button round"
          onClick={() => handleZoom('in')}
          title="화면 확대"
        >
          <FaSearch />
          <span>확대</span>
        </button>
        <button 
          className="floating-button zoom-button round"
          onClick={() => handleZoom('out')}
          title="화면 축소"
        >
          <FaSearch />
          <span>축소</span>
        </button>
        <button 
          className="floating-button accessibility-button"
          onClick={() => setIsModalOpen(true)}
          title="접근성 기능 가이드"
        >
          <FaUniversalAccess />
          <span>접근성 기능 가이드라인</span>
        </button>
      </div>

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default FADsearch;
