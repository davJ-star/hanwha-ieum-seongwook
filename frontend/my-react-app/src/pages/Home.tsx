// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/App.css';
import Layout from '../components/Layout/Layout';
import CommunitySection from '../components/Layout/CommunitySection';
import AccessibilityModal from '../components/AccessibilityModal';
import SearchForm from '../components/common/SearchForm';
import ImageSearch from '../components/common/ImageSearch';
import { uploadImage } from '../utils/imageUpload';
import { FaArrowUp } from 'react-icons/fa';

// 검색 결과 타입 정의
interface SearchResult {
  id: number;
  itemName: string;
  entpName: string;
  efcyQesitm: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios
          .get(`/*추후 추가 예정*/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() => ({ data: { isValid: false } }));
        setIsLoggedIn(response.data.isValid);
        setUserRole(response.data.role);
      } catch (error) {
        console.log('토큰 검증 중 오류 발생');
      }
    }
  };

  // 텍스트 검색 핸들러
  const handleSearchSubmit = async (
    e: React.FormEvent,
    searchType: string,
    searchTerm: string
  ) => {
    e.preventDefault();
    if (!searchTerm.trim() || !searchType) {
      alert('검색어와 검색 조건을 모두 입력해주세요.');
      return;
    }
    console.log('[Home.tsx] 검색 요청 >>', { searchType, searchTerm });
    try {
      let response;
      if (searchType === 'medicine') {
        response = await axios.get(
          `http://13.124.88.193:8080/search/${searchTerm.trim()}`,
          { params: { type: searchType } }
        );
      } else if (searchType === 'disease') {
        response = await axios.get(
          `http://13.124.88.193:8080/api/health/search`,
          { params: { keyword: searchTerm.trim(), type: 'disease' } }
        );
      }
      console.log('[Home.tsx] 검색 응답 <<', response?.data);
      if (searchType === 'medicine') {
        navigate('/DrugSearchResult', { state: { results: response?.data } });
      } else if (searchType === 'disease') {
        navigate('/DiseaseSearchResult', { state: { results: response?.data } });
      }
    } catch (error) {
      console.error('[Home.tsx] 검색 중 오류 발생:', error);
      alert('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 이미지 검색 핸들러
  const handleImageUpload = async (file: File) => {
    await uploadImage(
      file,
      (uploadedData: SearchResult[]) => {
        console.log('[Home.tsx] 이미지 검색 완료:', uploadedData);

        if (Array.isArray(uploadedData) && uploadedData.length > 0) {
          navigate('/DrugSearchResult', { state: { results: uploadedData } });
        } else {
          alert('이미지 검색 결과가 없습니다.');
        }
      },
      setIsLoading // 로딩 상태 업데이트 함수 전달
    );
  };

  return (
    <Layout>
      <div className="search-container" role="search" aria-label="질병/의약품 검색">
        <h2>질병/의약품 검색하기</h2>
        <p style={{ textAlign: 'center', color: '#666666' }}>
          내가 가진 질병과 복용 중인 의약품에 대해 더 정확히 알고 싶다면 여기서 검색해보세요!
        </p>
        <SearchForm onSubmit={handleSearchSubmit} />
        <ImageSearch onUpload={handleImageUpload} />
        {isLoading && <p style={{ textAlign: 'center', color: 'blue' }}>이미지 검색 중...</p>}
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


// // src/pages/Home.tsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../styles/pages/App.css';
// import Layout from '../components/Layout/Layout';
// import CommunitySection from '../components/Layout/CommunitySection';
// import AccessibilityModal from '../components/AccessibilityModal';
// import SearchForm from '../components/common/SearchForm';
// import ImageSearch from '../components/common/ImageSearch';
// import { uploadImage } from '../utils/imageUpload';
// import { FaArrowUp } from 'react-icons/fa';

// // 검색 결과 타입 정의
// interface SearchResult {
//   id: number;
//   itemName: string;
//   entpName: string;
//   efcyQesitm: string;
// }

// const MainBanner = () => (
//   <div className="main-banner" role="banner" aria-label="메인 배너">
//     <div className="banner-content">
//       <h2>
//         쉬운 의약품 복용 관리 플랫폼
//         <div style={{ marginTop: '10px' }}>
//           <span
//             style={{
//               color: '#FFFF00',
//               textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
//             }}
//           >
//             MediLink
//           </span>{' '}
//           입니다!
//         </div>
//       </h2>
//       <h4>약 정보 찾기 어려우셨나요?</h4>
//       <h4>약국 추천만 믿고 복용하셨던 분들!</h4>
//       <h4>내 질환에 딱 맞는 정보를 원하셨던 분들!</h4>
//       <h4>이제 MediLink와 함께 쉽고 편리한 약 복용 관리 서비스를 경험해보세요!</h4>
//     </div>
//   </div>
// );

// const Home = () => {
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
//         const response = await axios
//           .get(`/*추후 추가 예정*/`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//           .catch(() => ({ data: { isValid: false } }));
//         setIsLoggedIn(response.data.isValid);
//         setUserRole(response.data.role);
//       } catch (error) {
//         console.log('토큰 검증 중 오류 발생');
//       }
//     }
//   };

//   // 텍스트 검색 핸들러
//   const handleSearchSubmit = async (
//     e: React.FormEvent,
//     searchType: string,
//     searchTerm: string
//   ) => {
//     e.preventDefault();
//     if (!searchTerm.trim() || !searchType) {
//       alert('검색어와 검색 조건을 모두 입력해주세요.');
//       return;
//     }
//     console.log('[Home.tsx] 검색 요청 >>', { searchType, searchTerm });
//     try {
//       let response;
//       if (searchType === 'medicine') {
//         response = await axios.get(
//           `http://13.124.88.193:8080/search/${searchTerm.trim()}`,
//           { params: { type: searchType } }
//         );
//       } else if (searchType === 'disease') {
//         response = await axios.get(
//           `http://13.124.88.193:8080/api/health/search`,
//           { params: { keyword: searchTerm.trim(), type: 'disease' } }
//         );
//       }
//       console.log('[Home.tsx] 검색 응답 <<', response?.data);
//       if (searchType === 'medicine') {
//         navigate('/DrugSearchResult', { state: { results: response?.data } });
//       } else if (searchType === 'disease') {
//         navigate('/DiseaseSearchResult', { state: { results: response?.data } });
//       }
//     } catch (error) {
//       console.error('[Home.tsx] 검색 중 오류 발생:', error);
//       alert('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
//     }
//   };

//   // 이미지 검색 핸들러
//   const handleImageUpload = async (file: File) => {
//     await uploadImage(
//       file,
//       (uploadedData: SearchResult[]) => {
//         console.log('[Home.tsx] 이미지 검색 완료:', uploadedData);

//         if (Array.isArray(uploadedData) && uploadedData.length > 0) {
//           navigate('/DrugSearchResult', { state: { results: uploadedData } });
//         } else {
//           alert('이미지 검색 결과가 없습니다.');
//         }
//       }
//     );
//   };

//   return (
//     <Layout>
//       <MainBanner />
//       <div className="search-container" role="search" aria-label="질병/의약품 검색">
//         <h2>질병/의약품 검색하기</h2>
//         <p style={{ textAlign: 'center', color: '#666666' }}>
//           내가 가진 질병과 복용 중인 의약품에 대해 더 정확히 알고 싶다면 여기서 검색해보세요!
//         </p>
//         <SearchForm onSubmit={handleSearchSubmit} />
//         <ImageSearch onUpload={handleImageUpload} />
//       </div>
//       <CommunitySection navigate={navigate} />
//       <AccessibilityModal isOpen={false} onClose={() => {}} />
//       <button
//         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//         aria-label="맨 위로 이동"
//         style={{ position: 'fixed', bottom: '20px', right: '20px' }}
//       >
//         <FaArrowUp />
//       </button>
//     </Layout>
//   );
// };

// export default Home;


// // // src/pages/Home.tsx
// // import React, { useEffect, useState } from 'react';
// // import axios, { AxiosError } from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import '../styles/pages/App.css';
// // import Layout from '../components/Layout/Layout';
// // import CommunitySection from '../components/Layout/CommunitySection';
// // import AccessibilityModal from '../components/AccessibilityModal';
// // import SearchForm from '../components/common/SearchForm';
// // import ImageSearch from '../components/common/ImageSearch';
// // import { uploadImage } from '../utils/imageUpload'; // 이미지 업로드 유틸
// // import { FaArrowUp } from 'react-icons/fa';

// // const MainBanner = () => (
// //   <div className="main-banner" role="banner" aria-label="메인 배너">
// //     <div className="banner-content">
// //       <h2>
// //         쉬운 의약품 복용 관리 플랫폼
// //         <div style={{ marginTop: '10px' }}>
// //           <span
// //             style={{
// //               color: '#FFFF00',
// //               textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
// //             }}
// //           >
// //             MediLink
// //           </span>{' '}
// //           입니다!
// //         </div>
// //       </h2>
// //       <h4>약 정보 찾기 어려우셨나요?</h4>
// //       <h4>약국 추천만 믿고 복용하셨던 분들!</h4>
// //       <h4>내 질환에 딱 맞는 정보를 원하셨던 분들!</h4>
// //       <h4>이제 MediLink와 함께 쉽고 편리한 약 복용 관리 서비스를 경험해보세요!</h4>
// //     </div>
// //   </div>
// // );

// // const Home = () => {
// //   const navigate = useNavigate();
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const [userRole, setUserRole] = useState<string | null>(null);

// //   useEffect(() => {
// //     checkLoginStatus();
// //   }, []);

// //   const checkLoginStatus = async () => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       try {
// //         const response = await axios
// //           .get(`/*추후 추가 예정*/`, {
// //             headers: { Authorization: `Bearer ${token}` },
// //           })
// //           .catch(() => ({ data: { isValid: false } }));
// //         setIsLoggedIn(response.data.isValid);
// //         setUserRole(response.data.role);
// //       } catch (error) {
// //         console.log('토큰 검증 중 오류 발생');
// //       }
// //     }
// //   };

// //   // 텍스트 검색 핸들러 (의약품/질병 구분)
// //   const handleSearchSubmit = async (
// //     e: React.FormEvent,
// //     searchType: string,
// //     searchTerm: string
// //   ) => {
// //     e.preventDefault();
// //     if (!searchTerm.trim() || !searchType) {
// //       alert('검색어와 검색 조건을 모두 입력해주세요.');
// //       return;
// //     }
// //     console.log('[Home.tsx] 검색 요청 >>', { searchType, searchTerm });
// //     try {
// //       let response;
// //       if (searchType === 'medicine') {
// //         response = await axios.get(
// //           `http://13.124.88.193:8080/search/${searchTerm.trim()}`,
// //           { params: { type: searchType } }
// //         );
// //       } else if (searchType === 'disease') {
// //         response = await axios.get(
// //           `http://13.124.88.193:8080/api/health/search`,
// //           { params: { keyword: searchTerm.trim(), type: 'disease' } }
// //         );
// //       }
// //       console.log('[Home.tsx] 검색 응답 <<', response?.data);
// //       if (searchType === 'medicine') {
// //         navigate('/DrugSearchResult', { state: { results: response?.data } });
// //       } else if (searchType === 'disease') {
// //         navigate('/DiseaseSearchResult', { state: { results: response?.data } });
// //       }
// //     } catch (error) {
// //       console.error('[Home.tsx] 검색 중 오류 발생:', error);
// //       alert('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
// //     }
// //   };

// //   // 이미지 검색 핸들러 (uploadImage 유틸 사용)
// //   const handleImageUpload = async (file: File) => {
// //     await uploadImage(file, (uploadedData) => {
// //       console.log('[Home.tsx] 이미지 검색 응답:', uploadedData);
// //       if (Array.isArray(uploadedData) && uploadedData.length > 0) {
// //         navigate('/DrugSearchResult', { state: { results: uploadedData } });
// //       } else {
// //         alert('이미지 검색 결과가 없습니다.');
// //       }
// //     });
// //   };

// //   return (
// //     <Layout>
// //       <MainBanner />
// //       <div className="search-container" role="search" aria-label="질병/의약품 검색">
// //         <h2>질병/의약품 검색하기</h2>
// //         <p style={{ textAlign: 'center', color: '#666666' }}>
// //           내가 가진 질병과 복용 중인 의약품에 대해 더 정확히 알고 싶다면 여기서 검색해보세요!
// //         </p>
// //         <SearchForm onSubmit={handleSearchSubmit} />
// //         <ImageSearch onUpload={handleImageUpload} />
// //       </div>
// //       <CommunitySection navigate={navigate} />
// //       <AccessibilityModal isOpen={false} onClose={() => {}} />
// //       <button
// //         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
// //         aria-label="맨 위로 이동"
// //         style={{ position: 'fixed', bottom: '20px', right: '20px' }}
// //       >
// //         <FaArrowUp />
// //       </button>
// //     </Layout>
// //   );
// // };

// // export default Home;

// // // // src/pages/Home.tsx
// // // import React, { useEffect, useState } from 'react';
// // // import axios, { AxiosError } from 'axios';
// // // import { useNavigate } from 'react-router-dom';
// // // import '../styles/pages/App.css';
// // // import Layout from '../components/Layout/Layout';
// // // import CommunitySection from '../components/Layout/CommunitySection';
// // // import AccessibilityModal from '../components/AccessibilityModal';
// // // import SearchForm from '../components/common/SearchForm';
// // // import ImageSearch from '../components/common/ImageSearch';
// // // import { uploadImage } from '../utils/imageUpload'; // 📌 imageUpload 유틸 사용
// // // import { FaArrowUp } from 'react-icons/fa';

// // // const MainBanner = () => (
// // //   <div className="main-banner" role="banner" aria-label="메인 배너">
// // //     <div className="banner-content">
// // //       <h2>
// // //         쉬운 의약품 복용 관리 플랫폼
// // //         <div style={{ marginTop: '10px' }}>
// // //           <span
// // //             style={{
// // //               color: '#FFFF00',
// // //               textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
// // //             }}
// // //           >
// // //             MediLink
// // //           </span>{' '}
// // //           입니다!
// // //         </div>
// // //       </h2>
// // //       <h4>약 정보 찾기 어려우셨나요?</h4>
// // //       <h4>약국 추천만 믿고 복용하셨던 분들!</h4>
// // //       <h4>내 질환에 딱 맞는 정보를 원하셨던 분들!</h4>
// // //       <h4>이제 MediLink와 함께 쉽고 편리한 약 복용 관리 서비스를 경험해보세요!</h4>
// // //     </div>
// // //   </div>
// // // );

// // // const Home = () => {
// // //   const navigate = useNavigate();
// // //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// // //   const [userRole, setUserRole] = useState<string | null>(null);

// // //   useEffect(() => {
// // //     checkLoginStatus();
// // //   }, []);

// // //   const checkLoginStatus = async () => {
// // //     const token = localStorage.getItem('token');
// // //     if (token) {
// // //       try {
// // //         const response = await axios
// // //           .get(`/*추후 추가 예정*/`, {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //           })
// // //           .catch(() => ({ data: { isValid: false } }));
// // //         setIsLoggedIn(response.data.isValid);
// // //         setUserRole(response.data.role);
// // //       } catch (error) {
// // //         console.log('토큰 검증 중 오류 발생');
// // //       }
// // //     }
// // //   };

// // //   // (1) 텍스트 검색
// // //   const handleSearchSubmit = async (
// // //     e: React.FormEvent,
// // //     searchType: string,
// // //     searchTerm: string
// // //   ) => {
// // //     e.preventDefault();
// // //     if (!searchTerm.trim() || !searchType) {
// // //       alert('검색어와 검색 조건을 모두 입력해주세요.');
// // //       return;
// // //     }

// // //     console.log('[Home.tsx] 검색 요청 >>', { searchType, searchTerm });
// // //     try {
// // //       let response;
// // //       if (searchType === 'medicine') {
// // //         response = await axios.get(`http://13.124.88.193:8080/search/${searchTerm.trim()}`, {
// // //           params: { type: searchType },
// // //         });
// // //       } else if (searchType === 'disease') {
// // //         response = await axios.get(`http://13.124.88.193:8080/api/health/search?keyword=${searchTerm.trim()}`, {
// // //           params: { type: 'disease' },
// // //         });
// // //       }

// // //       console.log('[Home.tsx] 검색 응답 <<', response.data);

// // //       if (searchType === 'medicine') {
// // //         navigate('/DrugSearchResult', { state: { results: response.data } });
// // //       } else if (searchType === 'disease') {
// // //         navigate('/DiseaseSearchResult', { state: { results: response.data } });
// // //       }
// // //     } catch (error) {
// // //       console.error('[Home.tsx] 검색 중 오류 발생:', error);
// // //       alert('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
// // //     }
// // //   };

// // //   // (2) 이미지 검색 (OCR) → DrugSearchResult.tsx의 방식으로 변경
// // //   const handleImageUpload = async (file: File) => {
// // //     await uploadImage(file, (uploadedData) => {
// // //       console.log('[Home.tsx] 이미지 검색 응답:', uploadedData);
// // //       if (Array.isArray(uploadedData) && uploadedData.length > 0) {
// // //         navigate('/DrugSearchResult', { state: { results: uploadedData } });
// // //       } else {
// // //         alert('이미지 검색 결과가 없습니다.');
// // //       }
// // //     });
// // //   };

// // //   return (
// // //     <Layout>
// // //       <MainBanner />
// // //       <div className="search-container" role="search" aria-label="질병/의약품 검색">
// // //         <h2>질병/의약품 검색하기</h2>
// // //         <p style={{ textAlign: 'center', color: '#666666' }}>
// // //           내가 가진 질병과 복용 중인 의약품에 대해 더 정확히 알고 싶다면 여기서 검색해보세요!
// // //         </p>
// // //         <SearchForm onSubmit={handleSearchSubmit} />
// // //         <ImageSearch onUpload={handleImageUpload} />
// // //       </div>
// // //       <CommunitySection navigate={navigate} />
// // //       <AccessibilityModal isOpen={false} onClose={() => {}} />
// // //       <button
// // //         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
// // //         aria-label="맨 위로 이동"
// // //         style={{ position: 'fixed', bottom: '20px', right: '20px' }}
// // //       >
// // //         <FaArrowUp />
// // //       </button>
// // //     </Layout>
// // //   );
// // // };

// // // export default Home;


// // // // src/pages/Home.tsx
// // // import React, { useEffect, useState } from 'react';
// // // import axios, { AxiosError } from 'axios';
// // // import { useNavigate } from 'react-router-dom';
// // // import '../styles/pages/App.css';
// // // import Layout from '../components/Layout/Layout';
// // // import CommunitySection from '../components/Layout/CommunitySection';
// // // import AccessibilityModal from '../components/AccessibilityModal';
// // // import SearchForm from '../components/common/SearchForm';
// // // import ImageSearch from '../components/common/ImageSearch';
// // // import { FaArrowUp } from 'react-icons/fa';

// // // const MainBanner = () => (
// // //   <div className="main-banner" role="banner" aria-label="메인 배너">
// // //     <div className="banner-content">
// // //       <h2>
// // //         쉬운 의약품 복용 관리 플랫폼
// // //         <div style={{ marginTop: '10px' }}>
// // //           <span
// // //             style={{
// // //               color: '#FFFF00',
// // //               textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
// // //             }}
// // //           >
// // //             MediLink
// // //           </span>{' '}
// // //           입니다!
// // //         </div>
// // //       </h2>
// // //       <h4>약 정보 찾기 어려우셨나요?</h4>
// // //       <h4>약국 추천만 믿고 복용하셨던 분들!</h4>
// // //       <h4>내 질환에 딱 맞는 정보를 원하셨던 분들!</h4>
// // //       <h4>이제 MediLink와 함께 쉽고 편리한 약 복용 관리 서비스를 경험해보세요!</h4>
// // //     </div>
// // //   </div>
// // // );

// // // const Home = () => {
// // //   const navigate = useNavigate();
// // //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// // //   const [userRole, setUserRole] = useState<string | null>(null);

// // //   useEffect(() => {
// // //     checkLoginStatus();
// // //   }, []);

// // //   const checkLoginStatus = async () => {
// // //     const token = localStorage.getItem('token');
// // //     if (token) {
// // //       try {
// // //         const response = await axios
// // //           .get(`/*추후 추가 예정*/`, {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //           })
// // //           .catch(() => ({ data: { isValid: false } }));
// // //         setIsLoggedIn(response.data.isValid);
// // //         setUserRole(response.data.role);
// // //       } catch (error) {
// // //         console.log('토큰 검증 중 오류 발생');
// // //       }
// // //     }
// // //   };

// // //   // (1) 텍스트 검색
// // //   const handleSearchSubmit = async (
// // //     e: React.FormEvent,
// // //     searchType: string,
// // //     searchTerm: string
// // //   ) => {
// // //     e.preventDefault();
// // //     if (!searchTerm.trim() || !searchType) {
// // //       alert('검색어와 검색 조건을 모두 입력해주세요.');
// // //       return;
// // //     }

// // //     console.log('[Home.tsx] 검색 요청 >>', { searchType, searchTerm });
// // //     try {
// // //       let response;
// // //       if (searchType === 'medicine') {
// // //         response = await axios.get(`http://13.124.88.193:8080/search/${searchTerm.trim()}`, {
// // //           params: { type: searchType },
// // //         });
// // //       } else if (searchType === 'disease') {
// // //         response = await axios.get(`http://13.124.88.193:8080/api/health/search?keyword=${searchTerm.trim()}`, {
// // //           params: { type: 'disease' },
// // //         });
// // //       }

// // //       console.log('[Home.tsx] 검색 응답 <<', response.data);

// // //       if (searchType === 'medicine') {
// // //         navigate('/DrugSearchResult', { state: { results: response.data } });
// // //       } else if (searchType === 'disease') {
// // //         navigate('/DiseaseSearchResult', { state: { results: response.data } });
// // //       }
// // //     } catch (error) {
// // //       console.error('[Home.tsx] 검색 중 오류 발생:', error);
// // //       alert('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
// // //     }
// // //   };

// // //   // (2) 이미지 검색 (OCR)
// // //   const handleImageUpload = async (file: File) => {
// // //     const formData = new FormData();
// // //     // 백엔드에서 MultipartFile 파라미터명이 'file'이라면 .append('file', file)
// // //     // (사용 중인 백엔드 코드에 따라 파라미터명을 맞춰주세요)
// // //     formData.append('file', file);

// // //     try {
// // //       console.log('[Home.tsx] 이미지 검색 요청 >>', file);

// // //       // POST /ocr 로 이미지 전송 (multipart/form-data)
// // //       const response = await axios.post(`/ocr`, formData, {
// // //         headers: { 'Content-Type': 'multipart/form-data' },
// // //       });

// // //       console.log('[Home.tsx] 이미지 검색 응답 <<', response.data);
// // //       /**
// // //        * 예시 응답 (가정):
// // //        * {
// // //        *   "success": true,   // 또는 "FALSE"/"TRUE"
// // //        *   "drugList": [
// // //        *     { "id": 1, "itemName": "...", "entpName": "...", "efcyQesitm": "..." },
// // //        *     ...
// // //        *   ]
// // //        * }
// // //        */

// // //       // 결과 해석
// // //       if (response.data.success === true && response.data.drugList?.length > 0) {
// // //         // DrugSearchResult 페이지로
// // //         navigate('/DrugSearchResult', { state: { results: response.data.drugList } });
// // //       } else {
// // //         // 실패거나 결과 없음
// // //         alert('이미지 검색 결과가 없습니다.');
// // //       }
// // //     } catch (error) {
// // //       console.error('[Home.tsx] 이미지 검색 중 오류 발생:', error);
// // //       alert('이미지 검색 중 오류가 발생했습니다.');
// // //     }
// // //   };

// // //   return (
// // //     <Layout>
// // //       <MainBanner />
// // //       <div className="search-container" role="search" aria-label="질병/의약품 검색">
// // //         <h2>질병/의약품 검색하기</h2>
// // //         <p style={{ textAlign: 'center', color: '#666666' }}>
// // //           내가 가진 질병과 복용 중인 의약품에 대해 더 정확히 알고 싶다면 여기서 검색해보세요!
// // //         </p>
// // //         <SearchForm onSubmit={handleSearchSubmit} />
// // //         <ImageSearch onUpload={handleImageUpload} />
// // //       </div>
// // //       <CommunitySection navigate={navigate} />
// // //       <AccessibilityModal isOpen={false} onClose={() => {}} />
// // //       <button
// // //         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
// // //         aria-label="맨 위로 이동"
// // //         style={{ position: 'fixed', bottom: '20px', right: '20px' }}
// // //       >
// // //         <FaArrowUp />
// // //       </button>
// // //     </Layout>
// // //   );
// // // };

// // // export default Home;
