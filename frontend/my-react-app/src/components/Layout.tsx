import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';
import AccessibilityModal from './AccessibilityModal';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
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
    <div>
      <header className="logo-header">
        <h3 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>MediLink</h3> {/* 홈 버튼 */}
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

      <header className="navbar">
        <h3>단축키 안내</h3>
        <a href="#search">① 정보 검색</a>
        <a href="#medications">② 복용약 관리</a>
        <a onClick={() => navigate('/FADsearch')}>③ 허위광고 판별</a>
        <a onClick={() => navigate('/login')}>④ 로그인</a>
      </header>

      {children}

      <div className="floating-buttons">
        <button 
          className="floating-button round"
          onClick={() => handleZoom('in')}
          title="화면 확대"
        >
          <FaSearch />
          <span>확대</span>
        </button>
        <button 
          className="floating-button round"
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
          style={{ backgroundColor: '#00ff00' }}
        >
          <FaUniversalAccess />
          <span>접근성 기능 가이드라인</span>
        </button>
        <button 
          className="floating-button fad-button"
          onClick={() => navigate('/FADsearch')}
          title="의약품 허위광고 판별"
          style={{ backgroundColor: '#ff4444' }}
        >
          <FaExclamationTriangle />
          <span>의약품 허위광고 판별 서비스</span>
        </button>
      </div>

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Layout; 