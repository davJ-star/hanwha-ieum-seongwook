import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import './FADsearch.css';

const FADsearch = () => {
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

  return (
    <Layout>
      <section className="search-container" role="search" aria-label="의약품 허위광고 검색">
        <h2 id="main-title">의약품 허위광고 판별하기</h2>
        <p role="note" style={{ textAlign: 'center', color: '#666666' }}>
          의심되는 의약품 광고 내용을 입력하시면 허위광고 여부를 판별해드립니다!
        </p>
        <form role="search" aria-labelledby="main-title">
          <textarea 
            placeholder="광고 내용을 입력하세요" 
            rows={5}
            className="ad-input"
            aria-label="광고 내용 입력"
            style={{ color: '#000000' }}
          />
          <button 
            type="submit" 
            className="submit-button"
            aria-label="허위광고 판별하기"
          >
            판별하기
          </button>
        </form>

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
              onChange={(e) => {
                console.log('이미지 업로드:', e.target.files?.[0]);
              }}
              aria-label="이미지 파일 선택"
            />
            <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FADsearch;
