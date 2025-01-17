import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { FaArrowUp, FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // 토큰 존재 여부로 로그인 상태 설정
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
        <a href="#search">① 정보 검색</a>
        <a href="#medications">② 복용약 관리</a>
        <a href="#ads">③ 허위광고 판별</a>
        <a onClick={() => navigate('/login')}>④ 로그인</a>
      </header>

      {/* 메인 배너 */}
      <div className="main-banner">
        <h1>쉬운 의약품 복용 관리 플랫폼 MediLink입니다!</h1>
      </div>

      {/* 검색 섹션 */}
      <div className="search-container">
        <h2>질병/의약품 검색하기</h2>
        <form>
          <select name="type">
            <option value="" disabled selected>검색 조건</option>
            <option value="medicine">의약품</option>
            <option value="disease">질병</option>
          </select>
          <input type="text" placeholder="검색어를 입력하세요" />
          <button type="submit">검색</button>
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

      {/* 커뮤니티 섹션 */}
      <div className="community-container">
        <h2>커뮤니티 바로가기</h2>
        <p style={{ textAlign: 'center' }}>같은 장애와 질환을 가진 사용자들과 복약 정보와 치료 경험을 나누어보세요 !</p>
        <button onClick={() => navigate('/community-main')}>커뮤니티 메인 바로가기</button>
        <button onClick={() => navigate('/physical-disability-community')}>지체장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/brain-lesion-disorder-community')}>뇌병변장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/visual-impairment-community')}>시각장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/hearing-impairment-community')}>청각장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/speech-impediment-community')}>언어장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/facial-disorder-community')}>안면장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/internal-organ-disorder-community')}>내부기관 장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/mental-disability-community')}>정신적 장애 커뮤니티 바로가기</button>
      </div>

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
          onClick={() => navigate('/accessibility-guide')}
          title="접근성 기능 가이드"
          style={{ backgroundColor: '#00ff00' }}
        >
          <FaUniversalAccess />
          <span>접근성 기능 가이드라인</span>
        </button>
        <button 
          className="floating-button ads-check-button"
          onClick={() => navigate('/ads-verification')}
          title="허위광고 판별"
          style={{ backgroundColor: '#ff9900' }}
        >
          <FaExclamationTriangle />
          <span>의약품 허위광고 판별</span>
        </button>
      </div>
    </div>
  );
}

export default Home;
