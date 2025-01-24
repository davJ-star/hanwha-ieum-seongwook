import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { FaArrowUp, FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout';

function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* 메인 배너 */}
      <div className="main-banner" role="banner" aria-label="메인 배너">
        <div className="banner-content">
          <h1>쉬운 의약품 복용 관리 플랫폼 
            <div style={{ marginTop: '10px' }}>
              <span style={{
                color: '#FFFF00',
                textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
              }}>MediLink</span>입니다!
            </div>
          </h1>
          <h4>약 정보 찾기 어려우셨나요?</h4>
          <h4>약국 추천만 믿고 복용하셨던 분들!</h4>
          <h4>내 질환에 딱 맞는 정보를 원하셨던 분들!</h4>
          <h4>이제 MediLink와 함께 쉽고 편리한 약 복용 관리 서비스를 경험해보세요!</h4>
        </div>
      </div>

      {/* 검색 섹션 */}
      <div className="search-container" role="search" aria-label="질병/의약품 검색">
        <h2>질병/의약품 검색하기</h2>
        <p style={{ textAlign: 'center', color: '#666666' }}>내가 가진 질병과 복용 중인 의약품에 대해 더 정확히 알고 싶다면 여기서 검색해보세요 !</p>
        <form role="search" aria-label="검색 폼">
          <select name="type" aria-label="검색 조건 선택">
            <option value="" disabled selected>검색 조건</option>
            <option value="medicine">의약품</option>
            <option value="disease">질병</option>
          </select>
          <input type="text" placeholder="검색어를 입력하세요" aria-label="검색어 입력" />
          <button type="submit" style={{ color: '#000000' }} aria-label="검색하기">검색</button>
        </form>

        <div className="image-search-container" role="region" aria-label="이미지 검색">
          <h3>이미지로 검색하기</h3>
          <div className="image-upload-box" role="button" aria-label="이미지 업로드 영역">
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
      </div>

      {/* 커뮤니티 섹션 */}
      <nav className="community-container" role="navigation" aria-label="커뮤니티 메뉴">
        <h2>커뮤니티 바로가기</h2>
        <p style={{ textAlign: 'center', color: '#666666' }}>같은 장애와 질환을 가진 사용자들과 복약 정보와 치료 경험을 나누어보세요 !</p>
        <button onClick={() => navigate('/community-main')} aria-label="커뮤니티 메인으로 이동">커뮤니티 메인 바로가기</button>
        <button onClick={() => navigate('/PDCcommu')} aria-label="지체장애 커뮤니티로 이동">지체장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/BLDcommu')} aria-label="뇌병변장애 커뮤니티로 이동">뇌병변장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/visual-impairment-community')} aria-label="시각장애 커뮤니티로 이동">시각장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/hearing-impairment-community')} aria-label="청각장애 커뮤니티로 이동">청각장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/speech-impediment-community')} aria-label="언어장애 커뮤니티로 이동">언어장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/facial-disorder-community')} aria-label="안면장애 커뮤니티로 이동">안면장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/internal-organ-disorder-community')} aria-label="내부기관 장애 커뮤니티로 이동">내부기관 장애 커뮤니티 바로가기</button>
        <button onClick={() => navigate('/mental-disability-community')} aria-label="정신적 장애 커뮤니티로 이동">정신적 장애 커뮤니티 바로가기</button>
      </nav>
    </Layout>
  );
}

export default Home;
