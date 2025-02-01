import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/commu.css';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import axios from 'axios';

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
    onContextMenu={(e) => {
      e.preventDefault();
      window.open(path, '_blank');
    }}
  >
    {label}
  </button>
);

// 게시판 목록 컴포넌트
const BoardList = ({ navigate }: { navigate: (path: string) => void }) => {
  const boards = [
    { label: '커뮤니티 메인', path: '/community-main' },
    { label: '지체장애 게시판', path: '/PDCcommu' },
    { label: '뇌병변장애 게시판', path: '/BLDcommu' },
    { label: '시각장애 게시판', path: '/VIcommu' },
    { label: '청각장애 게시판', path: '/HIcommu' },
    { label: '언어장애 게시판', path: '/SIcommu' },
    { label: '안면장애 게시판', path: '/FDcommu', isCurrent: true },
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
const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form className="search-bar" role="search" onSubmit={handleSearch}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="게시글 검색"
        className="search-input"
        aria-label="게시글 검색"
        style={{ color: '#000000' }}
      />
      <button 
        type="submit"
        className="search-button" 
        aria-label="검색하기"
      >
        검색
      </button>
    </form>
  );
};

// 게시글 헤더 컴포넌트
interface PostHeaderProps {
  onWriteClick: () => void;
}

const PostHeader = ({ onWriteClick }: PostHeaderProps) => (
  <div className="post-header">
    <h3 id="boardTitle">뇌병변장애 게시판</h3>
    <button 
      className="write-button" 
      onClick={onWriteClick} 
      onContextMenu={(e) => {
        e.preventDefault();
        window.open('/writepost', '_blank');
      }}
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

const PostItem = ({ title, author, date, id }: PostItemProps & { id: number }) => {
  const handlePostClick = async () => {
    try {
      //게시글 상세 조회 axios 로직
      const response = await axios.get(`http://localhost:8080/posts/${id}`);
      if (response.data) {
        window.location.href = `/post/${id}`;
      }
    } catch (error) {
      console.error('게시글 조회 중 오류 발생:', error);
    }
  };

  return (
    <article className="post-item" onClick={handlePostClick} style={{ cursor: 'pointer' }}>
      <h4>{title}</h4>
      <p>작성자: {author}</p>
      <p>작성일: {date}</p>
    </article>
  );
};

// 게시글 목록 컴포넌트
const PostList = ({ navigate }: { navigate: (path: string) => void }) => {
  const [posts, setPosts] = useState<Array<{
    id: number;
    title: string;
    author: string;
    createdAt: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      //게시글 데이터 가져오기(뇌병변장애 게시판)
      const response = await axios.get('http://localhost:8080/posts/PDC');
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('게시글 로딩 중 오류 발생:', error);
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      //게시글 검색 데이터 가져오기(뇌병변장애 게시판)
      const response = await axios.get(`http://localhost:8080/posts/PDC/search?query=${query}`);
      setPosts(response.data);
    } catch (error) {
      console.error('게시글 검색 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <div>게시글을 불러오는 중...</div>;
  }

  return (
    <main className="post-list-container" role="main">
      <SearchBar onSearch={handleSearch} />
      <PostHeader onWriteClick={() => navigate('/writepost')} />
      <div className="post-list" role="feed" aria-labelledby="boardTitle">
        {posts.map((post) => (
          <PostItem 
            key={post.id}
            id={post.id}
            title={post.title}
            author={post.author}
            date={post.createdAt}
          />
        ))}
        {posts.length === 0 && (
          <p>게시글이 없습니다.</p>
        )}
      </div>
    </main>
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
      <div className="community-page">
        <div className="community-content">
          <BoardList navigate={navigate} />
          <PostList navigate={navigate} />
        </div>
      </div>
    </Layout>
  );
}

export default BLDcommu;