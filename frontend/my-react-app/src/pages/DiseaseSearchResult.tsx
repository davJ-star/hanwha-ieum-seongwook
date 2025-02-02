import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/DiseaseSearchResult.css';
import Layout from '../components/Layout/Layout';
import AccessibilityModal from '../components/AccessibilityModal';
import SearchForm from '../components/common/SearchForm';
import ImageSearch from '../components/common/ImageSearch';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import { FaBraille } from 'react-icons/fa';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
import { speakPageContent } from '../utils/accessibilityHandleTTS';

interface SearchResult {
  id: number;
  name?: string;
  type: 'medicine' | 'disease';
  description?: string;
  details?: {
    symptoms?: string;
    treatments?: string;
    causes?: string;
    prevention?: string;
  };
  itemName?: string;
  efcyQesitm?: string;
  entpName?: string;
}

const SearchResultItem = ({ data }: { data: SearchResult }) => {
  // 질병 검색 결과는 Home에서 전달받은 데이터 형식에 따라 처리:
  const name = data.itemName || data.name || '이름 없음';
  const symptoms = data.details?.symptoms || 'N/A';
  // 설명은 details.description이 없으면 efcyQesitm을 fallback
  const description = data.description || data.efcyQesitm || '정보 없음';
  const treatments = data.details?.treatments || 'N/A';
  const prevention = data.details?.prevention || 'N/A';

  return (
    <div className="result-item" role="article">
      <h3>질병명: {name}</h3>
      <div className="result-details">
        <p><strong>증상:</strong> {symptoms}</p>
        <p><strong>설명:</strong> {description}</p>
        <p><strong>치료방법:</strong> {treatments}</p>
        <p><strong>예방법:</strong> {prevention}</p>
      </div>
    </div>
  );
};

function DiseaseSearchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialResults: SearchResult[] = location.state?.results || [];
  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
  const [totalPages, setTotalPages] = useState(initialResults.length > 0 ? 1 : 0);
  const [currentPage, setCurrentPage] = useState(initialResults.length > 0 ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const resultsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBrailleOptions, setShowBrailleOptions] = useState(false);

  useEffect(() => {
    if (location.state?.results) {
      setSearchResults(location.state.results);
      setTotalPages(1);
      setCurrentPage(1);
    }
  }, [location.state]);

  const handleSearch = async (e: React.FormEvent, searchType: string, searchTerm: string) => {
    e.preventDefault();
    if (!searchType || !searchTerm) {
      alert('검색 조건과 검색어를 모두 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`/api/health/search`, {
        params: {
          type: searchType,
          query: searchTerm,
          page: 1,
          limit: resultsPerPage
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data && response.data.results) {
        setSearchResults(response.data.results);
        setTotalPages(Math.ceil(response.data.total / resultsPerPage));
        setCurrentPage(1);
      }
    } catch (error: any) {
      handleSearchError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchError = (error: any) => {
    console.error('검색 중 오류 발생:', error);
    if (error.response?.status === 401) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    } else {
      alert(error.response?.data?.message || '검색 중 오류가 발생했습니다.');
    }
  };

  const handleImageUpload = (file: File) => {
    console.log('업로드된 파일:', file);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBrailleOptionSelect = (option: string) => {
    if (option === 'convert') {
      handleBrailleClick();
    } else if (option === 'revert') {
      handleBrailleRevert();
    }
    setShowBrailleOptions(false);
  };

  const handleTTSClick = () => {
    const container = document.querySelector('.search-results');
    if (container instanceof HTMLElement) {
      speakPageContent(container);
    }
  };

  return (
    <Layout>
      <div className="search-container">
        <h2>질병 정보 검색하기</h2>
        <SearchForm onSubmit={handleSearch} />
        <ImageSearch onUpload={handleImageUpload} />
      </div>
      <div className="search-results">
        <div className="result-header">
          <h2>검색 결과</h2>
          <div className="accessibility-icons" role="toolbar" aria-label="접근성 도구">
            <VolumeUpIcon 
              className="icon" 
              onClick={handleTTSClick}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label="텍스트 음성 변환"
            />
            <SignLanguageIcon 
              className="icon"
              role="button"
              aria-label="수어 번역"
            />
            <div className="braille-dropdown">
              <FaBraille 
                className="icon" 
                onClick={() => setShowBrailleOptions(!showBrailleOptions)}
                role="button"
                aria-expanded={showBrailleOptions}
                aria-haspopup="true"
                aria-label="점자 변환 옵션"
              />
              {showBrailleOptions && (
                <div className="braille-options" role="menu">
                  <button onClick={() => handleBrailleOptionSelect('convert')} role="menuitem">
                    점자로 변환
                  </button>
                  <button onClick={() => handleBrailleOptionSelect('revert')} role="menuitem">
                    점자 역변환
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {loading ? (
          <div>검색 결과를 불러오는 중...</div>
        ) : (
          <div className="results-container">
            {searchResults.map((result: SearchResult) => (
              <SearchResultItem key={result.id} data={result} />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="pagination" role="navigation" aria-label="페이지 네비게이션">
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>이전</button>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => Math.abs(page - currentPage) <= 2)
              .map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? 'active' : ''}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              ))
            }
            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)}>다음</button>
            )}
          </div>
        )}
      </div>
      <AccessibilityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
}

export default DiseaseSearchResult;



// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/pages/DrugSearchResult.css';
// import Layout from '../components/Layout/Layout';
// import AccessibilityModal from '../components/AccessibilityModal';
// import SearchForm from '../components/common/SearchForm';
// import ImageSearch from '../components/common/ImageSearch';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import SignLanguageIcon from '@mui/icons-material/SignLanguage';
// import { FaBraille } from 'react-icons/fa';
// import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
// import { speakPageContent } from '../utils/accessibilityHandleTTS';

// interface SearchResult {
//   id: number;
//   name: string;
//   type: 'medicine' | 'disease';
//   description: string;
//   details: {
//     ingredients?: string;
//     effects?: string;
//     dosage?: string;
//     cautions?: string;
//     symptoms?: string;
//     treatments?: string;
//   };
// }

// const DrugSearchResultItem = ({ data }: { data: SearchResult }) => (
//   <div className="result-item" role="article">
//     <h3>{data.name}</h3>
//     <div className="result-details">
//       <p><strong>성분:</strong> {data.details.ingredients || 'N/A'}</p>
//       <p><strong>효능/효과:</strong> {data.details.effects || 'N/A'}</p>
//       <p><strong>용법/용량:</strong> {data.details.dosage || 'N/A'}</p>
//       <p><strong>주의사항:</strong> {data.details.cautions || 'N/A'}</p>
//     </div>
//   </div>
// );

// function DrugSearchResult() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   // Home에서 전달한 검색 결과(state.results)를 초기값으로 사용
//   const initialResults: SearchResult[] = location.state?.results || [];
//   const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
//   // 만약 Home에서 전달받은 결과가 있다면 페이지네이션은 생략(예: 1페이지)  
//   const [totalPages, setTotalPages] = useState(initialResults.length > 0 ? 1 : 0);
//   const [currentPage, setCurrentPage] = useState(initialResults.length > 0 ? 1 : 0);
//   const [loading, setLoading] = useState(false);
//   const resultsPerPage = 10;
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showBrailleOptions, setShowBrailleOptions] = useState(false);

//   // 만약 Home에서 전달한 결과가 변경되면 업데이트
//   useEffect(() => {
//     if (location.state?.results) {
//       setSearchResults(location.state.results);
//       setTotalPages(1);
//       setCurrentPage(1);
//     }
//   }, [location.state]);

//   const handleSearch = async (e: React.FormEvent, searchType: string, searchTerm: string) => {
//     e.preventDefault();
//     if (!searchType || !searchTerm) {
//       alert('검색 조건과 검색어를 모두 입력해주세요.');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.get(`/search/{keyword}`, {
//         params: {
//           type: searchType,
//           query: searchTerm,
//           page: 1,
//           limit: resultsPerPage
//         },
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       if (response.data && response.data.results) {
//         setSearchResults(response.data.results);
//         setTotalPages(Math.ceil(response.data.total / resultsPerPage));
//         setCurrentPage(1);
//       }
//     } catch (error: any) {
//       handleSearchError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchError = (error: any) => {
//     console.error('검색 중 오류 발생:', error);
//     if (error.response?.status === 401) {
//       alert('로그인이 필요한 서비스입니다.');
//       navigate('/login');
//     } else {
//       alert(error.response?.data?.message || '검색 중 오류가 발생했습니다.');
//     }
//   };

//   const handleImageUpload = async (file: File) => {
//     const formData = new FormData();
//     formData.append('image', file);
//     try {
//       setLoading(true);
//       const response = await axios.post(`/api/health/image-search`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       if (response.data && response.data.results) {
//         setSearchResults(response.data.results);
//         setTotalPages(Math.ceil(response.data.total / resultsPerPage));
//         setCurrentPage(1);
//       }
//     } catch (error: any) {
//       handleSearchError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = async (page: number) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/search/{id}/info`, {
//         params: { page, limit: resultsPerPage },
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       if (response.data && response.data.results) {
//         setSearchResults(response.data.results);
//         setCurrentPage(page);
//       }
//     } catch (error: any) {
//       handleSearchError(error);
//     } finally {
//       setLoading(false);
//     }
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

//   return (
//     <Layout>
//       <div className="search-container">
//         <h2>의약품 정보 검색하기</h2>
//         <SearchForm onSubmit={handleSearch} />
//         <ImageSearch onUpload={handleImageUpload} />
//       </div>
//       <div className="search-results">
//         <div className="result-header">
//           <h2>검색 결과</h2>
//           <div className="accessibility-icons" role="toolbar" aria-label="접근성 도구">
//             <VolumeUpIcon 
//               className="icon" 
//               onClick={handleTTSClick}
//               style={{ cursor: 'pointer' }}
//               role="button"
//               aria-label="텍스트 음성 변환"
//             />
//             <SignLanguageIcon 
//               className="icon"
//               role="button"
//               aria-label="수어 번역"
//             />
//             <div className="braille-dropdown">
//               <FaBraille 
//                 className="icon" 
//                 onClick={() => setShowBrailleOptions(!showBrailleOptions)}
//                 role="button"
//                 aria-expanded={showBrailleOptions}
//                 aria-haspopup="true"
//                 aria-label="점자 변환 옵션"
//               />
//               {showBrailleOptions && (
//                 <div className="braille-options" role="menu">
//                   <button onClick={() => handleBrailleOptionSelect('convert')} role="menuitem">
//                     점자로 변환
//                   </button>
//                   <button onClick={() => handleBrailleOptionSelect('revert')} role="menuitem">
//                     점자 역변환
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {loading ? (
//           <div>검색 결과를 불러오는 중...</div>
//         ) : (
//           <div className="results-container">
//             {searchResults.map((result: SearchResult) => (
//               <DrugSearchResultItem key={result.id} data={result} />
//             ))}
//           </div>
//         )}
//         {totalPages > 1 && (
//           <div className="pagination" role="navigation" aria-label="페이지 네비게이션">
//             {currentPage > 1 && (
//               <button onClick={() => handlePageChange(currentPage - 1)}>이전</button>
//             )}
//             {Array.from({ length: totalPages }, (_, i) => i + 1)
//               .filter(page => Math.abs(page - currentPage) <= 2)
//               .map(page => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={page === currentPage ? 'active' : ''}
//                   aria-current={page === currentPage ? 'page' : undefined}
//                 >
//                   {page}
//                 </button>
//               ))
//             }
//             {currentPage < totalPages && (
//               <button onClick={() => handlePageChange(currentPage + 1)}>다음</button>
//             )}
//           </div>
//         )}
//       </div>
//       <AccessibilityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </Layout>
//   );
// }

// export default DrugSearchResult;



// // DiseaseSearchResult.tsx
// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import Layout from '../components/Layout/Layout';
// import '../styles/pages/DiseaseSearchResult.css';

// interface DiseaseResult {
//   id: number;
//   itemName: string;
//   efcyQesitm: string;
//   entpName: string;
// }

// const DiseaseSearchResult: React.FC = () => {
//   const location = useLocation();
//   const results: DiseaseResult[] = location.state?.results || [];

//   return (
//     <Layout>
//       <div className="search-results-container">
//         <h2>질병 검색 결과</h2>
//         {results.length === 0 ? (
//           <p>검색 결과가 없습니다.</p>
//         ) : (
//           <ul className="disease-results-list">
//             {results.map((disease) => (
//               <li key={disease.id} className="disease-result-item">
//                 <h3>{disease.itemName}</h3>
//                 <p>{disease.efcyQesitm}</p>
//                 <p>{disease.entpName}</p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default DiseaseSearchResult;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/pages/DiseaseSearchResult.css';
// import Layout from '../components/Layout/Layout';
// import AccessibilityModal from '../components/AccessibilityModal';
// import SearchForm from '../components/common/SearchForm';
// import ImageSearch from '../components/common/ImageSearch';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import SignLanguageIcon from '@mui/icons-material/SignLanguage';
// import { FaBraille } from 'react-icons/fa';
// import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
// import { speakPageContent } from '../utils/accessibilityHandleTTS';

// interface SearchResult {
//   id: number;
//   name: string;
//   type: 'medicine' | 'disease';
//   description: string;
//   details: {
//     symptoms?: string;
//     treatments?: string;
//     causes?: string;
//     prevention?: string;
//   };
// }

// const SearchResultItem = ({ data }: { data: SearchResult }) => (
//   <div className="result-item" role="article">
//     <h3>질병명: {data.name}</h3>
//     <div className="result-details">
//       <p><strong>증상:</strong> {data.details.symptoms || 'N/A'}</p>
//       <p><strong>설명:</strong> {data.description || 'N/A'}</p>
//       <p><strong>치료방법:</strong> {data.details.treatments || 'N/A'}</p>
//       <p><strong>예방법:</strong> {data.details.prevention || 'N/A'}</p>
//     </div>
//   </div>
// );

// function DiseaseSearchResult() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showBrailleOptions, setShowBrailleOptions] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const resultsPerPage = 10;

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
//   }, []);

//   const handleSearch = async (e: React.FormEvent, searchType: string, searchTerm: string) => {
//     e.preventDefault();
//     if (!searchType || !searchTerm) {
//       alert('검색 조건과 검색어를 모두 입력해주세요.');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.get(`/api/health/search`, {
//         params: {
//           type: searchType,
//           query: searchTerm,
//           page: 1,
//           limit: resultsPerPage
//         },
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       if (response.data && response.data.results) {
//         setSearchResults(response.data.results);
//         setTotalPages(Math.ceil(response.data.total / resultsPerPage));
//         setCurrentPage(1);
//       }
//     } catch (error) {
//       handleSearchError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchError = (error) => {
//     console.error('검색 중 오류 발생:', error);
//     if (error.response?.status === 401) {
//       alert('로그인이 필요한 서비스입니다.');
//       navigate('/login');
//     } else {
//       alert(error.response?.data?.message || '검색 중 오류가 발생했습니다.');
//     }
//   };

//   const handleImageUpload = (file: File) => {
//     // 이미지 업로드 기능 구현 (필요 시)
//     console.log('업로드된 파일:', file);
//   };

//   const handlePageChange = (page: number) => {
//     // 페이지네이션 기능 구현 (필요 시)
//     setCurrentPage(page);
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

//   return (
//     <Layout>
//       <div className="search-container">
//         <h2>질병 정보 검색하기</h2>
//         <SearchForm onSubmit={handleSearch} />
//         <ImageSearch onUpload={handleImageUpload} />
//       </div>
//       <div className="search-results">
//         <div className="result-header">
//           <h2>검색 결과</h2>
//           <div className="accessibility-icons" role="toolbar" aria-label="접근성 도구">
//             <VolumeUpIcon 
//               className="icon" 
//               onClick={handleTTSClick}
//               style={{ cursor: 'pointer' }}
//               role="button"
//               aria-label="텍스트 음성 변환"
//             />
//             <SignLanguageIcon 
//               className="icon"
//               role="button"
//               aria-label="수어 번역"
//             />
//             <div className="braille-dropdown">
//               <FaBraille 
//                 className="icon" 
//                 onClick={() => setShowBrailleOptions(!showBrailleOptions)}
//                 role="button"
//                 aria-expanded={showBrailleOptions}
//                 aria-haspopup="true"
//                 aria-label="점자 변환 옵션"
//               />
//               {showBrailleOptions && (
//                 <div className="braille-options" role="menu">
//                   <button onClick={() => handleBrailleOptionSelect('convert')} role="menuitem">
//                     점자로 변환
//                   </button>
//                   <button onClick={() => handleBrailleOptionSelect('revert')} role="menuitem">
//                     점자 역변환
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {loading ? (
//           <div>검색 결과를 불러오는 중...</div>
//         ) : (
//           <div className="results-container">
//             {searchResults.map((result: SearchResult) => (
//               <SearchResultItem key={result.id} data={result} />
//             ))}
//           </div>
//         )}
//         {totalPages > 1 && (
//           <div className="pagination" role="navigation" aria-label="페이지 네비게이션">
//             {currentPage > 1 && (
//               <button onClick={() => handlePageChange(currentPage - 1)}>이전</button>
//             )}
//             {Array.from({ length: totalPages }, (_, i) => i + 1)
//               .filter(page => Math.abs(page - currentPage) <= 2)
//               .map(page => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={page === currentPage ? 'active' : ''}
//                   aria-current={page === currentPage ? 'page' : undefined}
//                 >
//                   {page}
//                 </button>
//               ))
//             }
//             {currentPage < totalPages && (
//               <button onClick={() => handlePageChange(currentPage + 1)}>다음</button>
//             )}
//           </div>
//         )}
//       </div>
//       <AccessibilityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </Layout>
//   );
// }

// export default DiseaseSearchResult;
