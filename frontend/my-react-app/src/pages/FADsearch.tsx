import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import '../styles/pages/FADsearch.css';
import axios from 'axios';

// 검색 결과 인터페이스
interface SearchResult {
  isDeceptive: boolean;
  confidence: number;
  details: string;
}

// 검색 폼 컴포넌트
interface SearchFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm = ({ onSubmit }: SearchFormProps) => {
  const [adContent, setAdContent] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adContent.trim()) {
      alert('광고 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 광고 분석 API 호출(테스트 전)
      const response = await axios.post(`/*추후 추가 예정*/`,
        { content: adContent }
      );

      setResult(response.data);
    } catch (error) {
      console.error('광고 분석 중 오류 발생:', error);
      alert('광고 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form role="search" aria-labelledby="main-title" onSubmit={handleSubmit}>
        <textarea 
          value={adContent}
          onChange={(e) => setAdContent(e.target.value)}
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
          disabled={isLoading}
        >
          {isLoading ? '분석 중...' : '판별하기'}
        </button>
      </form>
      {result && (
        <div className="result-container" role="alert">
          <h3>분석 결과</h3>
          <p>판별 결과: {result.isDeceptive ? '허위광고' : '정상광고'}</p>
          <p>신뢰도: {result.confidence}%</p>
          <p>상세 설명: {result.details}</p>
        </div>
      )}
    </div>
  );
};

// 이미지 업로드 컴포넌트
interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setIsLoading(true);

    try {
      // 이미지 분석 API 호출(테스트 전)
      const response = await axios.post(`/*추후 추가 예정*/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setResult(response.data);
      onImageUpload(file);
    } catch (error) {
      console.error('이미지 분석 중 오류 발생:', error);
      alert('이미지 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              handleImageUpload(file);
            }
          }}
          aria-label="이미지 파일 선택"
          disabled={isLoading}
        />
        <p>{isLoading ? '분석 중...' : '이미지를 드래그하거나 클릭하여 업로드하세요'}</p>
      </div>
      {result && (
        <div className="result-container" role="alert">
          <h3>이미지 분석 결과</h3>
          <p>판별 결과: {result.isDeceptive ? '허위광고' : '정상광고'}</p>
          <p>신뢰도: {result.confidence}%</p>
          <p>상세 설명: {result.details}</p>
        </div>
      )}
    </div>
  );
};

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
