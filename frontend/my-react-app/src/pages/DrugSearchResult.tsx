import React, { useEffect, useState, FormEvent, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import '../styles/pages/DrugSearchResult.css';
import Layout from '../components/Layout/Layout';
import AccessibilityModal from '../components/AccessibilityModal';
import SearchForm from '../components/common/SearchForm';
import ImageSearch from '../components/common/ImageSearch';

interface SearchResult {
  id: number;
  itemName?: string;
  name?: string;
  entpName?: string;
  efcyQesitm?: string;
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
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  
  const initialResults: SearchResult[] = (location.state as { results?: SearchResult[] })?.results || [];
  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (searchResults.length > 0) {
      setMessage('검색 결과를 받아왔습니다.');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      setMessage('');
    }
  }, [searchResults]);

  useEffect(() => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleSearch = async (e: FormEvent, _searchType: string, searchTerm: string) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/search/${searchTerm.trim()}`, {
        params: { type: 'medicine' },
      });

      if (Array.isArray(response.data)) {
        setSearchResults(response.data);
      } else if (Array.isArray(response.data.results)) {
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      const err = error as AxiosError;
      alert(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="search-container" ref={formRef}>
        <h2>의약품 정보 검색하기</h2>
        <SearchForm onSubmit={handleSearch} defaultSearchType="medicine" disableSearchType={true} />
        {message && <p ref={messageRef} style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>}
        <ImageSearch onUpload={() => {}} />
      </div>

      <div className="search-results">
        <div className="result-header">
          <h2>검색 결과</h2>
        </div>
        {loading ? (
          <div>검색 중...</div>
        ) : searchResults.length === 0 ? (
          <center>
            <hr />
            <h3>검색 결과가 없거나 검색하지 않았습니다.</h3>
          </center>
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


// import React, { useEffect, useState, FormEvent, useRef } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';
// import '../styles/pages/DrugSearchResult.css';
// import Layout from '../components/Layout/Layout';
// import AccessibilityModal from '../components/AccessibilityModal';
// import SearchForm from '../components/common/SearchForm';
// import ImageSearch from '../components/common/ImageSearch';

// interface SearchResult {
//   id: number;
//   itemName?: string;
//   name?: string;
//   entpName?: string;
//   efcyQesitm?: string;
// }

// const DrugSearchResultItem = ({ data }: { data: SearchResult }) => {
//   const name = data.itemName || data.name || '이름 없음';
//   return (
//     <div className="result-item" role="article">
//       <Link to={`/DrugDetail?id=${data.id}`} role="link" aria-label={`${name} 상세 정보 보기`}>
//         <h3>{name}</h3>
//         {data.efcyQesitm && <p>효능/효과: {data.efcyQesitm}</p>}
//         {data.entpName && <p>제조사: {data.entpName}</p>}
//       </Link>
//     </div>
//   );
// };

// function DrugSearchResult() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const messageRef = useRef<HTMLParagraphElement | null>(null);
  
//   const initialResults: SearchResult[] = (location.state as { results?: SearchResult[] })?.results || [];
//   const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string>('');

//   useEffect(() => {
//     if (searchResults.length > 0) {
//       setMessage('검색 결과를 받아왔습니다.');
//       setTimeout(() => {
//         messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }, 100);
//     } else {
//       setMessage('');
//     }
//   }, [searchResults]);

//   const handleSearch = async (e: FormEvent, _searchType: string, searchTerm: string) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) {
//       alert('검색어를 입력하세요.');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.get(`http://localhost:8080/search/${searchTerm.trim()}`, {
//         params: { type: 'medicine' },
//       });

//       if (Array.isArray(response.data)) {
//         setSearchResults(response.data);
//       } else if (Array.isArray(response.data.results)) {
//         setSearchResults(response.data.results);
//       } else {
//         setSearchResults([]);
//       }
//     } catch (error) {
//       const err = error as AxiosError;
//       alert(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="search-container">
//         <h2>의약품 정보 검색하기</h2>
//         <SearchForm onSubmit={handleSearch} defaultSearchType="medicine" disableSearchType={true} />
//         {message && <p ref={messageRef} style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>}
//         <ImageSearch onUpload={() => {}} />
//       </div>

//       <div className="search-results">
//         <div className="result-header">
//           <h2>검색 결과</h2>
//         </div>
//         {loading ? (
//           <div>검색 중...</div>
//         ) : searchResults.length === 0 ? (
//           <center>
//             <hr />
//             <h3>검색 결과가 없거나 검색하지 않았습니다.</h3>
//           </center>
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

// import React, { useEffect, useState, FormEvent, useRef } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';
// import '../styles/pages/DrugSearchResult.css';
// import Layout from '../components/Layout/Layout';
// import AccessibilityModal from '../components/AccessibilityModal';
// import SearchForm from '../components/common/SearchForm';
// import ImageSearch from '../components/common/ImageSearch';

// interface SearchResult {
//   id: number;
//   itemName?: string;
//   name?: string;
//   entpName?: string;
//   efcyQesitm?: string;
// }

// const DrugSearchResultItem = ({ data }: { data: SearchResult }) => {
//   const name = data.itemName || data.name || '이름 없음';
//   return (
//     <div className="result-item" role="article">
//       <Link to={`/DrugDetail?id=${data.id}`} role="link" aria-label={`${name} 상세 정보 보기`}>
//         <h3>{name}</h3>
//         {data.efcyQesitm && <p>효능/효과: {data.efcyQesitm}</p>}
//         {data.entpName && <p>제조사: {data.entpName}</p>}
//       </Link>
//     </div>
//   );
// };

// function DrugSearchResult() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const messageRef = useRef<HTMLParagraphElement | null>(null);
  
//   const initialResults: SearchResult[] = (location.state as { results?: SearchResult[] })?.results || [];
//   const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string>('');

//   useEffect(() => {
//     if (searchResults.length > 0) {
//       setMessage('검색 결과를 받아왔습니다.');
//       messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     } else {
//       setMessage('');
//     }
//   }, [searchResults]);

//   const handleSearch = async (e: FormEvent, _searchType: string, searchTerm: string) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) {
//       alert('검색어를 입력하세요.');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.get(`http://localhost:8080/search/${searchTerm.trim()}`, {
//         params: { type: 'medicine' },
//       });

//       if (Array.isArray(response.data)) {
//         setSearchResults(response.data);
//       } else if (Array.isArray(response.data.results)) {
//         setSearchResults(response.data.results);
//       } else {
//         setSearchResults([]);
//       }
//     } catch (error) {
//       const err = error as AxiosError;
//       alert(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="search-container">
//         <h2>의약품 정보 검색하기</h2>
//         <SearchForm onSubmit={handleSearch} defaultSearchType="medicine" disableSearchType={true} />
//         {message && <p ref={messageRef} style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>}
//         <ImageSearch onUpload={() => {}} />
//       </div>

//       <div className="search-results">
//         <div className="result-header">
//           <h2>검색 결과</h2>
//         </div>
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

// import React, { useEffect, useState, FormEvent, useRef } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';
// import '../styles/pages/DrugSearchResult.css';
// import Layout from '../components/Layout/Layout';
// import AccessibilityModal from '../components/AccessibilityModal';
// import SearchForm from '../components/common/SearchForm';
// import ImageSearch from '../components/common/ImageSearch';

// interface SearchResult {
//   id: number;
//   itemName?: string;
//   name?: string;
//   entpName?: string;
//   efcyQesitm?: string;
// }

// const DrugSearchResultItem = ({ data }: { data: SearchResult }) => {
//   const name = data.itemName || data.name || '이름 없음';
//   return (
//     <div className="result-item" role="article">
//       <Link to={`/DrugDetail?id=${data.id}`} role="link" aria-label={`${name} 상세 정보 보기`}>
//         <h3>{name}</h3>
//         {data.efcyQesitm && <p>효능/효과: {data.efcyQesitm}</p>}
//         {data.entpName && <p>제조사: {data.entpName}</p>}
//       </Link>
//     </div>
//   );
// };

// function DrugSearchResult() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const formRef = useRef<HTMLDivElement | null>(null);
  
//   const initialResults: SearchResult[] = (location.state as { results?: SearchResult[] })?.results || [];
//   const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string>('');

//   useEffect(() => {
//     if (searchResults.length > 0) {
//       setMessage('검색 결과를 받아왔습니다.');
//       formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     } else {
//       setMessage('');
//     }
//   }, [searchResults]);

//   const handleSearch = async (e: FormEvent, _searchType: string, searchTerm: string) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) {
//       alert('검색어를 입력하세요.');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.get(`http://localhost:8080/search/${searchTerm.trim()}`, {
//         params: { type: 'medicine' },
//       });

//       if (Array.isArray(response.data)) {
//         setSearchResults(response.data);
//       } else if (Array.isArray(response.data.results)) {
//         setSearchResults(response.data.results);
//       } else {
//         setSearchResults([]);
//       }
//     } catch (error) {
//       const err = error as AxiosError;
//       alert(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="search-container" ref={formRef}>
//         <h2>의약품 정보 검색하기</h2>
//         <SearchForm onSubmit={handleSearch} defaultSearchType="medicine" disableSearchType={true} />
//         {message && <p style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>}
//         <ImageSearch onUpload={() => {}} />
//       </div>

//       <div className="search-results">
//         <div className="result-header">
//           <h2>검색 결과</h2>

//         </div>
//         {loading ? (
//           <div>검색 중...</div>
//         ) : searchResults.length === 0 ? (
//           <center>
//             <hr />
//             <h3>검색 결과가 없거나 검색하지 않았습니다.</h3>
//           </center>
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