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
        <h2>질병 정보 검색하기</h2>
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
            <h2>질병명: 감기</h2>
            <div className="result-details">
              <p><strong>뜻과 이유:</strong> 바이러스성 상기도 감염으로 인한 급성 호흡기 질환으로, 
                주로 날씨 변화나 면역력 저하로 인해 발생</p>
              <p><strong>대표증상:</strong> 발열, 기침, 인후통, 콧물, 두통, 피로감</p>
              <p><strong>치료방법:</strong> 
                <ul>
                  <li>충분한 휴식과 수분 섭취</li>
                  <li>해열제 및 진통제 복용</li>
                  <li>따뜻한 차나 물로 목을 편안하게 하기</li>
                  <li>실내 습도 유지</li>
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
