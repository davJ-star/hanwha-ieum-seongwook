// src/pages/FADsearch.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import '../styles/pages/FADsearch.css';
import axios from 'axios';

// (1) 검색 결과 인터페이스
interface SearchResult {
  id: number;
  productName: string;
  isDeceptive: boolean;
  confidence: number;
  details: string;
}

// (2) 허위광고 입력 폼 컴포넌트
interface SearchFormProps {
  onSubmit: (searchTerm: string) => void;
}

const AdSearchForm = ({ onSubmit }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      alert('광고 내용을 입력하세요!');
      return;
    }
    onSubmit(searchTerm.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="ad-search-form">
      <textarea
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="광고 내용을 입력하세요"
        rows={5}
        className="ad-input"
        aria-label="광고 내용 입력"
        style={{ color: '#000000' }}
      />
      <button type="submit" className="submit-button" aria-label="허위광고 판별하기">
        판별하기
      </button>
    </form>
  );
};

// (3) 이미지 업로드 컴포넌트 (선택)
interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setIsLoading(true);
    try {
      // 예시: 이미지 분석 API 호출
      const response = await axios.post(`http://13.124.88.193:8080/ocr`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('[FADsearch] 이미지 검색 응답:', response.data);
      // 필요 시 결과 처리 로직 추가
      onImageUpload(file);
    } catch (error) {
      console.error('[FADsearch] 이미지 검색 중 오류 발생:', error);
      alert('이미지 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="image-search-container">
      <h3 id="image-search-title">이미지로 검색하기</h3>
      <div className="image-upload-box" role="button" aria-labelledby="image-search-title">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          aria-label="이미지 파일 선택"
          disabled={isLoading}
        />
        <p>{isLoading ? '분석 중...' : '이미지를 드래그하거나 클릭하여 업로드하세요'}</p>
      </div>
    </div>
  );
};

// (4) 메인 검색 섹션 컴포넌트
interface SearchSectionProps {
  onSubmit: (searchTerm: string) => void;
  onImageUpload: (file: File) => void;
}

const SearchSection = ({ onSubmit, onImageUpload }: SearchSectionProps) => (
  <section className="search-container" role="search" aria-label="의약품 허위광고 검색">
    <h2 id="main-title">의약품 허위광고 판별하기</h2>
    <p style={{ textAlign: 'center', color: '#666666' }}>
      의심되는 의약품 광고 내용을 입력하시면 허위광고 여부를 판별해드립니다!
    </p>
    <AdSearchForm onSubmit={onSubmit} />
    <ImageUpload onImageUpload={onImageUpload} />
  </section>
);

const FADsearch = () => {
  const navigate = useNavigate();

  const handleAdSearch = async (searchTerm: string) => {
    try {
      console.log('[FADsearch] 허위광고 -> 의약품 검색 요청 >>', { searchTerm });
      // 입력된 광고 내용을 의약품 검색 API에 전달 (type은 'medicine' 고정)
      const response = await axios.get(`http://localhost:8080/search/${searchTerm}`, {
        params: { type: 'medicine' },
      });
      console.log('[FADsearch] 의약품 검색 응답 <<', response.data);
      // 결과를 FADresult 페이지로 전달
      navigate('/FADresult', { state: { results: response.data } });
    } catch (error) {
      console.error('[FADsearch] 검색 오류:', error);
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  const handleImageUpload = (file: File) => {
    console.log('[FADsearch] 이미지 업로드:', file);
  };

  return (
    <Layout>
      <SearchSection onSubmit={handleAdSearch} onImageUpload={handleImageUpload} />
    </Layout>
  );
};

export default FADsearch;


// // src/pages/FADsearch.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
// import AccessibilityModal from '../components/AccessibilityModal';
// import Layout from '../components/Layout/Layout';
// import '../styles/pages/FADsearch.css';
// import axios from 'axios';

// // (1) 검색 결과 인터페이스
// interface SearchResult {
//   id: number;
//   productName: string;
//   isDeceptive: boolean;
//   confidence: number;
//   details: string;
// }

// // (2) 허위광고 입력 폼 컴포넌트
// interface SearchFormProps {
//   onSubmit: (searchTerm: string) => void;
// }

// const AdSearchForm = ({ onSubmit }: SearchFormProps) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) {
//       alert('광고 내용을 입력하세요!');
//       return;
//     }
//     onSubmit(searchTerm.trim());
//   };

//   return (
//     <form onSubmit={handleSubmit} className="ad-search-form">
//       <textarea
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         placeholder="광고 내용을 입력하세요"
//         rows={5}
//         className="ad-input"
//         aria-label="광고 내용 입력"
//         style={{ color: '#000000' }}
//       />
//       <button type="submit" className="submit-button" aria-label="허위광고 판별하기">
//         판별하기
//       </button>
//     </form>
//   );
// };

// // (3) 이미지 업로드 컴포넌트 (선택)
// interface ImageUploadProps {
//   onImageUpload: (file: File) => void;
// }

// const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append('image', file);
//     setIsLoading(true);
//     try {
//       // 예시: 이미지 분석 API 호출
//       const response = await axios.post(`http://13.124.88.193:8080/ocr`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       console.log('[FADsearch] 이미지 검색 응답:', response.data);
//       // 필요 시 결과 처리 로직 추가
//       onImageUpload(file);
//     } catch (error) {
//       console.error('[FADsearch] 이미지 검색 중 오류 발생:', error);
//       alert('이미지 분석 중 오류가 발생했습니다.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="image-search-container">
//       <h3 id="image-search-title">이미지로 검색하기</h3>
//       <div className="image-upload-box" role="button" aria-labelledby="image-search-title">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           aria-label="이미지 파일 선택"
//           disabled={isLoading}
//         />
//         <p>{isLoading ? '분석 중...' : '이미지를 드래그하거나 클릭하여 업로드하세요'}</p>
//       </div>
//     </div>
//   );
// };

// // (4) 메인 검색 섹션 컴포넌트
// interface SearchSectionProps {
//   onSubmit: (searchTerm: string) => void;
//   onImageUpload: (file: File) => void;
// }

// const SearchSection = ({ onSubmit, onImageUpload }: SearchSectionProps) => (
//   <section className="search-container" role="search" aria-label="의약품 허위광고 검색">
//     <h2 id="main-title">의약품 허위광고 판별하기</h2>
//     <p style={{ textAlign: 'center', color: '#666666' }}>
//       의심되는 의약품 광고 내용을 입력하시면 허위광고 여부를 판별해드립니다!
//     </p>
//     <AdSearchForm onSubmit={onSubmit} />
//     <ImageUpload onImageUpload={onImageUpload} />
//   </section>
// );

// const FADsearch = () => {
//   const navigate = useNavigate();

//   const handleAdSearch = async (searchTerm: string) => {
//     try {
//       console.log('[FADsearch] 허위광고 -> 의약품 검색 요청 >>', { searchTerm });
//       // 입력된 광고 내용을 의약품 검색 API에 전달 (type은 'medicine' 고정)
//       const response = await axios.get(`http://localhost:8080/search/${searchTerm}`, {
//         params: { type: 'medicine' },
//       });
//       console.log('[FADsearch] 의약품 검색 응답 <<', response.data);
//       // 결과를 FADresult 페이지로 전달
//       navigate('/FADresult', { state: { results: response.data } });
//     } catch (error) {
//       console.error('[FADsearch] 검색 오류:', error);
//       alert('검색 중 오류가 발생했습니다.');
//     }
//   };

//   const handleImageUpload = (file: File) => {
//     console.log('[FADsearch] 이미지 업로드:', file);
//   };

//   return (
//     <Layout>
//       <SearchSection onSubmit={handleAdSearch} onImageUpload={handleImageUpload} />
//     </Layout>
//   );
// };

// export default FADsearch;
