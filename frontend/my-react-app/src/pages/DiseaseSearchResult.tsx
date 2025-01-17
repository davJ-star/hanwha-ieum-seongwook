import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiseaseSearchResult.css';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';

function DiseaseSearchResult() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        <button onClick={() => handleZoom('in')}>+ 확대</button>
        <button onClick={() => handleZoom('out')}>- 축소</button>
      </header>

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

      {/* 검색 결과 섹션 */}
      <div className="search-results">
        <h2>검색 결과</h2>
        <div className="results-container">
          <div className="result-item">
            <h3>질병명: 감기</h3>
            <div className="result-details">
              <p><strong>증상:</strong> 발열, 기침, 인후통, 콧물</p>
              <p><strong>설명:</strong> 바이러스성 상기도 감염으로 인한 급성 호흡기 질환</p>
              <p><strong>치료방법:</strong> 충분한 휴식과 수분 섭취, 해열제 복용</p>
            </div>
          </div>
          {/* <div className="result-item">
            <h3>관련 의약품</h3>
            <ul>
              <li>타이레놀</li>
              <li>테라플루</li>
              <li>판콜에이</li>
            </ul>
          </div> */}
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
          onClick={() => navigate('/accessibility-guide')}
          title="접근성 기능 가이드"
          style={{ backgroundColor: '#00ff00' }}
        >
          <FaUniversalAccess />
          <span>접근성 기능 가이드라인</span>
        </button>
      </div>
    </div>
  );
}

export default DiseaseSearchResult;
