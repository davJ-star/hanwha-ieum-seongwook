// src/pages/FADresult.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Layout from '../components/Layout/Layout';
import AccessibilityModal from '../components/AccessibilityModal';
import { FaBraille } from 'react-icons/fa';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
import { speakPageContent } from '../utils/accessibilityHandleTTS';
import '../styles/pages/FADresult.css';

interface SearchResult {
  id: number;
  itemName?: string;
  name?: string;
  entpName?: string;
  efcyQesitm?: string;
}

// 검색 결과 아이템 컴포넌트
const SearchResultItem = ({ data }: { data: SearchResult }) => {
  const name = data.itemName || data.name || '이름 없음';
  return (
    <div className="result-item" role="article">
      {/* 클릭 시 의약품 상세 정보 페이지(DrugDetail.tsx)로 이동 */}
      <a href={`/DrugDetail?id=${data.id}`} role="link" aria-label={`${name} 상세 정보 보기`}>
        <h3>{name}</h3>
        {data.efcyQesitm && <p>효능/효과: {data.efcyQesitm}</p>}
        {data.entpName && <p>제조사: {data.entpName}</p>}
      </a>
    </div>
  );
};

// 접근성 도구 컴포넌트
const AccessibilityTools = ({
  onTTSClick,
  showBrailleOptions,
  onBrailleOptionsClick,
  onBrailleOptionSelect,
}: {
  onTTSClick: () => void;
  showBrailleOptions: boolean;
  onBrailleOptionsClick: () => void;
  onBrailleOptionSelect: (option: string) => void;
}) => (
  <div className="accessibility-icons" role="toolbar" aria-label="접근성 도구">
    <VolumeUpIcon
      className="icon"
      onClick={onTTSClick}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label="텍스트 음성 변환"
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

const FADresult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // FADsearch.tsx에서 전달받은 결과 (state.results)
  const initialResults: SearchResult[] = (location.state as { results?: SearchResult[] })?.results || [];
  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBrailleOptions, setShowBrailleOptions] = useState(false);

  const noResultMessage = "* 이 제품은 의약품 허가내역이 없습니다. 특정 질병을 치료하는 효능이 검증되지 않았을 가능성이 큽니다.";

  // 만약 FADsearch.tsx에서 결과를 전달받지 못했을 경우, 재검색 기능을 제공할 수도 있습니다.
  // 여기서는 기본적으로 전달받은 결과를 그대로 사용합니다.
  useEffect(() => {
    if ((location.state as { results?: SearchResult[] })?.results) {
      setSearchResults((location.state as { results?: SearchResult[] }).results!);
    }
  }, [location.state]);

  const handleTTSClick = () => {
    const container = document.querySelector('.search-results');
    if (container) {
      speakPageContent(container as HTMLElement);
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

  return (
    <Layout>
      <section className="search-results" role="region" aria-label="허위광고 판별 결과">
        <div className="result-header">
          <h2>판별 결과</h2>
          <AccessibilityTools
            onTTSClick={handleTTSClick}
            showBrailleOptions={showBrailleOptions}
            onBrailleOptionsClick={() => setShowBrailleOptions(!showBrailleOptions)}
            onBrailleOptionSelect={handleBrailleOptionSelect}
          />
        </div>
        {loading ? (
          <div>검색 중...</div>
        ) : error ? (
          <div role="alert" style={{ color: 'red', textAlign: 'center' }}>{error}</div>
        ) : searchResults.length === 0 ? (
          <div>{noResultMessage}</div>
        ) : (
          <div className="results-container">
            {searchResults.map((item) => (
              <SearchResultItem key={item.id} data={item} />
            ))}
          </div>
        )}
      </section>
      <AccessibilityModal isOpen={false} onClose={() => {}} />
    </Layout>
  );
};

export default FADresult;
