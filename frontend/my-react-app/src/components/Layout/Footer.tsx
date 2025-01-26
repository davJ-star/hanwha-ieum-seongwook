import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      role="contentinfo" 
      className="footer"
      style={{
        backgroundColor: '#F2F2DF',
        padding: '2rem',
        marginTop: 'auto',
      }}
    >
      <div 
        className="footer-links-container" 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div>
          <h4>질병/의약품 정보 검색</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="DiseaseSearchResult" style={{ color: '#666666', textDecoration: 'none' }}>질병 검색</a></li>
            <li><a href="DrugSearchResult" style={{ color: '#666666', textDecoration: 'none' }}>의약품 검색</a></li>
          </ul>
        </div>

        <div>
          <h4>복용약 관리 및 알림</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="Mypage" style={{ color: '#666666', textDecoration: 'none' }}>나의 복용약 담기</a></li>
            <li><a href="Mypage" style={{ color: '#666666', textDecoration: 'none' }}>복용약 관리</a></li>
            <li><a href="Mypage" style={{ color: '#666666', textDecoration: 'none' }}>복용약 알림</a></li>
          </ul>
        </div>

        <div>
          <h4>의약품 허위광고 판별</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="FADsearch" style={{ color: '#666666', textDecoration: 'none' }}>제품 검색</a></li>
            <li><a href="FADsearch" style={{ color: '#666666', textDecoration: 'none' }}>이미지 검색</a></li>
          </ul>
        </div>

        <div>
          <h4>커뮤니티</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="PDCcommu" style={{ color: '#666666', textDecoration: 'none' }}>지체장애 커뮤니티</a></li>
            <li><a href="BLDcommu" style={{ color: '#666666', textDecoration: 'none' }}>뇌병변장애 커뮤니티</a></li>
            <li><a href="VIcommu" style={{ color: '#666666', textDecoration: 'none' }}>시각장애 커뮤니티</a></li>
            <li><a href="HIcommu" style={{ color: '#666666', textDecoration: 'none' }}>청각장애 커뮤니티</a></li>
            <li><a href="SIcommu" style={{ color: '#666666', textDecoration: 'none' }}>언어장애 커뮤니티</a></li>
            <li><a href="FDcommu" style={{ color: '#666666', textDecoration: 'none' }}>안면장애 커뮤니티</a></li>
            <li><a href="IODcommu" style={{ color: '#666666', textDecoration: 'none' }}>내부기관 장애 커뮤니티</a></li>
            <li><a href="MDcommu" style={{ color: '#666666', textDecoration: 'none' }}>정신적 장애 커뮤니티</a></li>
          </ul>
        </div>

        <div>
          <h4>회원관리</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/Login" style={{ color: '#666666', textDecoration: 'none' }}>로그인</a></li>
            <li><a href="/Mypage" style={{ color: '#666666', textDecoration: 'none' }}>마이페이지</a></li>
            <li><a href="/MemberInfo" style={{ color: '#666666', textDecoration: 'none' }}>회원정보 수정</a></li>
            <li><a href="/Secession" style={{ color: '#666666', textDecoration: 'none' }}>회원 탈퇴</a></li>
          </ul>
        </div>

        <div>
          <h4>
            <a href="/" style={{ color: '#000000', textDecoration: 'none' }}>
              홈페이지 바로가기
            </a>
          </h4>
        </div>
      </div>

      <div 
        className="footer-bottom"
        style={{
          marginTop: '2rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          borderTop: '1px solid #ddd',
          paddingTop: '1rem',
        }}
      >
        <p>COPYRIGHT © 이음 {currentYear}. ALL RIGHT RESERVED.</p>
      </div>
    </footer>
  );
};

export default Footer;
