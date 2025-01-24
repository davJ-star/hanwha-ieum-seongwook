import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './commu.css';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout';

const BLDcommu = () => {
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
      <main className="community-page">
        <div className="community-content">
          {/* 좌측 게시판 목록 */}
          <nav className="board-list" aria-label="게시판 메뉴">
            <h3 id="boardListTitle">게시판 목록</h3>
            <div role="navigation" aria-labelledby="boardListTitle">
              <button aria-label="지체장애 게시판으로 이동" onClick={() => navigate('/PDCcommu')}>지체장애 게시판</button>
              <button aria-current="page" aria-label="뇌병변장애 게시판" onClick={() => navigate('/BLDcommu')}>뇌병변장애 게시판</button>
              <button aria-label="시각장애 게시판으로 이동" onClick={() => navigate('/VIcommu')}>시각장애 게시판</button>
              <button aria-label="청각장애 게시판으로 이동" onClick={() => navigate('/HIcommu')}>청각장애 게시판</button>
              <button aria-label="언어장애 게시판으로 이동" onClick={() => navigate('/SIcommu')}>언어장애 게시판</button>
              <button aria-label="안면장애 게시판으로 이동" onClick={() => navigate('/FDcommu')}>안면장애 게시판</button>
              <button aria-label="내부기관장애 게시판으로 이동" onClick={() => navigate('/IODcommu')}>내부기관장애 게시판</button>
              <button aria-label="정신적장애 게시판으로 이동" onClick={() => navigate('/MDcommu')}>정신적장애 게시판</button>
            </div>
          </nav>

          {/* 중앙 게시글 목록 */}
          <section className="post-list-container">
            {/* 게시글 검색창 추가 */}
            <div className="search-bar" role="search">
              <input
                type="text"
                placeholder="게시글 검색"
                className="search-input"
                aria-label="게시글 검색"
              />
              <button className="search-button" aria-label="검색하기">검색</button>
            </div>

            <header className="post-header">
              <h2 id="postListTitle">뇌병변장애 게시판</h2>
              <button 
                className="write-button" 
                onClick={() => navigate('/writepost')} 
                style={{ color: '#000000' }}
                aria-label="새 게시글 작성하기"
              >
                글쓰기
              </button>
            </header>
            
            {/* 임시 게시글 목록 */}
            <article className="post-list" aria-labelledby="postListTitle">
              <div className="post-item" role="article">
                <h4>게시글 제목 예시</h4>
                <p>작성자: <span>홍길동</span></p>
                <p>작성일: <time dateTime="2024-03-21">2024-03-21</time></p>
              </div>
              {/* 추가 게시글들... */}
            </article>
          </section>
        </div>
      </main>
    </Layout>
  );
}

export default BLDcommu;