import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/App.css';
import { FaArrowUp, FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import CommunitySection from '../components/Layout/CommunitySection';

// 메인 배너 컴포넌트
const MainBanner = () => (
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
);

// 검색 폼 컴포넌트
const SearchForm = () => (
  <form role="search" aria-label="검색 폼">
    <select name="type" aria-label="검색 조건 선택">
      <option value="" disabled selected>검색 조건</option>
      <option value="medicine">의약품</option>
      <option value="disease">질병</option>
    </select>
    <input 
      type="text" 
      placeholder="검색어를 입력하세요" 
      aria-label="검색어 입력" 
      style={{ color: '#000000' }}
    />
    <button 
      type="submit" 
      style={{ color: '#000000' }} 
      aria-label="검색하기"
    >
      검색
    </button>
  </form>
);

// 이미지 검색 컴포넌트
const ImageSearch = () => (
  <div className="image-search-container" role="region" aria-label="이미지 검색">
    <h3>이미지로 검색하기</h3>
    <div 
      className="image-upload-box" 
      role="button" 
      aria-label="이미지 업로드 영역"
    >
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
);

// 검색 섹션 컴포넌트
const SearchSection = () => (
  <div className="search-container" role="search" aria-label="질병/의약품 검색">
    <h2>질병/의약품 검색하기</h2>
    <p style={{ textAlign: 'center', color: '#666666' }}>
      내가 가진 질병과 복용 중인 의약품에 대해 더 정확히 알고 싶다면 여기서 검색해보세요 !
    </p>
    <SearchForm />
    <ImageSearch />
  </div>
);

function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <MainBanner />
      <SearchSection />
      <CommunitySection navigate={navigate} />
    </Layout>
  );
}

export default Home;
