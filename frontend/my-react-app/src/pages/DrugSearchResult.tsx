import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/DrugSearchResult.css';
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
  itemName?: string;
  efcyQesitm?: string;
  entpName?: string;
  description?: string;
  details?: {
    ingredients?: string;
    effects?: string;
    dosage?: string;
    cautions?: string;
  };
}

const DrugSearchResultItem = ({ data }: { data: SearchResult }) => {
  // 우선 이름은 itemName이 있으면 itemName, 없으면 name 사용
  const name = data.itemName || data.name || '이름 없음';
  // 효과 정보: details가 있으면 details.effects, 없으면 efcyQesitm
  const effect = data.details?.effects || data.efcyQesitm || '효과 정보 없음';
  const ingredients = data.details?.ingredients || 'N/A';
  const dosage = data.details?.dosage || 'N/A';
  const cautions = data.details?.cautions || 'N/A';
  
  return (
    <div className="result-item" role="article">
      <h3>{name}</h3>
      <div className="result-details">
        <p><strong>효능/효과:</strong> {effect}</p>
        <p><strong>성분:</strong> {ingredients}</p>
        <p><strong>용법/용량:</strong> {dosage}</p>
        <p><strong>주의사항:</strong> {cautions}</p>
        {data.entpName && <p><strong>제조사:</strong> {data.entpName}</p>}
      </div>
    </div>
  );
};

function DrugSearchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  // Home.tsx에서 전달한 검색 결과를 초기값으로 사용
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
      const response = await axios.get(`/search/{keyword}`, {
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

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      setLoading(true);
      const response = await axios.post(`/api/health/image-search`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
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

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`/search/{id}/info`, {
        params: { page, limit: resultsPerPage },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data && response.data.results) {
        setSearchResults(response.data.results);
        setCurrentPage(page);
      }
    } catch (error: any) {
      handleSearchError(error);
    } finally {
      setLoading(false);
    }
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
        <h2>의약품 정보 검색하기</h2>
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
              <DrugSearchResultItem key={result.id} data={result} />
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

export default DrugSearchResult;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
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
//     } catch (error) {
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
//     } catch (error) {
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
// DrugSearchResult.tsx

// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import Layout from '../components/Layout/Layout';
// import '../styles/pages/DrugSearchResult.css';

// interface DrugResult {
//   id: number;
//   itemName: string;
//   efcyQesitm: string;
//   entpName: string;
// }

// const DrugSearchResult: React.FC = () => {
//   const location = useLocation();
//   const results: DrugResult[] = location.state?.results || [];

//   return (
//     <Layout>
//       <div className="search-results-container">
//         <h2>의약품 검색 결과</h2>
//         {results.length === 0 ? (
//           <p>검색 결과가 없습니다.</p>
//         ) : (
//           <ul className="drug-results-list">
//             {results.map((drug) => (
//               <li key={drug.id} className="drug-result-item">
//                 <h3>{drug.itemName}</h3>
//                 <p>{drug.efcyQesitm}</p>
//                 <p>{drug.entpName}</p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default DrugSearchResult;
