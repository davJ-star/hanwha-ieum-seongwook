import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './commu.css';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';

const IODcommu = () => {
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
          <div className="board-list" role="navigation" aria-label="게시판 메뉴">
            <h3 id="boardListTitle">게시판 목록</h3>
            <button onClick={() => navigate('/PDCcommu')} aria-label="지체장애 게시판으로 이동">지체장애 게시판</button>
            <button onClick={() => navigate('/BLDcommu')} aria-label="뇌병변장애 게시판으로 이동">뇌병변장애 게시판</button>
            <button onClick={() => navigate('/VIcommu')} aria-label="시각장애 게시판으로 이동">시각장애 게시판</button>
            <button onClick={() => navigate('/HIcommu')} aria-label="청각장애 게시판으로 이동">청각장애 게시판</button>
            <button onClick={() => navigate('/SIcommu')} aria-label="언어장애 게시판으로 이동">언어장애 게시판</button>
            <button onClick={() => navigate('/FDcommu')} aria-label="안면장애 게시판으로 이동">안면장애 게시판</button>
            <button onClick={() => navigate('/IODcommu')} aria-label="내부기관장애 게시판으로 이동" aria-current="page">내부기관장애 게시판</button>
            <button onClick={() => navigate('/MDcommu')} aria-label="정신적장애 게시판으로 이동">정신적장애 게시판</button>
          </div>

          <main className="post-list-container" role="main">
            <div className="search-bar" role="search">
              <input
                type="text"
                placeholder="게시글 검색"
                className="search-input"
                aria-label="게시글 검색"
              />
              <button className="search-button" aria-label="검색하기">검색</button>
            </div>

            <div className="post-header">
              <h2 id="boardTitle">내부기관 장애 게시판</h2>
              <button 
                className="write-button" 
                onClick={() => navigate('/writepost')} 
                style={{ color: '#000000' }}
                aria-label="글쓰기"
              >
                글쓰기
              </button>
            </div>
            
            <div className="post-list" role="feed" aria-labelledby="boardTitle">
              <article className="post-item">
                <h4>게시글 제목 예시</h4>
                <p>작성자: 홍길동</p>
                <p>작성일: 2024-03-21</p>
              </article>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default IODcommu;