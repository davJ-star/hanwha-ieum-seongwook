// src/pages/DrugDetail.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/pages/DrugDetail.css';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import axios, { AxiosError } from 'axios';

interface DrugDetailResponse {
  id: number;
  name: string;
  detailInfo: string;
}

function DrugDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const [drugData, setDrugData] = useState<DrugDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrugDetail = async () => {
      if (!id) {
        setError('의약품 ID가 없습니다.');
        return;
      }
      try {
        setLoading(true);
        console.log('[DrugDetail] 상세정보 요청 >>', { id });
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!drugData) return <div>데이터가 없습니다.</div>;

  return (
    <Layout>
      <section className="drug-detail-container">
        <h2>의약품 상세 정보</h2>
        <div className="result-item" role="article">
          <h2>의약품명: {drugData.name}</h2>
          <div className="result-details">
            <p>
              <strong>상세 정보:</strong>
            </p>
            <p>{drugData.detailInfo}</p>
          </div>
        </div>
      </section>
      <AccessibilityModal isOpen={false} onClose={() => {}} />
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
