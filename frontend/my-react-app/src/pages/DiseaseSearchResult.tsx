// src/pages/DiseaseSearchResult.tsx
import React, { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import '../styles/pages/DiseaseSearchResult.css';
import Layout from '../components/Layout/Layout';
import AccessibilityModal from '../components/AccessibilityModal';
import SearchForm from '../components/common/SearchForm';
import ImageSearch from '../components/common/ImageSearch';

interface SearchResult {
  contentId: number;
  title: string;
  description: string;
}

const DiseaseSearchResultItem = ({ data }: { data: SearchResult }) => {
  const name = data.title || '이름 없음';

  return (
    <div className="result-item" role="article">
      <Link to={`/DiseaseDetail?id=${data.contentId}`} role="link" aria-label={`${name} 상세 정보 보기`}>
        <h3>{name}</h3>
        {data.description && <p>설명: {data.description}</p>}
      </Link>
    </div>
  );
};

function DiseaseSearchResult() {
  const navigate = useNavigate();
  const location = useLocation();

  // Home.tsx or OCR 등에서 전달한 검색 결과 (state.results)
  const initialResults: SearchResult[] = (location.state as { results?: SearchResult[] })?.results || [];
  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && (location.state as any).results) {
      setSearchResults((location.state as any).results);
    }
  }, [location.state]);

  // (추가) 만약 DiseaseSearchResult 페이지에서도 직접 검색을 가능하게 한다면:
  const handleSearch = async (e: FormEvent, _searchType: string, searchTerm: string) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }
    try {
      setLoading(true);
      console.log('[DiseaseSearchResult] 검색 요청 >>', searchTerm);

      // 백엔드 검색 API 호출
      const response = await axios.get(`http://localhost:8080/api/health/search?keyword=${searchTerm.trim()}`, {
        params: { type: 'disease' }, // 질병 고정
      });
      console.log('[DiseaseSearchResult] 검색 응답 <<', response.data);

      // 응답 구조에 따라 state 업데이트
      if (response.data) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error('[DiseaseSearchResult] 검색 오류:', err);
      alert(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      console.log('[DiseaseSearchResult] 이미지 검색 요청 >>', file);

      const response = await axios.post(`http://13.124.88.193:8080/ocr`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('[DiseaseSearchResult] 이미지 검색 응답 <<', response.data);

      // OCR 응답 구조에 따라 검색 결과 업데이트
      if (response.data.success === true && response.data.diseaseList?.length > 0) {
        setSearchResults(response.data.diseaseList);
      } else {
        setSearchResults([]);
        alert('이미지 검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('[DiseaseSearchResult] 이미지 검색 오류:', error);
      alert('이미지 검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="search-container">
        <h2>질병 정보 검색하기</h2>
        <SearchForm onSubmit={handleSearch} defaultSearchType="disease" disableSearchType={true} />
        <ImageSearch onUpload={handleImageUpload} />
      </div>

      <div className="search-results">
        <div className="result-header">
          <h2>검색 결과</h2>
        </div>

        {loading ? (
          <div>검색 중...</div>
        ) : searchResults.length === 0 ? (
          <div>검색 결과가 없습니다.</div>
        ) : (
          <ul className="results-list">
            {searchResults.map((result, index) => (
              <li key={`${result.contentId}-${index}`}>
                <DiseaseSearchResultItem data={result} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <AccessibilityModal isOpen={false} onClose={() => {}} />
    </Layout>
  );
}

export default DiseaseSearchResult;
