// src/pages/DrugSearchResult.tsx
import React, { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
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
}

const DrugSearchResultItem = ({ data }: { data: SearchResult }) => {
  const name = data.itemName || data.name || '이름 없음';
  return (
    <div className="result-item" role="article">
      <Link to={`/DrugDetail?id=${data.id}`} role="link" aria-label={`${name} 상세 정보 보기`}>
        <h3>{name}</h3>
        {data.efcyQesitm && <p>효능/효과: {data.efcyQesitm}</p>}
        {data.entpName && <p>제조사: {data.entpName}</p>}
      </Link>
    </div>
  );
};

function DrugSearchResult() {
  const navigate = useNavigate();
  const location = useLocation();

  // Home에서 전달한 검색 결과
  const initialResults: SearchResult[] = (location.state as { results?: SearchResult[] } | null)?.results || [];
  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Home에서 전달한 결과가 있으면 세팅
    if (location.state && (location.state as any).results) {
      setSearchResults((location.state as any).results);
    }
  }, [location.state]);

  // [DrugSearchResult]에서 검색 (searchType을 'medicine'으로 고정)
  const handleSearch = async (e: FormEvent, _searchType: string, searchTerm: string) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }

    console.log('[DrugSearchResult] 검색 요청 >>', {
      searchType: 'medicine',
      searchTerm: searchTerm.trim(),
    });

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/search/${searchTerm.trim()}`, {
        params: { type: 'medicine' },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      console.log('[DrugSearchResult] 검색 응답 <<', response.data);

      if (response.data?.length > 0) {
        // 백엔드 응답 구조가 배열이라면,
        setSearchResults(response.data);
      } else if (response.data?.results) {
        // 백엔드 응답 구조가 { results: [] } 라면,
        setSearchResults(response.data.results);
      } else {
        // 결과가 없는 경우
        setSearchResults([]);
      }
    } catch (error) {
      const err = error as AxiosError;
      console.error('[DrugSearchResult] 검색 오류:', err);
      alert(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    console.log('[DrugSearchResult] 이미지 검색 요청 >>', formData);

    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:8080/api/health/image-search`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('[DrugSearchResult] 이미지 검색 응답 <<', response.data);

      if (response.data?.results) {
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      const err = error as AxiosError;
      console.error('[DrugSearchResult] 이미지 검색 오류:', err);
      alert(err.response?.data?.message || '이미지 검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="search-container">
        <h2>의약품 정보 검색하기</h2>
        <SearchForm onSubmit={handleSearch} defaultSearchType="medicine" disableSearchType />
        <ImageSearch onUpload={handleImageUpload} />
      </div>

      <div className="search-results">
        <div className="result-header">
          <h2>검색 결과</h2>
          {/* 접근성 도구 아이콘은 생략 */}
        </div>
        {loading ? (
          <div>검색 중...</div>
        ) : searchResults.length === 0 ? (
          <div>검색 결과가 없습니다.</div>
        ) : (
          <div className="results-container">
            {searchResults.map((result) => (
              <DrugSearchResultItem key={result.id} data={result} />
            ))}
          </div>
        )}
      </div>
      <AccessibilityModal isOpen={false} onClose={() => {}} />
    </Layout>
  );
}

export default DrugSearchResult;

// import React, { useEffect, useState, FormEvent } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';
// import '../styles/pages/DrugSearchResult.css';
// import Layout from '../components/Layout/Layout';
// import AccessibilityModal from '../components/AccessibilityModal';
// import SearchForm from '../components/common/SearchForm';
// import ImageSearch from '../components/common/ImageSearch';

// interface SearchResult {
//   id: number;
//   name: string;
//   entpName?: string;
//   efcyQesitm?: string;
// }

// const DrugSearchResultItem = ({ data }: { data: SearchResult }) => (
//   <div className="result-item" role="article">
//     <Link to={`/DrugDetail?id=${data.id}`} role="link">
//       <h3>{data.name}</h3>
//       {data.efcyQesitm && <p>효과: {data.efcyQesitm}</p>}
//       {data.entpName && <p>제조사: {data.entpName}</p>}
//     </Link>
//   </div>
// );

// function DrugSearchResult() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const initialResults: SearchResult[] = (location.state as { results?: SearchResult[] })?.results || [];
//   const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (location.state?.results) {
//       setSearchResults(location.state.results);
//     }
//   }, [location.state]);

//   const handleSearch = async (e: FormEvent, _searchType: string, searchTerm: string) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) {
//       alert('검색어를 입력하세요.');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.get(`/search/${searchTerm.trim()}`, {
//         params: { type: 'medicine' },
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setSearchResults(response.data.results || []);
//     } catch (error: unknown) {
//       const err = error as AxiosError;
//       alert(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="search-container">
//         <h2>의약품 검색</h2>
//         <SearchForm onSubmit={handleSearch} defaultSearchType="medicine" disableSearchType={true} />
//         <ImageSearch onUpload={() => {}} />
//       </div>
//       <div className="search-results">
//         {loading ? (
//           <div>검색 중...</div>
//         ) : searchResults.length === 0 ? (
//           <div>검색 결과가 없습니다.</div>
//         ) : (
//           <div className="results-container">
//             {searchResults.map((result) => (
//               <DrugSearchResultItem key={result.id} data={result} />
//             ))}
//           </div>
//         )}
//       </div>
//       <AccessibilityModal isOpen={false} onClose={() => {}} />
//     </Layout>
//   );
// }

// export default DrugSearchResult;

// // src/pages/DrugSearchResult.tsx
// import React, { useEffect, useState, FormEvent } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';
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
//   name?: string;
//   itemName?: string;
//   efcyQesitm?: string;
//   entpName?: string;
//   description?: string;
//   details?: {
//     ingredients?: string;
//     effects?: string;
//     dosage?: string;
//     cautions?: string;
//   };
// }

// const DrugSearchResultItem = ({ data }: { data: SearchResult }) => {
//   const name = data.itemName || data.name || '이름 없음';
//   const effect = data.details?.effects || data.efcyQesitm || '효과 정보 없음';

//   return (
//     <div className="result-item" role="article">
//       <Link to={`/DrugDetail?id=${data.id}`} role="link" aria-label={`${name} 상세 정보 보기`}>
//         <h3>{name}</h3>
//         <div className="result-details">
//           <p>
//             <h4>효능/효과:</h4> {effect}
//           </p>
//           {data.entpName && (
//             <p>
//               <h4>제조사:</h4> {data.entpName}
//             </p>
//           )}
//         </div>
//       </Link>
//     </div>
//   );
// };

// function DrugSearchResult() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const initialResults: SearchResult[] = (location.state as { results?: SearchResult[] } | null)?.results || [];
//   const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
//   const [totalPages, setTotalPages] = useState(initialResults.length > 0 ? 1 : 0);
//   const [currentPage, setCurrentPage] = useState(initialResults.length > 0 ? 1 : 0);
//   const [loading, setLoading] = useState(false);
//   const resultsPerPage = 10;
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showBrailleOptions, setShowBrailleOptions] = useState(false);

//   useEffect(() => {
//     if (location.state && (location.state as any).results) {
//       setSearchResults((location.state as any).results);
//       setTotalPages(1);
//       setCurrentPage(1);
//     }
//   }, [location.state]);

//   // searchType은 "medicine"으로 고정
//   const handleSearch = async (e: FormEvent, _searchType: string, searchTerm: string) => {
//     e.preventDefault();
//     if (!searchTerm) {
//       alert('검색어를 입력해주세요.');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.get(`/search/{keyword}`, {
//         params: {
//           type: 'medicine',
//           query: searchTerm,
//           page: 1,
//           limit: resultsPerPage,
//         },
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       if (response.data && response.data.results) {
//         setSearchResults(response.data.results);
//         setTotalPages(Math.ceil(response.data.total / resultsPerPage));
//         setCurrentPage(1);
//       } else {
//         setSearchResults([]);
//         setTotalPages(0);
//       }
//     } catch (error: unknown) {
//       const err = error as AxiosError;
//       console.error('검색 중 오류 발생:', err);
//       if (err.response?.status === 401) {
//         alert('로그인이 필요한 서비스입니다.');
//         navigate('/login');
//       } else {
//         alert(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
//       }
//     } finally {
//       setLoading(false);
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
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       if (response.data && response.data.results) {
//         setSearchResults(response.data.results);
//         setTotalPages(Math.ceil(response.data.total / resultsPerPage));
//         setCurrentPage(1);
//       } else {
//         setSearchResults([]);
//         setTotalPages(0);
//       }
//     } catch (error: unknown) {
//       const err = error as AxiosError;
//       console.error('이미지 검색 중 오류 발생:', err);
//       alert(err.response?.data?.message || '이미지 검색 중 오류가 발생했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = async (page: number) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/search/{id}/info`, {
//         params: { page, limit: resultsPerPage },
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       if (response.data && response.data.results) {
//         setSearchResults(response.data.results);
//         setCurrentPage(page);
//       }
//     } catch (error: unknown) {
//       const err = error as AxiosError;
//       console.error('검색 중 오류 발생:', err);
//       if (err.response?.status === 401) {
//         alert('로그인이 필요한 서비스입니다.');
//         navigate('/login');
//       } else {
//         alert(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
//       }
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
//         <SearchForm
//           onSubmit={handleSearch}
//           defaultSearchType="medicine"
//           disableSearchType={true}
//         />
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
//             <SignLanguageIcon className="icon" role="button" aria-label="수어 번역" />
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
//         ) : searchResults.length === 0 ? (
//           <div>검색 결과가 없습니다.</div>
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
//               .filter((page) => Math.abs(page - currentPage) <= 2)
//               .map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={page === currentPage ? 'active' : ''}
//                   aria-current={page === currentPage ? 'page' : undefined}
//                 >
//                   {page}
//                 </button>
//               ))}
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

// // src/pages/DrugSearchResult.tsx
// import React, { useEffect, useState, FormEvent } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';
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
//   name?: string;
//   itemName?: string;
//   efcyQesitm?: string;
//   entpName?: string;
//   description?: string;
//   details?: {
//     ingredients?: string;
//     effects?: string;
//     dosage?: string;
//     cautions?: string;
//   };
// }

// const DrugSearchResultItem = ({ data }: { data: SearchResult }) => {
//   const name = data.itemName || data.name || '이름 없음';
//   const effect = data.details?.effects || data.efcyQesitm || '효과 정보 없음';

//   return (
//     <div className="result-item" role="article">
//       {/* 검색 결과 항목 클릭 시 /DrugDetail?id={data.id}로 이동 */}
//       <Link to={`/DrugDetail?id=${data.id}`} role="link" aria-label={`${name} 상세 정보 보기`}>
//         <h3>{name}</h3>
//         <div className="result-details">
//           <p>
//             <h4>효능/효과:</h4> {effect}
//           </p>
//           {data.entpName && (
//             <p>
//               <h4>제조사:</h4> {data.entpName}
//             </p>
//           )}
//         </div>
//       </Link>
//     </div>
//   );
// };

// function DrugSearchResult() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const initialResults: SearchResult[] = (location.state as { results?: SearchResult[] } | null)?.results || [];
//   const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
//   const [totalPages, setTotalPages] = useState(initialResults.length > 0 ? 1 : 0);
//   const [currentPage, setCurrentPage] = useState(initialResults.length > 0 ? 1 : 0);
//   const [loading, setLoading] = useState(false);
//   const resultsPerPage = 10;
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showBrailleOptions, setShowBrailleOptions] = useState(false);

//   useEffect(() => {
//     if (location.state && (location.state as any).results) {
//       setSearchResults((location.state as any).results);
//       setTotalPages(1);
//       setCurrentPage(1);
//     }
//   }, [location.state]);

//   // DrugSearchResult에서는 searchType을 "medicine"으로 고정합니다.
//   const handleSearch = async (e: FormEvent, _searchType: string, searchTerm: string) => {
//     e.preventDefault();
//     if (!searchTerm) {
//       alert('검색어를 입력해주세요.');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.get(`/search/{keyword}`, {
//         params: {
//           type: 'medicine',
//           query: searchTerm,
//           page: 1,
//           limit: resultsPerPage,
//         },
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       if (response.data && response.data.results) {
//         setSearchResults(response.data.results);
//         setTotalPages(Math.ceil(response.data.total / resultsPerPage));
//         setCurrentPage(1);
//       }
//     } catch (error: unknown) {
//       const err = error as AxiosError;
//       console.error('검색 중 오류 발생:', err);
//       if (err.response?.status === 401) {
//         alert('로그인이 필요한 서비스입니다.');
//         navigate('/login');
//       } else {
//         alert(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
//       }
//     } finally {
//       setLoading(false);
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
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       if (response.data && response.data.results) {
//         setSearchResults(response.data.results);
//         setTotalPages(Math.ceil(response.data.total / resultsPerPage));
//         setCurrentPage(1);
//       }
//     } catch (error: unknown) {
//       const err = error as AxiosError;
//       console.error('이미지 검색 중 오류 발생:', err);
//       alert(err.response?.data?.message || '이미지 검색 중 오류가 발생했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = async (page: number) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/search/{id}/info`, {
//         params: { page, limit: resultsPerPage },
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       if (response.data && response.data.results) {
//         setSearchResults(response.data.results);
//         setCurrentPage(page);
//       }
//     } catch (error: unknown) {
//       const err = error as AxiosError;
//       console.error('검색 중 오류 발생:', err);
//       if (err.response?.status === 401) {
//         alert('로그인이 필요한 서비스입니다.');
//         navigate('/login');
//       } else {
//         alert(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
//       }
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
//         {/* SearchForm에 defaultSearchType="medicine"과 disableSearchType=true 전달 */}
//         <SearchForm onSubmit={handleSearch} defaultSearchType="medicine" disableSearchType={true} />
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
//             <SignLanguageIcon className="icon" role="button" aria-label="수어 번역" />
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
//               .filter((page) => Math.abs(page - currentPage) <= 2)
//               .map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={page === currentPage ? 'active' : ''}
//                   aria-current={page === currentPage ? 'page' : undefined}
//                 >
//                   {page}
//                 </button>
//               ))}
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
