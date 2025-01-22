import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiseaseDetail.css';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout';

function DiseaseDetail() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <Layout>
      {/* 검색 섹션 */}
      <div className="search-container">
        <h2>의약품 정보 검색하기</h2>
        <form>
          <select name="type">
            <option value="" disabled selected>검색 조건</option>
            <option value="medicine">의약품</option>
            <option value="disease">질병</option>
          </select>
          <input type="text" placeholder="검색어를 입력하세요" />
          <button type="submit" style={{ color: '#000000' }}>검색</button>
        </form>

        <div className="image-search-container">
          <h3>이미지로 검색하기</h3>
          <div className="image-upload-box">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                console.log('이미지 업로드:', e.target.files?.[0]);
              }}
            />
            <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
          </div>
        </div>
      </div>

      {/* 검색 결과 섹션 */}
      <div className="search-results">
        <h2>검색 결과</h2>
        <div className="results-container">
          <div className="result-item">
            <h2>의약품명: 타이레놀</h2>
            <div className="result-details">
              <p><strong>성분:</strong> 아세트아미노펜</p>
              <p><strong>효능/효과:</strong> 감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 염좌통</p>
              <p><strong>용법/용량:</strong> 
                <ul>
                  <li>성인: 1회 1~2정씩 1일 3-4회 복용</li>
                  <li>1일 최대 4그램을 초과하지 말 것</li>
                  <li>식후 30분에 물과 함께 복용</li>
                </ul>
              </p>
              <p><strong>주의사항:</strong>
                <ul>
                  <li>알코올과 함께 복용하지 말 것</li>
                  <li>간장애 또는 신장애가 있는 환자는 복용 전 의사와 상담</li>
                  <li>과다복용 시 간손상 위험이 있으므로 지시된 용량만 복용</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </div>

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}

export default DiseaseDetail;
