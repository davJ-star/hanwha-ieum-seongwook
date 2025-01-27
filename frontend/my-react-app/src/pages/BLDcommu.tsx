import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/commu.css';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';

// 게시판 버튼 인터페이스
interface BoardButtonProps {
  label: string;
  path: string;
  isCurrent?: boolean;
  onClick: (path: string) => void;
}

// 게시판 버튼 컴포넌트
const BoardButton = ({ label, path, isCurrent, onClick }: BoardButtonProps) => (
  <button 
    aria-label={`${label}${isCurrent ? '' : '으로 이동'}`}
    aria-current={isCurrent ? 'page' : undefined}
    onClick={() => onClick(path)}
  >
    {label}
  </button>
);

// 검색바 컴포넌트
const SearchBar = () => (
  <div className="search-bar" role="search">
    <input
      type="text"
      placeholder="게시글 검색"
      className="search-input"
      aria-label="게시글 검색"
    />
    <button className="search-button" aria-label="검색하기">검색</button>
  </div>
);

// 게시글 아이템 인터페이스
interface PostItemProps {
  title: string;
  author: string;
  date: string;
}

// 게시글 아이템 컴포넌트
const PostItem = ({ title, author, date }: PostItemProps) => (
  <div className="post-item" role="article">
    <h4>{title}</h4>
    <p>작성자: <span>{author}</span></p>
    <p>작성일: <time dateTime={date}>{date}</time></p>
  </div>
);

// 게시판 목록 컴포넌트
const BoardList = ({ navigate }: { navigate: (path: string) => void }) => {
  const boards = [
    { label: '커뮤니티 메인', path: '/community-main' },
    { label: '지체장애 게시판', path: '/PDCcommu' },
    { label: '뇌병변장애 게시판', path: '/BLDcommu', isCurrent: true },
    { label: '시각장애 게시판', path: '/VIcommu' },
    { label: '청각장애 게시판', path: '/HIcommu' },
    { label: '언어장애 게시판', path: '/SIcommu' },
    { label: '안면장애 게시판', path: '/FDcommu' },
    { label: '내부기관장애 게시판', path: '/IODcommu' },
    { label: '정신적장애 게시판', path: '/MDcommu' }
  ];

  return (
    <nav className="board-list" aria-label="게시판 메뉴">
      <h3 id="boardListTitle">게시판<br />목록</h3>
      <div role="navigation" aria-labelledby="boardListTitle">
        {boards.map((board) => (
          <BoardButton
            key={board.path}
            label={board.label}
            path={board.path}
            isCurrent={board.isCurrent}
            onClick={navigate}
          />
        ))}
      </div>
    </nav>
  );
};

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
          <BoardList navigate={navigate} />

          <section className="post-list-container">
            <SearchBar />

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
            
            <article className="post-list" aria-labelledby="postListTitle">
              <PostItem 
                title="게시글 제목 예시"
                author="홍길동"
                date="2024-03-21"
              />
              {/* 추가 게시글들... */}
            </article>
          </section>
        </div>
      </main>
    </Layout>
  );
}

export default BLDcommu;