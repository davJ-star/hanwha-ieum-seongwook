import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import '../styles/pages/FADsearch.css';

// 검색 폼 컴포넌트
interface SearchFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm = ({ onSubmit }: SearchFormProps) => (
  <form role="search" aria-labelledby="main-title" onSubmit={onSubmit}>
    <textarea 
      placeholder="광고 내용을 입력하세요" 
      rows={5}
      className="ad-input"
      aria-label="광고 내용 입력"
      style={{ color: '#000000' }}
    />
    <button 
      type="submit" 
      className="submit-button"
      aria-label="허위광고 판별하기"
    >
      판별하기
    </button>
  </form>
);

// 이미지 업로드 컴포넌트
interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

const ImageUpload = ({ onImageUpload }: ImageUploadProps) => (
  <div className="image-search-container">
    <h3 id="image-search-title">이미지로 검색하기</h3>
    <div 
      className="image-upload-box"
      role="button"
      tabIndex={0}
      aria-labelledby="image-search-title"
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onImageUpload(file);
          }
        }}
        aria-label="이미지 파일 선택"
      />
      <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
    </div>
  </div>
);

// 설명 텍스트 컴포넌트
const DescriptionText = () => (
  <p 
    role="note" 
    style={{ textAlign: 'center', color: '#666666' }}
  >
    의심되는 의약품 광고 내용을 입력하시면 허위광고 여부를 판별해드립니다!
  </p>
);

// 메인 검색 섹션 컴포넌트
interface SearchSectionProps {
  onSubmit: (e: React.FormEvent) => void;
  onImageUpload: (file: File) => void;
}

const SearchSection = ({ onSubmit, onImageUpload }: SearchSectionProps) => (
  <section 
    className="search-container" 
    role="search" 
    aria-label="의약품 허위광고 검색"
  >
    <h2 id="main-title">의약품 허위광고 판별하기</h2>
    <DescriptionText />
    <SearchForm onSubmit={onSubmit} />
    <ImageUpload onImageUpload={onImageUpload} />
  </section>
);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출 로직
    console.log('폼 제출됨');
  };

  const handleImageUpload = (file: File) => {
    console.log('이미지 업로드:', file);
  };

  return (
    <Layout>
      <SearchSection 
        onSubmit={handleFormSubmit}
        onImageUpload={handleImageUpload}
      />
    </Layout>
  );
};

export default FADsearch;
