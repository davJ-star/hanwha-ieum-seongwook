// 홈 페이지(이는 vite.config.ts 파일에서 필요한 설정 추가 후 생성한 파일)

/* 기존의 index.html 파일에서 사용되던 코드를 삭제하고 .tsx 파일로 새로 작성한 코드 */

/*import * as React from 'react': React 라이브러리를 가져오는 부분*/
import * as React from 'react';
import './App.css';

function App() {
  return (
    <div>
      {/* 로고 헤더 */}
      <header className="logo-header">
        <h3>MediLink</h3>
        <div className="user-menu">
          <a href="#member&mypage">회원관리 | 마이페이지</a>
        </div>
      </header>

      {/* 네비게이션 바 */}
      <header className="navbar">
        <h4>단축키 안내</h4>
        <a href="#search">① 정보 검색</a>
        <a href="#about">② 복용약 관리</a>
        <a href="#services">③ 허위광고 판별</a>
        <a href="#login">④ 로그인</a>
      </header>

      {/* 메인 배너 */}
      <header className="main-banner">
        <h1>쉬운 의약품 복용 관리 플랫폼 MediLink입니다!</h1>
        <div className="container">
          <h3>약 정보 찾기 어려우셨나요?</h3>
          <h3>약국 추천만 믿고 복용하셨던 분들!</h3>
          <h3>내 질환에 딱 맞는 정보를 원하셨던 분들!</h3>
          <h3>이제 MediLink와 함께 쉽고 편리한 약 복용 관리 서비스를 경험해보세요!</h3>
        </div>
      </header>

      {/* 질병/의약품 검색 섹션 */}
      <div className="search-container">
        <h2>질병/의약품 검색하기</h2>
        <h4>궁금한 질병과 복용 중인 의약품에 대해 더 정확히 알고 싶다면 여기서 검색해보세요!</h4>
        <div className="row">
          <div className="col-lg-12">
            <form id="searchForm" action="/controller/board/list" method="get">
              <select name="type">
                <option value="">검색조건 선택</option>
                <option value="medicine">의약품</option>
                <option value="disease">질병</option>
              </select>
              <input type="text" name="keyword" placeholder="검색어를 입력하세요" />
              <input type="hidden" name="pageNum" />
              <input type="hidden" name="amount" />
              <button className="btn btn-default" type="submit">검색</button>
            </form>
          </div>
        </div>
      </div>

      {/* 커뮤니티 바로가기 섹션 */}
      <div>
        <h2>커뮤니티 바로가기</h2>
        <h4>같은 장애와 질환을 가진 사용자들과 복약 정보와 치료 경험을 나누어 보세요!</h4>
        <div>
          <button>지체 장애</button>
          <button>뇌병변 장애</button>
          <button>시각 장애</button>
          <button>청각 장애</button>
          <button>언어 장애</button>
          <button>안면 장애</button>
          <button>내부기관 장애</button>
          <button>정신적 장애</button>
        </div>
      </div>
    </div>
  );
}

export default App;