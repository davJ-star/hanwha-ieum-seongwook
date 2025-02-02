// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../styles/pages/App.css';
// import { FaArrowUp, FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';
// import AccessibilityModal from '../components/AccessibilityModal';
// import Layout from '../components/Layout/Layout';
// import CommunitySection from '../components/Layout/CommunitySection';

// // 메인 배너 컴포넌트
// const MainBanner = () => (
//   <div className="main-banner" role="banner" aria-label="메인 배너">
//     <div className="banner-content">
//       <h2>쉬운 의약품 복용 관리 플랫폼 
//         <div style={{ marginTop: '10px' }}>
//           <span style={{
//             color: '#FFFF00',
//             textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
//           }}>MediLink</span>입니다!
//         </div>
//       </h2>
//       <h4>약 정보 찾기 어려우셨나요?</h4>
//       <h4>약국 추천만 믿고 복용하셨던 분들!</h4>
//       <h4>내 질환에 딱 맞는 정보를 원하셨던 분들!</h4>
//       <h4>이제 MediLink와 함께 쉽고 편리한 약 복용 관리 서비스를 경험해보세요!</h4>
//     </div>
//   </div>
// );

// // 검색 폼 컴포넌트
// const SearchForm = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchType, setSearchType] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!searchTerm.trim() || !searchType) {
//       alert('검색어와 검색 조건을 모두 입력해주세요.');
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:8080/search/${searchTerm.trim()}`, {
//         params: {
//           type: searchType
//         }
//       });

//       if (response.data) {
//         navigate('/search-results', { 
//           state: { 
//             results: response.data
//           } 
//         });
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('에러 상세 정보:', {
//           메시지: error.message,
//           상태코드: error.response?.status,
//           상태텍스트: error.response?.statusText,
//           에러응답데이터: error.response?.data,
//           요청URL: error.config?.url,
//           요청메서드: error.config?.method
//         });
//       } else {
//         console.error('알 수 없는 에러:', error);
//       }
//       alert('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} role="search" aria-label="검색 폼">
//       <select 
//         name="type" 
//         aria-label="검색 조건 선택"
//         onChange={(e) => setSearchType(e.target.value)}
//       >
//         <option value="" disabled selected>검색 조건</option>
//         <option value="medicine">의약품</option>
//         <option value="disease">질병</option>
//       </select>
//       <input 
//         type="text" 
//         placeholder="검색어를 입력하세요" 
//         aria-label="검색어 입력" 
//         style={{ color: '#000000' }}
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <button 
//         type="submit" 
//         style={{ color: '#000000' }} 
//         aria-label="검색하기"
//       >
//         검색
//       </button>
//     </form>
//   );
// };

// // 이미지 검색 컴포넌트
// const ImageSearch = () => {
//   const navigate = useNavigate();

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('image', file);

//     try {
//       // 이미지 검색 API 호출 (테스트 전)
//       const response = await axios.post(`/ocr`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       ).catch(() => ({ data: null }));

//       if (response.data) {
//         navigate('/search-results', { state: { results: response.data } });
//       }
//     } catch (error) {
//       console.log('이미지 검색 중 오류 발생');
//     }
//   };

//   return (
//     <div className="image-search-container" role="region" aria-label="이미지 검색">
//       <h3>이미지로 검색하기</h3>
//       <div 
//         className="image-upload-box" 
//         role="button" 
//         aria-label="이미지 업로드 영역"
//       >
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           aria-label="이미지 파일 선택"
//         />
//         <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
//       </div>
//     </div>
//   );
// };

// // 검색 섹션 컴포넌트
// const SearchSection = () => (
//   <div className="search-container" role="search" aria-label="질병/의약품 검색">
//     <h2>질병/의약품 검색하기</h2>
//     <p style={{ textAlign: 'center', color: '#666666' }}>
//       내가 가진 질병과 복용 중인 의약품에 대해 더 정확히 알고 싶다면 여기서 검색해보세요 !
//     </p>
//     <SearchForm />
//     <ImageSearch />
//   </div>
// );

// function Home() {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState<string | null>(null);

//   useEffect(() => {
//     checkLoginStatus();
//   }, []);

//   const checkLoginStatus = async () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const response = await axios.get(
//           // 토큰 검증 API 호출 (테스트 전)
//           `/*추후 추가 예정*/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           }
//         ).catch(() => ({ data: { isValid: false } }));

//         setIsLoggedIn(response.data.isValid);
//         setUserRole(response.data.role);
//       } catch (error) {
//         console.log('토큰 검증 중 오류 발생');
//       }
//     }
//   };

//   return (
//     <Layout>
//       <MainBanner />
//       <SearchSection />
//       <CommunitySection navigate={navigate} />
//     </Layout>
//   );
// }

// export default Home;
// pages/Home.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/App.css';
import Layout from '../components/Layout/Layout';
import CommunitySection from '../components/Layout/CommunitySection';
import AccessibilityModal from '../components/AccessibilityModal';
import SearchForm from '../components/common/SearchForm';
import ImageSearch from '../components/common/ImageSearch';
import { FaArrowUp } from 'react-icons/fa';

const MainBanner = () => (
  <div className="main-banner" role="banner" aria-label="메인 배너">
    <div className="banner-content">
      <h2>
        쉬운 의약품 복용 관리 플랫폼 
        <div style={{ marginTop: '10px' }}>
          <span
            style={{
              color: '#FFFF00',
              textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
            }}
          >
            MediLink
          </span>
          입니다!
        </div>
      </h2>
      <h4>약 정보 찾기 어려우셨나요?</h4>
      <h4>약국 추천만 믿고 복용하셨던 분들!</h4>
      <h4>내 질환에 딱 맞는 정보를 원하셨던 분들!</h4>
      <h4>이제 MediLink와 함께 쉽고 편리한 약 복용 관리 서비스를 경험해보세요!</h4>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(
          `/*추후 추가 예정*/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        ).catch(() => ({ data: { isValid: false } }));

        setIsLoggedIn(response.data.isValid);
        setUserRole(response.data.role);
      } catch (error) {
        console.log('토큰 검증 중 오류 발생');
      }
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent, searchType: string, searchTerm: string) => {
    e.preventDefault();
    if (!searchTerm.trim() || !searchType) {
      alert('검색어와 검색 조건을 모두 입력해주세요.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/search/${searchTerm.trim()}`, {
        params: { type: searchType }
      });
      if (response.data) {
        console.log('검색 결과:', response.data);
        // 검색 결과 페이지로 이동
        navigate('/search-results', { state: { results: response.data } });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('에러 상세 정보:', {
          메시지: error.message,
          상태코드: error.response?.status,
          상태텍스트: error.response?.statusText,
          에러응답데이터: error.response?.data,
          요청URL: error.config?.url,
          요청메서드: error.config?.method
        });
      } else {
        console.error('알 수 없는 에러:', error);
      }
      alert('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post(`/ocr`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data) {
        navigate('/search-results', { state: { results: response.data } });
      }
    } catch (error) {
      console.error('이미지 검색 중 오류 발생:', error);
      alert('이미지 검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <Layout>
      <MainBanner />
      <div className="search-container" role="search" aria-label="질병/의약품 검색">
        <h2>질병/의약품 검색하기</h2>
        <p style={{ textAlign: 'center', color: '#666666' }}>
          내가 가진 질병과 복용 중인 의약품에 대해 더 정확히 알고 싶다면 여기서 검색해보세요!
        </p>
        <SearchForm onSubmit={handleSearchSubmit} />
        <ImageSearch onUpload={handleImageUpload} />
      </div>
      <CommunitySection navigate={navigate} />
      <AccessibilityModal isOpen={false} onClose={() => {}} />
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="맨 위로 이동"
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
      >
        <FaArrowUp />
      </button>
    </Layout>
  );
};

export default Home;
