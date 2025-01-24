import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';
import AccessibilityModal from './AccessibilityModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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
    <>
      <header className="logo-header" role="banner">
        <h3>MediLink</h3>
        <div className="user-menu" role="navigation" aria-label="사용자 메뉴">
          {isLoggedIn ? (
            <>
              <a onClick={() => navigate('/mypage')} aria-label="회원관리와 마이페이지로 이동">회원관리 | 마이페이지</a>
              <button onClick={handleLogout} aria-label="로그아웃">로그아웃</button>
            </>
          ) : (
            <a onClick={() => navigate('/login')} aria-label="로그인 페이지로 이동">로그인</a>
          )}
        </div>
      </header>
      
      <nav className="navbar" role="navigation" aria-label="메인 메뉴">
        <a href="#search" aria-label="정보 검색">① 정보 검색</a>
        <a href="#medications" aria-label="복용약 관리">② 복용약 관리</a>
        <a onClick={() => navigate('/FADsearch')} aria-label="허위광고 판별">③ 허위광고 판별</a>
        <a onClick={() => navigate('/login')} aria-label="로그인">④ 로그인</a>
      </nav>

      <main role="main">{children}</main>

      <div className="floating-buttons" role="complementary" aria-label="접근성 도구">
        <button 
          className="floating-button round"
          onClick={() => handleZoom('in')}
          aria-label="화면 확대"
          title="화면 확대"
        >
          <FaSearch aria-hidden="true" />
          <span>확대</span>
        </button>
        <button 
          className="floating-button round"
          onClick={() => handleZoom('out')}
          aria-label="화면 축소"
          title="화면 축소"
        >
          <FaSearch aria-hidden="true" />
          <span>축소</span>
        </button>
        <button 
          className="floating-button accessibility-button"
          onClick={() => setIsModalOpen(true)}
          aria-label="접근성 기능 가이드"
          title="접근성 기능 가이드"
          style={{ backgroundColor: '#00ff00' }}
        >
          <FaUniversalAccess aria-hidden="true" />
          <span>접근성 기능 가이드라인</span>
        </button>
        <button 
          className="floating-button fad-check-button"
          onClick={() => navigate('/FADsearch')}
          aria-label="허위광고 판별"
          title="허위광고 판별"
        >
          <FaExclamationTriangle aria-hidden="true" />
          <span>허위광고 판별</span>
        </button>
      </div>

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Layout; 