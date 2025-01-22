import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FADresult.css';
import { FaSearch, FaUniversalAccess, FaExclamationTriangle } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout';
import { MdCheckCircle, MdError } from "react-icons/md";

function FADresult() {
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
        <form>
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
        <h2>의약품 허위광고 판별 결과</h2>
        <p style={{ textAlign: 'center', color: '#666666' }}>건강기능식품, 의약품 인증 및 허가 여부를 통해 제품의 효능을 검증할 수 있어요.</p>
        <div className="results-container">
          <div className="result-item">
            <h3>건강기능식품 인증내역 분석</h3>
            <div className="result-details">
              <div className="status-indicator">
                <MdCheckCircle style={{ color: '#4CAF50', fontSize: '24px' }} />
                <span>인증 확인됨</span>
              </div>
              <p><strong>제품명:</strong> 비타민C 1000</p>
              <p><strong>인증번호:</strong> 제2023-12345호</p>
              <p><strong>제조업체:</strong> 건강식품(주)</p>
              <p><strong>인증일자:</strong> 2023.01.15</p>
            </div>
          </div>

          <div className="result-item">
            <h3>의약품 허가내역 분석</h3>
            <div className="result-details">
              <div className="status-indicator">
                <MdError style={{ color: '#f44336', fontSize: '24px' }} />
                <span>허가 내역 없음</span>
              </div>
              <p><strong>분석결과:</strong> 의약품 허가 이력이 확인되지 않았습니다.</p>
              <p><strong>주의사항:</strong> 해당 제품은 의약품으로 허가되지 않은 제품입니다.</p>
              <p><strong>권고사항:</strong> 의약품으로서의 효능·효과를 표방하는 광고는 허위광고에 해당될 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
}

export default FADresult;
