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
import EasyModal from '../components/EasyModal';

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
interface DiseaseDetailResponse {
  diseaseName: string;
  symptoms: string;
  causes: string;
  treatments: string;
  sections: { sectionName: string; content: string; }[];
  // 필요 시 추가 필드...
}

function DiseaseDetail() {
  // 쿼리 파라미터에서 id 추출 (예: ?id=8)
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id'); 

  const navigate = useNavigate();
  const [diseaseData, setDiseaseData] = useState<DiseaseDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBrailleOptions, setShowBrailleOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [easyExplanation, setEasyExplanation] = useState('');

  useEffect(() => {
    const fetchDiseaseDetail = async () => {
      if (!id) {
        setError('질병 ID가 없습니다.');
        return;
      }
      try {
        setLoading(true);
        console.log('[DiseaseDetail] 상세정보 요청 >>', { id });

        const response = await axios.get<{ title: string; sections: { sectionName: string; content: string; }[] }>(`http://localhost:8080/api/health/search/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('[DiseaseDetail] 상세정보 응답 <<', response.data);

        const sections = response.data.sections;
        const cleanContent = sections.map((section: { sectionName: string; content: string; }) => ({
          ...section,
          content: section.content.replace(/<img[^>]*>/gi, ''),
        }));
        setDiseaseData({
          diseaseName: response.data.title,
          symptoms: cleanContent.find((section: { sectionName: string; content: string; }) => section.sectionName === '증상')?.content || '',
          causes: cleanContent.find((section: { sectionName: string; content: string; }) => section.sectionName === '원인')?.content || '',
          treatments: cleanContent.find((section: { sectionName: string; content: string; }) => section.sectionName === '치료')?.content || '',
          sections: cleanContent,
        });
      } catch (err) {
        const errorObj = err as AxiosError<{ message: string }>;
        console.error('[DiseaseDetail] 상세정보 오류:', errorObj);
        setError(
          errorObj.response?.data?.message || '질병 정보를 불러오는 중 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDiseaseDetail();
  }, [id]);

  const handleTTSClick = () => {
    const container = document.querySelector('.disease-detail-container');
    if (container instanceof HTMLElement) {
      // 의약품 상세 정보 텍스트 추출
      const textContent = [
        `질병명: ${diseaseData?.diseaseName}`,
        `증상: ${diseaseData?.symptoms}`,
        `원인: ${diseaseData?.causes}`,
        `치료: ${diseaseData?.treatments}`
      ].join('. ');
      
      speakText(textContent);
    }
  };

  const handleBrailleOptionSelect = (option: string) => {
    if (!diseaseData) return;

    if (option === 'convert') {
      // 의약품 상세 정보 텍스트 추출
      const textContent = [
        `질병명: ${diseaseData.diseaseName}`,
        `증상: ${diseaseData.symptoms}`,
        `원인: ${diseaseData.causes}`,
        `치료: ${diseaseData.treatments}`
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
      a.download = "disease_detail.brf";
      a.click();
      URL.revokeObjectURL(url);
    } else if (option === 'revert') {
      handleBrailleRevert();
    }
    setShowBrailleOptions(false);
  };

  const handleEasyExplanationClick = async () => {
    if (!id) {
      alert('질병 ID가 없습니다.');
      return;
    }

    try {
      const response = await axios.get(`http://13.124.88.193:8080/api/health/search/${id}/info/openai`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('OpenAI API 응답:', response.data);
      setEasyExplanation(response.data.simplified_text);
      setIsModalOpen(true);
    } catch (err) {
      const errorObj = err as AxiosError;
      console.error('[DiseaseDetail] 쉬운 설명 오류:', errorObj);
      alert('쉬운 설명을 불러오는 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!diseaseData) return <div>데이터가 없습니다.</div>;

  return (
    <Layout>
      <section className="disease-detail-container">
        <div className="result-header">
          <h2>질병 상세 정보</h2>
        </div>
        
        <div className="result-item" role="article">
          {/* 질병명 */}
          <h2>질병명: {diseaseData.diseaseName}</h2>
          
          {/* 접근성 아이콘을 질병명 아래로 이동 */}
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
            {/* 섹션 내용 표시 */}
            {diseaseData.sections.map((section: { sectionName: string; content: string; }, index: number) => (
              <div key={index} className="section-item">
                <h3>{section.sectionName}</h3>
                <p dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <AccessibilityModal isOpen={false} onClose={() => {}} />
      <EasyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={easyExplanation}
      />
    </Layout>
  );
}

export default DiseaseDetail;

