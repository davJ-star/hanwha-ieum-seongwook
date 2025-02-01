import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/DiseaseDetail.css';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle, FaBraille } from 'react-icons/fa'; // 점자 해설
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import VolumeUpIcon from '@mui/icons-material/VolumeUp'; //음성 해설
import SignLanguageIcon from '@mui/icons-material/SignLanguage'; // 수어 해설
import { speakPageContent } from '../utils/accessibilityHandleTTS';
import axios from 'axios';

// 인터페이스 추가
interface DiseaseDetailData {
  id: number;
  name: string;
  description: string;
  symptoms: string;
  treatments: string[];
  causes: string;
  prevention: string;
}

// 검색 폼 컴포넌트
interface SearchFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm = ({ onSubmit }: SearchFormProps) => {
  const [searchType, setSearchType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || !searchType) {
      alert('검색 조건과 검색어를 모두 입력해주세요.');
      return;
    }

    try {
      //검색 요청(테스트 전)
        const response = await axios.get(`/api/health/search`, {
          params: {
          type: searchType,
          keyword: searchTerm
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      onSubmit(e);
      // 검색 결과 처리 로직 추가 필요
    } catch (error: any) {
      console.error('검색 중 오류 발생:', error);
      alert(error.response?.data?.message || '검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <form role="search" aria-labelledby="search-title" onSubmit={handleSubmit}>
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
      <button type="submit" style={{ color: '#000000' }} aria-label="검색">검색</button>
    </form>
  );
};

// 이미지 업로드 컴포넌트
const ImageUpload = () => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      //이미지 검색 요청(테스트 전)
      const response = await axios.post(`/*추후 추가 예정*/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      // 이미지 검색 결과 처리 로직 추가 필요
      console.log('이미지 검색 결과:', response.data);
    } catch (error: any) {
      console.error('이미지 검색 중 오류 발생:', error);
      alert(error.response?.data?.message || '이미지 검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="image-search-container">
      <h3 id="image-search-title">이미지로 검색하기</h3>
      <div className="image-upload-box" 
           role="button" 
           tabIndex={0} 
           aria-labelledby="image-search-title">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          aria-label="이미지 파일 선택"
        />
        <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
      </div>
    </div>
  );
};

// 접근성 도구 컴포넌트
interface AccessibilityToolsProps {
  onTTSClick: () => void;
  onBrailleClick: () => void;
  showBrailleOptions: boolean;
  onBrailleOptionsClick: () => void;
  onBrailleOptionSelect: (option: string) => void;
}

const AccessibilityTools = ({
  onTTSClick,
  onBrailleClick,
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
      tabIndex={0}
    />
    <SignLanguageIcon 
      className="icon" 
      role="button"
      aria-label="수어 번역"
      tabIndex={0}
    />
    <div className="braille-dropdown">
      <FaBraille 
        className="icon" 
        onClick={onBrailleOptionsClick}
        role="button"
        aria-expanded={showBrailleOptions}
        aria-haspopup="true"
        aria-label="점자 변환 옵션"
        tabIndex={0}
      />
      {showBrailleOptions && (
        <div className="braille-options" role="menu" aria-label="점자 변환 메뉴">
          <button onClick={() => onBrailleOptionSelect('convert')} role="menuitem">
            점자로 변환
          </button>
          <button onClick={() => onBrailleOptionSelect('revert')} role="menuitem">
            점자 역변환
          </button>
        </div>
      )}
    </div>
  </div>
);

// 질병 상세 정보 컴포넌트
const DiseaseInfo = () => {
  const [diseaseData, setDiseaseData] = useState<DiseaseDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiseaseDetail = async () => {
      try {
        const diseaseId = new URLSearchParams(window.location.search).get('id');
        if (!diseaseId) {
          setError('질병 ID가 없습니다.');
          return;
        }

        //질병 상세 정보 요청(테스트 전)
        const response = await axios.get(`/*추후 추가 예정*/`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setDiseaseData(response.data);
      } catch (error: any) {
        console.error('질병 정보 조회 중 오류 발생:', error);
        setError(error.response?.data?.message || '질병 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiseaseDetail();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!diseaseData) return <div>데이터가 없습니다.</div>;

  return (
    <div className="result-item" role="article" aria-label="질병 상세 정보">
      <h2>질병명: {diseaseData.name}</h2>
      <div className="result-details">
        <p><strong>뜻과 이유:</strong> {diseaseData.description}</p>
        <p><strong>대표증상:</strong> {diseaseData.symptoms}</p>
        <p><strong>치료방법:</strong></p>
        <ul role="list">
          {diseaseData.treatments.map((treatment, index) => (
            <li key={index} role="listitem">{treatment}</li>
          ))}
        </ul>
        <p><strong>원인:</strong> {diseaseData.causes}</p>
        <p><strong>예방법:</strong> {diseaseData.prevention}</p>
      </div>
    </div>
  );
};

function DiseaseDetail() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBrailleOptions, setShowBrailleOptions] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.');
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // 검색 결과 페이지로 이동
    navigate('/disease-search-result');
  };

  return (
    <Layout>
      <section className="search-container" role="search" aria-label="질병 검색">
        <h2 id="search-title">질병 정보 검색하기</h2>
        <SearchForm onSubmit={handleSearch} />
        <ImageUpload />
      </section>

      <section className="search-results" role="region" aria-label="검색 결과">
        <div className="result-header">
          <h2>검색 결과</h2>
          <AccessibilityTools 
            onTTSClick={handleTTSClick}
            onBrailleClick={() => {}}
            showBrailleOptions={showBrailleOptions}
            onBrailleOptionsClick={() => setShowBrailleOptions(!showBrailleOptions)}
            onBrailleOptionSelect={handleBrailleOptionSelect}
          />
        </div>
        <article className="results-container">
          <DiseaseInfo />
        </article>
      </section>

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}

export default DiseaseDetail;
