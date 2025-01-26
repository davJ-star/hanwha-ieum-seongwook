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
    onClick={() => onClick(path)} 
    aria-label={`${label}${isCurrent ? '' : '으로 이동'}`}
    aria-current={isCurrent ? 'page' : undefined}
  >
    {label}
  </button>
);

// 게시판 목록 컴포넌트
const BoardList = ({ navigate }: { navigate: (path: string) => void }) => {
  const boards = [
    { label: '지체장애 게시판', path: '/PDCcommu' },
    { label: '뇌병변장애 게시판', path: '/BLDcommu' },
    { label: '시각장애 게시판', path: '/VIcommu' },
    { label: '청각장애 게시판', path: '/HIcommu', isCurrent: true },
    { label: '언어장애 게시판', path: '/SIcommu' },
    { label: '안면장애 게시판', path: '/FDcommu' },
    { label: '내부기관장애 게시판', path: '/IODcommu' },
    { label: '정신적장애 게시판', path: '/MDcommu' }
  ];

  return (
    <div className="board-list" role="navigation" aria-label="게시판 메뉴">
      <h3 id="boardListTitle">게시판<br />목록</h3>
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
  );
};

// 검색바 컴포넌트
const SearchBar = () => (
  <div className="search-bar" role="search">
    <input
      type="text"
      placeholder="게시글 검색"
      className="search-input"
      aria-label="게시글 검색"
    />
    <button 
      className="search-button" 
      aria-label="검색하기"
    >
      검색
    </button>
  </div>
);

// 게시글 헤더 컴포넌트
interface PostHeaderProps {
  onWriteClick: () => void;
}

const PostHeader = ({ onWriteClick }: PostHeaderProps) => (
  <div className="post-header">
    <h2 id="boardTitle">청각장애 게시판</h2>
    <button 
      className="write-button" 
      onClick={onWriteClick} 
      style={{ color: '#000000' }}
      aria-label="글쓰기"
    >
      글쓰기
    </button>
  </div>
);

// 게시글 아이템 컴포넌트
interface PostItemProps {
  title: string;
  author: string;
  date: string;
}

const PostItem = ({ title, author, date }: PostItemProps) => (
  <article className="post-item">
    <h4>{title}</h4>
    <p>작성자: {author}</p>
    <p>작성일: <time dateTime={date}>{date}</time></p>
  </article>
);

// 게시글 목록 컴포넌트
const PostList = ({ onWriteClick }: { onWriteClick: () => void }) => (
  <main className="post-list-container" role="main">
    <SearchBar />
    <PostHeader onWriteClick={onWriteClick} />
    <div className="post-list" role="feed" aria-labelledby="boardTitle">
      <PostItem 
        title="게시글 제목 예시"
        author="홍길동"
        date="2024-03-21"
      />
      {/* 추가 게시글들... */}
    </div>
  </main>
);

const HIcommu = () => {
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
          <BoardList navigate={navigate} />
          <PostList onWriteClick={() => navigate('/writepost')} />
        </div>
      </div>
    </Layout>
  );
}

export default HIcommu;