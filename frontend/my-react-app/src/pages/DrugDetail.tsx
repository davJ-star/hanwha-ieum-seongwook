import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/pages/DrugDetail.css';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import axios, { AxiosError } from 'axios';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { FaBraille } from 'react-icons/fa';
import { handleBrailleClick, handleBrailleRevert } from '../utils/accessibilityHandleBraille';
import { speakText } from '../utils/accessibilityHandleTTS';
import { HanBraille } from '../utils/HanBraille';
import { Braille } from '../utils/Braille';
import EasyModal from '../components/easyModal';

/**
 * 백엔드 응답 구조 예시
 * {
 *   itemName: string;
 *   efcyQesitm: string;
 *   atpnWarnQesitm: string;
 *   atpnQesitm: string;
 *   intrcQesitm: string;
 *   depositMethodQesitm: string;
 *   seQesitm: string;
 *   ...
 * }
 */
interface DrugDetailResponse {
  itemName: string;
  efcyQesitm: string;
  atpnWarnQesitm: string;
  atpnQesitm: string;
  intrcQesitm: string;
  depositMethodQesitm: string;
  seQesitm: string;
}

function DrugDetail() {
  // 쿼리 파라미터에서 id 추출 (예: ?id=8)
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id'); 

  const navigate = useNavigate();
  const [drugData, setDrugData] = useState<DrugDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBrailleOptions, setShowBrailleOptions] = useState(false);
  const [easyExplanation, setEasyExplanation] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDrugDetail = async () => {
      if (!id) {
        setError('의약품 ID가 없습니다.');
        return;
      }
      try {
        setLoading(true);
        console.log('[DrugDetail] 상세정보 요청 >>', { id });

        // 백엔드 응답 예시:
        // {
        //   "itemName": "타이레놀산500밀리그램(아세트아미노펜)",
        //   "efcyQesitm": "...",
        //   "atpnWarnQesitm": "...",
        //   "atpnQesitm": "...",
        //   "intrcQesitm": "...",
        //   "depositMethodQesitm": "...",
        //   "seQesitm": "..."
        // }
        const response = await axios.get(`http://localhost:8080/search/${id}/info`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('[DrugDetail] 상세정보 응답 <<', response.data);

        setDrugData(response.data);
      } catch (err) {
        const errorObj = err as AxiosError;
        console.error('[DrugDetail] 상세정보 오류:', errorObj);
        setError(
          errorObj.response?.data?.message || '의약품 정보를 불러오는 중 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDrugDetail();
  }, [id]);

  const handleTTSClick = () => {
    const container = document.querySelector('.drug-detail-container');
    if (container instanceof HTMLElement) {
      // 의약품 상세 정보 텍스트 추출
      const textContent = [
        `의약품명: ${drugData?.itemName}`,
        `효능/효과: ${drugData?.efcyQesitm}`,
        `경고사항: ${drugData?.atpnWarnQesitm}`,
        `주의사항: ${drugData?.atpnQesitm}`,
        `상호작용: ${drugData?.intrcQesitm}`,
        `보관방법: ${drugData?.depositMethodQesitm}`,
        `이상반응: ${drugData?.seQesitm}`
      ].join('. ');
      
      speakText(textContent);
    }
  };

  const handleBrailleOptionSelect = (option: string) => {
    if (!drugData) return;

    if (option === 'convert') {
      // 의약품 상세 정보 텍스트 추출
      const textContent = [
        `의약품명: ${drugData.itemName}`,
        `효능/효과: ${drugData.efcyQesitm}`,
        `경고사항: ${drugData.atpnWarnQesitm}`,
        `주의사항: ${drugData.atpnQesitm}`,
        `상호작용: ${drugData.intrcQesitm}`,
        `보관방법: ${drugData.depositMethodQesitm}`,
        `이상반응: ${drugData.seQesitm}`
      ].join('\n\n');

      // 언어 설정 (기본값: 'ko')
      const language: "ko" | "en" = "ko";

      // 점자 변환
      const converter = language === "ko" ? new HanBraille() : new Braille();
      const brailleText = converter.UnifiedBrl(textContent);

      // 결과 알림
      alert(`변환된 점자 텍스트:\n${brailleText}`);

      // BRF 파일 생성 및 다운로드
      const brfBlob = new Blob([brailleText], { type: "text/plain" });
      const url = URL.createObjectURL(brfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "drug_detail.brf";
      a.click();
      URL.revokeObjectURL(url);
    } else if (option === 'revert') {
      handleBrailleRevert();
    }
    setShowBrailleOptions(false);
  };

  const handleEasyExplanationClick = async () => {
    if (!id) {
      alert('의약품 ID가 없습니다.');
      return;
    }

    try {
      const response = await axios.get(`http://13.125.219.74:8080/search/${id}/info/openai`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('OpenAI API 응답:', response.data);
      setEasyExplanation(response.data.simplified_text);
      setIsModalOpen(true);
    } catch (err) {
      const errorObj = err as AxiosError;
      console.error('[DrugDetail] 쉬운 설명 오류:', errorObj);
      alert('쉬운 설명을 불러오는 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!drugData) return <div>데이터가 없습니다.</div>;

  return (
    <Layout>
      <section className="drug-detail-container">
        <div className="result-header">
          <h2>의약품 상세 정보</h2>
        </div>
        
        <div className="result-item" role="article">
          {/* 의약품명 */}
          <h2>의약품명: {drugData.itemName}</h2>
          
          {/* 접근성 아이콘을 의약품명 아래로 이동 */}
          <div className="accessibility-icons" role="toolbar" aria-label="접근성 도구" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            margin: '20px 0'
          }}>
            <VolumeUpIcon
              className="icon"
              onClick={handleTTSClick}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label="텍스트 음성 변환"
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
            
            <button
              className="easy-explanation-button"
              onClick={handleEasyExplanationClick}
              role="button"
              aria-label="쉬운 설명"
            >
              쉬운 설명
            </button>

          </div>

          <div className="result-details">
            {/* 기존 상세 정보 */}
            <p><strong>효능/효과:</strong></p>
            <p>{drugData.efcyQesitm}</p>
            <p><strong>경고사항:</strong></p>
            <p>{drugData.atpnWarnQesitm}</p>
            <p><strong>주의사항:</strong></p>
            <p>{drugData.atpnQesitm}</p>
            <p><strong>상호작용:</strong></p>
            <p>{drugData.intrcQesitm}</p>
            <p><strong>보관방법:</strong></p>
            <p>{drugData.depositMethodQesitm}</p>
            <p><strong>이상반응:</strong></p>
            <p>{drugData.seQesitm}</p>
          </div>
        </div>
      </section>
      <AccessibilityModal isOpen={false} onClose={() => {}} />

      {/* 쉬운 설명 모달 */}
      <EasyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={easyExplanation}
      />
    </Layout>
  );
}

export default DrugDetail;
// // src/pages/DrugDetail.tsx
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
//   // 쿼리 파라미터에서 id 추출 (?id=xxx)
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

