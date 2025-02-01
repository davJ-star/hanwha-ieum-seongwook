import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/DiseaseSearchResult.css';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle, FaBraille } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
import { speakPageContent } from '../utils/accessibilityHandleTTS';
import axios from 'axios';

interface SearchResult {
  id: number;
  name: string;
  type: 'medicine' | 'disease';
  description: string;
  details: {
    symptoms?: string;
    treatments?: string;
    causes?: string;
    prevention?: string;
  };
}

// 검색 폼 컴포넌트
const SearchForm = ({ onSubmit }: { onSubmit: (e: React.FormEvent, type: string, term: string) => void }) => {
  const [searchType, setSearchType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, searchType, searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} role="search">
      <select 
        name="type" 
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        aria-label="검색 조건 선택"
      >
        <option value="" disabled>검색 조건</option>
        <option value="medicine">의약품</option>
        <option value="disease">질병</option>
      </select>
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요" 
        aria-label="검색어 입력"
      />
      <button type="submit" aria-label="검색">검색</button>
    </form>
  );
};

// 이미지 업로드 컴포넌트
const ImageUpload = ({ onUpload }: { onUpload: (file: File) => void }) => (
  <div className="image-search-container">
    <h3>이미지로 검색하기</h3>
    <div 
      className="image-upload-box"
      role="button"
      tabIndex={0}
      aria-label="이미지 업로드 영역"
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onUpload(e.target.files[0]);
          }
        }}
        aria-label="이미지 파일 선택"
      />
      <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
    </div>
  </div>
);

// 접근성 도구 컴포넌트
interface AccessibilityToolsProps {
  onTTSClick: () => void;
  showBrailleOptions: boolean;
  onBrailleOptionsClick: () => void;
  onBrailleOptionSelect: (option: string) => void;
}

const AccessibilityTools = ({
  onTTSClick,
  showBrailleOptions,
  onBrailleOptionsClick,
  onBrailleOptionSelect
}: AccessibilityToolsProps) => (
  <div className="accessibility-icons" role="toolbar" aria-label="접근성 도구">
    <VolumeUpIcon 
      className="icon" 
      onClick={onTTSClick}
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
        onClick={onBrailleOptionsClick}
        role="button"
        aria-expanded={showBrailleOptions}
        aria-haspopup="true"
        aria-label="점자 변환 옵션"
      />
      {showBrailleOptions && (
        <div className="braille-options" role="menu">
          <button 
            onClick={() => onBrailleOptionSelect('convert')}
            role="menuitem"
          >
            점자로 변환
          </button>
          <button 
            onClick={() => onBrailleOptionSelect('revert')}
            role="menuitem"
          >
            점자 역변환
          </button>
        </div>
      )}
    </div>
  </div>
);

// 검색 결과 컴포넌트
const SearchResult = ({ data }: { data: SearchResult }) => (
  <div className="result-item" role="article">
    <h3>질병명: {data.name}</h3>
    <div className="result-details">
      <p><strong>증상:</strong> {data.details.symptoms || 'N/A'}</p>
      <p><strong>설명:</strong> {data.description || 'N/A'}</p>
      <p><strong>치료방법:</strong> {data.details.treatments || 'N/A'}</p>
      <p><strong>예방법:</strong> {data.details.prevention || 'N/A'}</p>
    </div>
  </div>
);

function DiseaseSearchResult() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBrailleOptions, setShowBrailleOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.');
  };

  const handleZoom = (zoomType: string) => {
    const currentZoom = document.body.style.zoom ? parseFloat(document.body.style.zoom) : 1;
    if (zoomType === 'in') document.body.style.zoom = (currentZoom + 0.1).toString();
    if (zoomType === 'out') document.body.style.zoom = (currentZoom - 0.1).toString();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleSearch = async (e: React.FormEvent, searchType: string, searchTerm: string) => {
    e.preventDefault();
    if (!searchType || !searchTerm) {
      alert('검색 조건과 검색어를 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      //검색 요청(테스트 전)
      const response = await axios.get(`/api/health/search`, {
        params: {
          type: searchType,
          query: searchTerm,
          page: 1,
          limit: resultsPerPage
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    // Implementation for handling image upload
  };

  const handlePageChange = (page: number) => {
    // Implementation for handling page change
  };

  return (
    <Layout>
      <div className="search-container">
        <h2>질병 정보 검색하기</h2>
        <SearchForm onSubmit={handleSearch} />
        <ImageUpload onUpload={handleImageUpload} />
      </div>

      <div className="search-results">
        <div className="result-header">
          <h2>검색 결과</h2>
          <AccessibilityTools 
            onTTSClick={handleTTSClick}
            showBrailleOptions={showBrailleOptions}
            onBrailleOptionsClick={() => setShowBrailleOptions(!showBrailleOptions)}
            onBrailleOptionSelect={handleBrailleOptionSelect}
          />
        </div>
        
        {loading ? (
          <div>검색 결과를 불러오는 중...</div>
        ) : (
          <div className="results-container">
            {searchResults.map((result: SearchResult) => (
              <SearchResult key={result.id} data={result} />
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

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}

export default DiseaseSearchResult;
