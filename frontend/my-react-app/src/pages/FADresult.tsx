import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/pages/FADresult.css';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle, FaBraille } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
import Layout from '../components/Layout/Layout';
import { MdCheckCircle, MdError } from "react-icons/md";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import { speakPageContent } from '../utils/accessibilityHandleTTS';
import axios from 'axios';

// 결과 데이터 타입 정의
interface HealthFoodResult {
  productName: string;
  certificationNumber: string;
  manufacturer: string;
  certificationDate: string;
  isCertified: boolean;
}

interface MedicineResult {
  isPermitted: boolean;
  analysisResult: string;
  precautions: string;
  recommendations: string;
}

// 검색 폼 컴포넌트
interface SearchFormProps {
  onSubmit: (searchTerm: string) => void;
  isLoading: boolean;
  setHealthFoodResult: (result: HealthFoodResult | null) => void;
  setMedicineResult: (result: MedicineResult | null) => void;
  setError: (error: string | null) => void;
}

const SearchForm = ({ 
  onSubmit, 
  isLoading, 
  setHealthFoodResult, 
  setMedicineResult,
  setError 
}: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 의약품 검색 axios 로직
      const response = await axios.post('http://localhost:8080/api/v1/search', {
        medicineName: searchTerm
      });
      
      if (response.data) {
        const { healthFoodCertification, medicineLicense } = response.data;
        onSubmit(searchTerm);
        setHealthFoodResult(healthFoodCertification);
        setMedicineResult(medicineLicense);
      }
      
    } catch (error) {
      console.error('검색 오류:', error);
      setError('검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="의약품명을 입력하세요"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? '검색중...' : '검색'}
      </button>
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
      // 이미지 검색 axios 로직
      const response = await axios.post('/api/medicine/image-search', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('이미지 검색 결과:', response.data);
      // 여기서 검색 결과를 처리할 수 있습니다
    } catch (error) {
      console.error('이미지 검색 오류:', error);
      alert('이미지 검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="image-search-container">
      <h3 id="image-search-title">이미지로 검색하기</h3>
      <div 
        className="image-upload-box"
        role="button"
        tabIndex={0}
        aria-labelledby="image-search-title"
      >
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

// 건강기능식품 인증 결과 컴포넌트
const HealthFoodCertification = ({ result }: { result: HealthFoodResult | null }) => (
  <article className="result-item" role="article" aria-labelledby="health-food-title">
    <h3 id="health-food-title">건강기능식품 인증내역 분석</h3>
    <div className="result-details">
      <div className="status-indicator" role="status" aria-live="polite">
        {result?.isCertified ? (
          <>
            <MdCheckCircle style={{ color: '#4CAF50', fontSize: '24px' }} aria-hidden="true" />
            <span>인증 확인됨</span>
          </>
        ) : (
          <>
            <MdError style={{ color: '#f44336', fontSize: '24px' }} aria-hidden="true" />
            <span>인증 내역 없음</span>
          </>
        )}
      </div>
      <dl>
        <dt>제품명:</dt>
        <dd>{result?.productName || '정보 없음'}</dd>
        <dt>인증번호:</dt>
        <dd>{result?.certificationNumber || '정보 없음'}</dd>
        <dt>제조업체:</dt>
        <dd>{result?.manufacturer || '정보 없음'}</dd>
        <dt>인증일자:</dt>
        <dd>{result?.certificationDate || '정보 없음'}</dd>
      </dl>
    </div>
  </article>
);

// 의약품 허가 결과 컴포넌트
const MedicinePermission = ({ result }: { result: MedicineResult | null }) => (
  <article className="result-item" role="article" aria-labelledby="medicine-title">
    <h3 id="medicine-title">의약품 허가내역 분석</h3>
    <div className="result-details">
      <div className="status-indicator" role="status" aria-live="polite">
        {result?.isPermitted ? (
          <>
            <MdCheckCircle style={{ color: '#4CAF50', fontSize: '24px' }} aria-hidden="true" />
            <span>허가 확인됨</span>
          </>
        ) : (
          <>
            <MdError style={{ color: '#f44336', fontSize: '24px' }} aria-hidden="true" />
            <span>허가 내역 없음</span>
          </>
        )}
      </div>
      <dl>
        <dt>분석결과:</dt>
        <dd>{result?.analysisResult || '정보가 없습니다.'}</dd>
        <dt>주의사항:</dt>
        <dd>{result?.precautions || '정보가 없습니다.'}</dd>
        <dt>권고사항:</dt>
        <dd>{result?.recommendations || '정보가 없습니다.'}</dd>
      </dl>
    </div>
  </article>
);

function FADresult() {
  const location = useLocation();
  const searchResult = location.state?.searchResult;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBrailleOptions, setShowBrailleOptions] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [healthFoodResult, setHealthFoodResult] = useState<HealthFoodResult | null>(null);
  const [medicineResult, setMedicineResult] = useState<MedicineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (searchResult) {
      const { healthFoodCertification, medicineLicense } = searchResult;
      setHealthFoodResult(healthFoodCertification);
      setMedicineResult(medicineLicense);
    }
  }, [searchResult]);

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

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 건강기능식품 인증 결과 axios 로직
      const healthFoodResponse = await axios.get(`/api/health-food/search?term=${searchTerm}`);
      setHealthFoodResult(healthFoodResponse.data);
      
      // 의약품 허가 결과 axios 로직
      const medicineResponse = await axios.get(`/api/medicine/search?term=${searchTerm}`);
      setMedicineResult(medicineResponse.data);
    } catch (err) {
      setError('검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('검색 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="search-container" role="search" aria-label="의약품 허위광고 검색">
        <SearchForm 
          onSubmit={handleSearch} 
          isLoading={isLoading}
          setHealthFoodResult={setHealthFoodResult}
          setMedicineResult={setMedicineResult}
          setError={setError}
        />
        <ImageUpload />
      </section>

      {error && (
        <p role="alert" style={{ color: 'red', textAlign: 'center' }}>
          {error}
        </p>
      )}

      <section className="search-results" role="region" aria-label="허위광고 판별 결과">
        <div className="result-header">
          <h2>의약품 허위광고 판별 결과</h2>
          <AccessibilityTools 
            onTTSClick={handleTTSClick}
            showBrailleOptions={showBrailleOptions}
            onBrailleOptionsClick={() => setShowBrailleOptions(!showBrailleOptions)}
            onBrailleOptionSelect={handleBrailleOptionSelect}
          />
        </div>
        <p role="note" style={{ textAlign: 'center', color: '#666666' }}>
          건강기능식품, 의약품 인증 및 허가 여부를 통해 제품의 효능을 검증할 수 있어요.
        </p>
        <div className="results-container">
          <HealthFoodCertification result={healthFoodResult} />
          <MedicinePermission result={medicineResult} />
        </div>
      </section>

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}

export default FADresult;
