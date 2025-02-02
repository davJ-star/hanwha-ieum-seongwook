import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/commu.css';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import axios, { AxiosError } from 'axios';

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
    { label: '지체장애 게시판', path: '/PDCcommu', isCurrent: true },
    { label: '뇌병변장애 게시판', path: '/BLDcommu' },
    { label: '시각장애 게시판', path: '/VIcommu' },
    { label: '청각장애 게시판', path: '/HIcommu' },
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
    <h3 id="boardTitle">지체장애 게시판</h3>
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

interface Comment {
  id: number;
  content: string;
  authorName: string | null;
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string | null;
  category: string;
  disabilityType: string;
  createdAt: string;
  comments: string[];
  disabilityTypeValue: string;
  formattedCreatedAt: string;
  categoryValue: string;
}

interface CommunityData {
  totalPages: number;
  keyword: string;
  currentPage: number;
  posts: Post[];
}

// PostItem 컴포넌트 수정
const PostItem = ({ post }: { post: Post }) => (
  <div 
    className="post-item" 
    role="article"
    onClick={() => {
      window.location.href = `/post/${post.id}`;
    }}
    style={{ cursor: 'pointer' }}
  >
    <h4>{post.title}</h4>
    <p>카테고리: {post.categoryValue}</p>
    <p>장애 유형: {post.disabilityTypeValue}</p>
    <p>작성자: {post.authorName || '익명'}</p>
    <p>작성일: <time dateTime={post.createdAt}>{post.formattedCreatedAt}</time></p>
    <p>댓글 수: {post.comments.length}</p>
  </div>
);

// 페이지네이션 컴포넌트 추가
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 10; // 한 번에 보여줄 최대 페이지 번호 수
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 시작 페이지 조정
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // "이전" 버튼
    pageNumbers.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-nav"
      >
        이전
      </button>
    );

    // 페이지 번호들
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`page-number ${currentPage === i ? 'active' : ''}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    // "다음" 버튼
    pageNumbers.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-nav"
      >
        다음
      </button>
    );

    return pageNumbers;
  };

  return (
    <div className="pagination" role="navigation" aria-label="페이지 네비게이션">
      {renderPageNumbers()}
    </div>
  );
};

// PostList 컴포넌트 수정
const PostList = ({ navigate }: { navigate: (path: string) => void }) => {
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchPosts = async (page: number = 1) => {
    try {
      const response = await axios.get('http://localhost:8080/community', {
        params: {
          disabilityType: 'PHYSICAL',
          page: page - 1,
          size: 9 // 페이지당 9개의 게시물
        }
      });
      console.log('Response data:', response.data);
      if (response.data && typeof response.data === 'object') {
        setCommunityData({
          totalPages: response.data.totalPages || 0,
          keyword: response.data.keyword || '',
          currentPage: page,
          posts: Array.isArray(response.data.posts) ? response.data.posts : []
        });
      } else {
        setCommunityData({
          totalPages: 0,
          keyword: '',
          currentPage: 1,
          posts: []
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('게시글 로딩 중 오류 발생:', error);
      setCommunityData({
        totalPages: 0,
        keyword: '',
        currentPage: 1,
        posts: []
      });
      setLoading(false);
    }
  };
  
  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);
    if (!keyword.trim()) {
      fetchPosts(1);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/community/search', {
        params: {
          disabilityType: 'PHYSICAL',
          keyword: keyword,
          page: 0,
          size: 10
        }
      });
      console.log('Search response:', response.data);
      if (response.data && typeof response.data === 'object') {
        setCommunityData({
          totalPages: response.data.totalPages || 0,
          keyword: keyword,
          currentPage: 1,
          posts: Array.isArray(response.data.posts) ? response.data.posts : []
        });
        setCurrentPage(1);
      } else {
        setCommunityData({
          totalPages: 0,
          keyword: keyword,
          currentPage: 1,
          posts: []
        });
      }
    } catch (error) {
      console.error('게시글 검색 중 오류 발생:', error);
      setCommunityData({
        totalPages: 0,
        keyword: keyword,
        currentPage: 1,
        posts: []
      });
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (searchKeyword.trim()) {
      handleSearchWithPage(searchKeyword, page);
    } else {
      fetchPosts(page);
    }
  };

  const handleSearchWithPage = async (keyword: string, page: number) => {
    try {
      const response = await axios.get('http://localhost:8080/community/search', {
        params: {
          disabilityType: 'PHYSICAL',
          keyword: keyword,
          page: page - 1,
          size: 10
        }
      });
      if (response.data && typeof response.data === 'object') {
        setCommunityData({
          totalPages: response.data.totalPages || 0,
          keyword: keyword,
          currentPage: page,
          posts: Array.isArray(response.data.posts) ? response.data.posts : []
        });
      }
    } catch (error) {
      console.error('검색 페이지 로딩 중 오류 발생:', error);
      alert('페이지 로딩 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, []);

  if (loading || !communityData) {
    return (
      <main className="post-list-container" role="main">
        <SearchBar onSearch={handleSearch} />
        <PostHeader onWriteClick={() => navigate('/writepost')} />
        <div className="post-list" role="status" aria-live="polite">
          <p style={{ textAlign: 'center', padding: '20px' }}>
            게시글을 불러오는 중...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="post-list-container" role="main">
      <SearchBar onSearch={handleSearch} />
      <PostHeader onWriteClick={() => navigate('/writepost')} />
      <div className="post-list" role="feed" aria-labelledby="boardTitle">
        {Array.isArray(communityData.posts) && communityData.posts.length > 0 ? (
          communityData.posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))
        ) : (
          <p style={{ textAlign: 'center', padding: '20px' }}>
            게시글이 없습니다.
          </p>
        )}
      </div>
      {communityData.totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={communityData.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
};

const PDCcommu = () => {
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

export default PDCcommu;

// CSS 스타일 추가를 위한 스타일 태그
const styles = `
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 5px;
  }

  .pagination button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    background-color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination button:hover:not(:disabled) {
    background-color: #f0f0f0;
  }

  .pagination button.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }

  .pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .pagination .page-nav {
    font-weight: bold;
  }

  .pagination .page-number {
    color: #333;
  }

  .pagination .page-number.active {
    background-color: #007bff;
    color: white;
  }
`;

// 스타일 태그를 문서에 추가
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);