import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './commu.css';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout';

const SIcommu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.');
  };

  return (
    <Layout>
      <div className="community-page">
        <div className="community-content">
          {/* 좌측 게시판 목록 */}
          <div className="board-list">
            <h3>게시판 목록</h3>
            <button onClick={() => navigate('/PDCcommu')}>지체장애 게시판</button>
            <button onClick={() => navigate('/BLDcommu')}>뇌병변장애 게시판</button>
            <button onClick={() => navigate('/VIcommu')}>시각장애 게시판</button>
            <button onClick={() => navigate('/HIcommu')}>청각장애 게시판</button>
            <button onClick={() => navigate('/SIcommu')}>언어장애 게시판</button>
            <button onClick={() => navigate('/FDcommu')}>안면장애 게시판</button>
            <button onClick={() => navigate('/IODcommu')}>내부기관장애 게시판</button>
            <button onClick={() => navigate('/MDcommu')}>정신적장애 게시판</button>
          </div>

          {/* 중앙 게시글 목록 */}
          <div className="post-list-container">
            {/* 게시글 검색창 추가 */}
            <div className="search-bar">
              <input
                type="text"
                placeholder="게시글 검색"
                className="search-input"
              />
              <button className="search-button">검색</button>
            </div>

            <div className="post-header">
              <h2>언어장애 게시판</h2>
              <button 
                className="write-button" 
                onClick={() => navigate('/writepost')} 
                style={{ color: '#000000' }}
              >
                글쓰기
              </button>
            </div>
            
            {/* 임시 게시글 목록 */}
            <div className="post-list">
              <div className="post-item">
                <h4>게시글 제목 예시</h4>
                <p>작성자: 홍길동</p>
                <p>작성일: 2024-03-21</p>
              </div>
              {/* 추가 게시글들... */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SIcommu;