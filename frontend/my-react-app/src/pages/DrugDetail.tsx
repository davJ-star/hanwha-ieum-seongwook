// src/pages/DrugDetail.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/pages/DrugDetail.css';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import axios, { AxiosError } from 'axios';

interface DrugDetailResponse {
  id: number;
  name: string;
  detailInfo: string;
}

function DrugDetail() {
  // 쿼리 파라미터에서 id 추출 (?id=xxx)
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const [drugData, setDrugData] = useState<DrugDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrugDetail = async () => {
      if (!id) {
        setError('의약품 ID가 없습니다.');
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`/search/${id}/info`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        // 응답값은 { id, name, detailInfo } 형식
        setDrugData(response.data);
      } catch (err: unknown) {
        const errorObj = err as AxiosError;
        console.error('의약품 상세정보 조회 중 오류 발생:', errorObj);
        setError(errorObj.response?.data?.message || '의약품 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrugDetail();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!drugData) return <div>데이터가 없습니다.</div>;

  return (
    <Layout>
      <section className="drug-detail-container">
        <h2>의약품 상세 정보</h2>
        <div className="result-item" role="article">
          <h2>의약품명: {drugData.name}</h2>
          <div className="result-details">
            <p><strong>상세 정보:</strong></p>
            <p>{drugData.detailInfo}</p>
          </div>
        </div>
      </section>
      <AccessibilityModal isOpen={false} onClose={() => {}} />
    </Layout>
  );
}

export default DrugDetail;

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import '../styles/pages/DrugDetail.css';
// import AccessibilityModal from '../components/AccessibilityModal';
// import Layout from '../components/Layout/Layout';
// import axios, { AxiosError } from 'axios';

// interface DrugDetailResponse {
//   id: number;
//   name: string;
//   detailInfo: string;
// }

// function DrugDetail() {
//   // useSearchParams로 쿼리에서 id 추출 (?id=xxx)
//   const [searchParams] = useSearchParams();
//   const id = searchParams.get('id');
//   const navigate = useNavigate();
//   const [drugData, setDrugData] = useState<DrugDetailResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDrugDetail = async () => {
//       if (!id) {
//         setError('의약품 ID가 없습니다.');
//         return;
//       }
//       try {
//         setLoading(true);
//         const response = await axios.get(`/search/${id}/info`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         // 응답값은 { id, name, detailInfo } 형식
//         setDrugData(response.data);
//       } catch (err: unknown) {
//         const errorObj = err as AxiosError;
//         console.error('의약품 상세정보 조회 중 오류 발생:', errorObj);
//         setError(errorObj.response?.data?.message || '의약품 정보를 불러오는 중 오류가 발생했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDrugDetail();
//   }, [id]);

//   if (loading) return <div>로딩 중...</div>;
//   if (error) return <div>에러: {error}</div>;
//   if (!drugData) return <div>데이터가 없습니다.</div>;

//   return (
//     <Layout>
//       <section className="drug-detail-container">
//         <h2>의약품 상세 정보</h2>
//         <div className="result-item" role="article">
//           <h2>의약품명: {drugData.name}</h2>
//           <div className="result-details">
//             <p><strong>상세 정보:</strong></p>
//             <p>{drugData.detailInfo}</p>
//           </div>
//         </div>
//       </section>
//       <AccessibilityModal isOpen={false} onClose={() => {}} />
//     </Layout>
//   );
// }

// export default DrugDetail;



// import React, { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import '../styles/pages/DrugDetail.css';
// import AccessibilityModal from '../components/AccessibilityModal';
// import Layout from '../components/Layout/Layout';
// import axios from 'axios';

// interface DrugDetailResponse {
//   id: number;
//   name: string;
//   detailInfo: string;
// }

// function DrugDetail() {
//   // useSearchParams로 쿼리 파라미터에서 id 추출 (예: ?id=3)
//   const [searchParams] = useSearchParams();
//   const id = searchParams.get('id');
//   const navigate = useNavigate();
//   const [drugData, setDrugData] = useState<DrugDetailResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDrugDetail = async () => {
//       if (!id) {
//         setError('의약품 ID가 없습니다.');
//         return;
//       }
//       try {
//         setLoading(true);
//         const response = await axios.get(`/search/${id}/info`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         // 응답값은 { id, name, detailInfo } 형식으로 온다고 가정합니다.
//         setDrugData(response.data);
//       } catch (err: any) {
//         console.error('의약품 상세정보 조회 중 오류 발생:', err);
//         setError(err.response?.data?.message || '의약품 정보를 불러오는 중 오류가 발생했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDrugDetail();
//   }, [id]);

//   if (loading) return <div>로딩 중...</div>;
//   if (error) return <div>에러: {error}</div>;
//   if (!drugData) return <div>데이터가 없습니다.</div>;

//   return (
//     <Layout>
//       <section className="drug-detail-container">
//         <h2>의약품 상세 정보</h2>
//         <div className="result-item" role="article">
//           <h2>의약품명: {drugData.name}</h2>
//           <div className="result-details">
//             <p><strong>상세 정보:</strong></p>
//             <p>{drugData.detailInfo}</p>
//           </div>
//         </div>
//       </section>
//       <AccessibilityModal isOpen={false} onClose={() => {}} />
//     </Layout>
//   );
// }

// export default DrugDetail;


// // DrugDetail.tsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import '../styles/pages/DrugDetail.css';
// import AccessibilityModal from '../components/AccessibilityModal';
// import Layout from '../components/Layout/Layout';
// import axios from 'axios';

// interface DrugDetailResponse {
//   id: number;
//   name: string;
//   detailInfo: string;
// }

// function DrugDetail() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [drugData, setDrugData] = useState<DrugDetailResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDrugDetail = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`/search/${id}/info`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         // 응답값은 { id, name, detailInfo } 형식으로 온다고 가정합니다.
//         setDrugData(response.data);
//       } catch (err: any) {
//         console.error('의약품 상세정보 조회 중 오류 발생:', err);
//         setError(err.response?.data?.message || '의약품 정보를 불러오는 중 오류가 발생했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDrugDetail();
//   }, [id, navigate]);

//   if (loading) return <div>로딩 중...</div>;
//   if (error) return <div>에러: {error}</div>;
//   if (!drugData) return <div>데이터가 없습니다.</div>;

//   return (
//     <Layout>
//       <section className="drug-detail-container">
//         <h2>의약품 상세 정보</h2>
//         <div className="result-item" role="article">
//           <h2>의약품명: {drugData.name}</h2>
//           <div className="result-details">
//             <p><strong>상세 정보:</strong></p>
//             <p>{drugData.detailInfo}</p>
//           </div>
//         </div>
//       </section>
//       <AccessibilityModal isOpen={false} onClose={() => {}} />
//     </Layout>
//   );
// }

// export default DrugDetail;

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import '../styles/pages/DrugDetail.css';
// import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
// import { FaSearch, FaUniversalAccess, FaExclamationTriangle, FaBraille } from 'react-icons/fa';
// import AccessibilityModal from '../components/AccessibilityModal';
// import Layout from '../components/Layout/Layout';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import SignLanguageIcon from '@mui/icons-material/SignLanguage';
// import { speakPageContent } from '../utils/accessibilityHandleTTS';
// import axios from 'axios';

// interface DrugData {
//   id: number;
//   name: string;
//   ingredient: string;
//   effects: string;
//   dosage: string[];
//   precautions: string[];
// }

// function DrugDetail() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [drugData, setDrugData] = useState<DrugData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showBrailleOptions, setShowBrailleOptions] = useState(false);

//   useEffect(() => {
//     const fetchDrugDetail = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`/search/${id}/info`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         setDrugData(response.data);
//       } catch (error: any) {
//         console.error('의약품 정보 조회 중 오류 발생:', error);
//         setError(error.response?.data?.message || '의약품 정보를 불러오는 중 오류가 발생했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDrugDetail();
//   }, [id]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     alert('로그아웃 되었습니다.');
//     navigate('/login');
//   };

//   const handleZoom = (zoomType: string) => {
//     const currentZoom = document.body.style.zoom ? parseFloat(document.body.style.zoom) : 1;
//     if (zoomType === 'in') document.body.style.zoom = (currentZoom + 0.1).toString();
//     if (zoomType === 'out') document.body.style.zoom = (currentZoom - 0.1).toString();
//   };

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleBrailleOptionSelect = (option: string) => {
//     if (option === 'convert') {
//       handleBrailleClick();
//     } else if (option === 'revert') {
//       handleBrailleRevert();
//     }
//     setShowBrailleOptions(false);
//   };

//   const handleTTSClick = () => {
//     const container = document.querySelector('.search-results');
//     if (container instanceof HTMLElement) {
//       speakPageContent(container);
//     }
//   };

//   if (loading) return <div>로딩 중...</div>;
//   if (error) return <div>에러: {error}</div>;
//   if (!drugData) return <div>데이터가 없습니다.</div>;

//   return (
//     <Layout>
//       <section className="drug-detail-container">
//         <h2>의약품 상세 정보</h2>
//         <div className="result-item" role="article">
//           <h2>의약품명: {drugData.name}</h2>
//           <div className="result-details">
//             <p><strong>성분:</strong> {drugData.ingredient}</p>
//             <p><strong>효능/효과:</strong> {drugData.effects}</p>
//             <p><strong>용법/용량:</strong></p>
//             <ul role="list">
//               {drugData.dosage.map((item, index) => (
//                 <li key={index} role="listitem">{item}</li>
//               ))}
//             </ul>
//             <p><strong>주의사항:</strong></p>
//             <ul role="list">
//               {drugData.precautions.map((item, index) => (
//                 <li key={index} role="listitem">{item}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </section>
//       <AccessibilityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </Layout>
//   );
// }

// export default DrugDetail;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/pages/DrugDetail.css';
// import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
// import { FaSearch, FaUniversalAccess, FaExclamationTriangle, FaBraille } from 'react-icons/fa';
// import AccessibilityModal from '../components/AccessibilityModal';
// import Layout from '../components/Layout/Layout';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import SignLanguageIcon from '@mui/icons-material/SignLanguage';
// import { speakPageContent } from '../utils/accessibilityHandleTTS';
// import axios from 'axios';

// // 타입 정의 수정
// interface DrugData {
//   id: number;
//   name: string;
//   ingredient: string;
//   effects: string;
//   dosage: string[];
//   precautions: string[];
// }

// // SearchForm 컴포넌트 수정
// const SearchForm = ({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) => {
//   const [searchType, setSearchType] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!searchTerm.trim() || !searchType) {
//       alert('검색 조건과 검색어를 모두 입력해주세요.');
//       return;
//     }

//     try {
//       //검색 요청(테스트 전)
//       const response = await axios.get(`/search/{keyword}`, {
//         params: {
//           type: searchType,
//           keyword: searchTerm
//         },
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       onSubmit(e);
//     } catch (error: any) {
//       console.error('검색 중 오류 발생:', error);
//       alert(error.response?.data?.message || '검색 중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <form role="search" onSubmit={handleSubmit}>
//       <select 
//         name="type" 
//         value={searchType}
//         onChange={(e) => setSearchType(e.target.value)}
//         aria-label="검색 조건 선택"
//       >
//         <option value="" disabled>검색 조건</option>
//         <option value="medicine">의약품</option>
//         <option value="disease">질병</option>
//       </select>
//       <input 
//         type="text"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         placeholder="검색어를 입력하세요" 
//         aria-label="검색어 입력"
//       />
//       <button type="submit" style={{ color: '#000000' }} aria-label="검색">검색</button>
//     </form>
//   );
// };

// // ImageUpload 컴포넌트 수정
// const ImageUpload = () => {
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('image', file);

//     try {
//       //이미지 검색 요청(테스트 전)
//       const response = await axios.post(`/*추후 추가 예정*/`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
//       console.log('이미지 검색 결과:', response.data);
//     } catch (error: any) {
//       console.error('이미지 검색 중 오류 발생:', error);
//       alert(error.response?.data?.message || '이미지 검색 중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <div className="image-search-container">
//       <h3>이미지로 검색하기</h3>
//       <div 
//         className="image-upload-box"
//         role="button"
//         tabIndex={0}
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

// // 접근성 도구 컴포넌트
// interface AccessibilityToolsProps {
//   onTTSClick: () => void;
//   showBrailleOptions: boolean;
//   onBrailleOptionsClick: () => void;
//   onBrailleOptionSelect: (option: string) => void;
// }

// const AccessibilityTools = ({
//   onTTSClick,
//   showBrailleOptions,
//   onBrailleOptionsClick,
//   onBrailleOptionSelect
// }: AccessibilityToolsProps) => (
//   <div className="accessibility-icons" role="toolbar" aria-label="접근성 도구">
//     <VolumeUpIcon 
//       className="icon" 
//       onClick={onTTSClick}
//       style={{ cursor: 'pointer' }}
//       role="button"
//       aria-label="텍스트 음성 변환"
//     />
//     <SignLanguageIcon 
//       className="icon"
//       role="button"
//       aria-label="수어 번역"
//     />
//     <div className="braille-dropdown">
//       <FaBraille 
//         className="icon" 
//         onClick={onBrailleOptionsClick}
//         role="button"
//         aria-expanded={showBrailleOptions}
//         aria-haspopup="true"
//         aria-label="점자 변환 옵션"
//       />
//       {showBrailleOptions && (
//         <div className="braille-options" role="menu">
//           <button 
//             onClick={() => onBrailleOptionSelect('convert')}
//             role="menuitem"
//           >
//             점자로 변환
//           </button>
//           <button 
//             onClick={() => onBrailleOptionSelect('revert')}
//             role="menuitem"
//           >
//             점자 역변환
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
// );

// // DrugInfo 컴포넌트 수정
// const DrugInfo = () => {
//   const [drugData, setDrugData] = useState<DrugData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDrugDetail = async () => {
//       try {
//         const drugId = new URLSearchParams(window.location.search).get('id');
//         if (!drugId) {
//           setError('의약품 ID가 없습니다.');
//           return;
//         }

//         //의약품 상세 정보 요청(테스트 전)
//         const response = await axios.get(`/*추후 추가 예정*/`,
//           {
//             headers: {
//               'Authorization': `Bearer ${localStorage.getItem('token')}`
//             }
//           }
//         );
//         setDrugData(response.data);
//       } catch (error: any) {
//         console.error('의약품 정보 조회 중 오류 발생:', error);
//         setError(error.response?.data?.message || '의약품 정보를 불러오는 중 오류가 발생했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDrugDetail();
//   }, []);

//   if (loading) return <div>로딩 중...</div>;
//   if (error) return <div>에러: {error}</div>;
//   if (!drugData) return <div>데이터가 없습니다.</div>;

//   return (
//     <div className="result-item" role="article">
//       <h2>의약품명: {drugData.name}</h2>
//       <div className="result-details">
//         <p><strong>성분:</strong> {drugData.ingredient}</p>
//         <p><strong>효능/효과:</strong> {drugData.effects}</p>
//         <p><strong>용법/용량:</strong></p>
//         <ul role="list">
//           {drugData.dosage.map((item, index) => (
//             <li key={index} role="listitem">{item}</li>
//           ))}
//         </ul>
//         <p><strong>주의사항:</strong></p>
//         <ul role="list">
//           {drugData.precautions.map((item, index) => (
//             <li key={index} role="listitem">{item}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// function DrugDetail() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showBrailleOptions, setShowBrailleOptions] = useState(false);
//   const [drugData, setDrugData] = useState<DrugData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsLoggedIn(false);
//     alert('로그아웃 되었습니다.');
//   };

//   const handleZoom = (zoomType: string) => {
//     const currentZoom = document.body.style.zoom ? parseFloat(document.body.style.zoom) : 1;
//     if (zoomType === 'in') document.body.style.zoom = (currentZoom + 0.1).toString();
//     if (zoomType === 'out') document.body.style.zoom = (currentZoom - 0.1).toString();
//   };

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleBrailleOptionSelect = (option: string) => {
//     if (option === 'convert') {
//       handleBrailleClick();
//     } else if (option === 'revert') {
//       handleBrailleRevert();
//     }
//     setShowBrailleOptions(false);
//   };

//   const handleTTSClick = () => {
//     const container = document.querySelector('.search-results');
//     if (container instanceof HTMLElement) {
//       speakPageContent(container);
//     }
//   };

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // 검색 결과 페이지로 이동
//     navigate('/drug-search-result');
//   };

//   return (
//     <Layout>
//       <section className="search-container" role="search">
//         <h2>의약품 정보 검색하기</h2>
//         <SearchForm onSubmit={handleSearch} />
//         <ImageUpload />
//       </section>

//       <section className="search-results" role="region" aria-label="검색 결과">
//         <div className="result-header">
//           <h2>검색 결과</h2>
//           <AccessibilityTools 
//             onTTSClick={handleTTSClick}
//             showBrailleOptions={showBrailleOptions}
//             onBrailleOptionsClick={() => setShowBrailleOptions(!showBrailleOptions)}
//             onBrailleOptionSelect={handleBrailleOptionSelect}
//           />
//         </div>
//         <div className="results-container">
//           <DrugInfo />
//         </div>
//       </section>

//       <AccessibilityModal 
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </Layout>
//   );
// }

// export default DrugDetail;
