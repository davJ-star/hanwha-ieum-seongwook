import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CommunityMain.css';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';

const CommunityMain = () => {
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
    <div className="community-page">
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
        <a href="#search">① 정보 검색</a>
        <a href="#medications">② 복용약 관리</a>
        <a href="#ads">③ 허위광고 판별</a>
        <a onClick={() => navigate('/login')}>④ 로그인</a>
      </header>

      <div className="community-content">
        {/* 좌측 게시판 목록 */}
        <div className="board-list">
          <h3>게시판 목록</h3>
          <button onClick={() => navigate('/physical-disability-community')}>지체장애 게시판</button>
          <button onClick={() => navigate('/brain-lesion-disorder-community')}>뇌병변장애 게시판</button>
          <button onClick={() => navigate('/visual-impairment-community')}>시각장애 게시판</button>
          <button onClick={() => navigate('/hearing-impairment-community')}>청각장애 게시판</button>
          <button onClick={() => navigate('/speech-impediment-community')}>언어장애 게시판</button>
          <button onClick={() => navigate('/facial-disorder-community')}>안면장애 게시판</button>
          <button onClick={() => navigate('/internal-organ-disorder-community')}>내부기관장애 게시판</button>
          <button onClick={() => navigate('/mental-disability-community')}>정신적장애 게시판</button>
        </div>

        {/* 중앙 게시글 목록 */}
        <div className="post-list-container">
          <div className="post-header">
            <h2>전체 게시글</h2>
            <button 
              className="write-button" 
              onClick={() => navigate('/write-post')} 
              style={{ color: '#000000' }}
            >
              글쓰기
            </button>
          </div>
          
          {/* 임시 게시글 목록 */}
          <div className="post-list">
            <div className="post-item">
              <h4>게시글 제목 예시</h4>
              <p>작성자: 홍길동</p>
              <p>작성일: 2024-03-21</p>
            </div>
            {/* 추가 게시글들... */}
          </div>
        </div>
      </div>

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
      </div>

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default CommunityMain;