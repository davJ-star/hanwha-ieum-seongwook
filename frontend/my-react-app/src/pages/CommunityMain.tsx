import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/commu.css';
import Layout from '../components/Layout/Layout';

interface Post {
  id: number;
  title: string;
  category: string;
  disabilityType: string;
  authorName: string | null;
  createdAt: string;
  commentsCount: number;
}

interface CommunityData {
  pagination: {
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
    currentPage: number;
  };
  disabilityTypes: string[];
  categories: string[];
  posts: Post[];
}

const BoardButton = ({ label, path, onClick }: { label: string; path: string; onClick: (path: string) => void }) => (
  <button 
    aria-label={`${label}으로 이동`}
    onClick={() => onClick(path)}
    onContextMenu={(e) => {
      e.preventDefault();
      window.open(path, '_blank');
    }}
    className="board-button"
  >
    {label}
  </button>
);

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

const PostItem = ({ post }: { post: Post }) => (
  <div 
    className="post-item" 
    role="article"
    onClick={() => {
      window.location.href = `/post/${post.id}`;
    }}
  >
    <div className="post-item-header">
      <h4 className="post-title">{post.title}</h4>
      <div className="post-tags">
        <span className="post-category">{post.category}</span>
        <span className="post-disability">{post.disabilityType}</span>
      </div>
    </div>
    <div className="post-item-body">
      <div className="post-info">
        <span className="post-author">작성자: {post.authorName || '익명'}</span>
        <span className="post-date">
          <time dateTime={post.createdAt}>{post.createdAt}</time>
        </span>
      </div>
      <div className="post-comments">
        댓글 수: {post.commentsCount}
      </div>
    </div>
  </div>
);

const BoardList = ({ disabilityTypes, navigate }: { disabilityTypes: string[]; navigate: (path: string) => void }) => {
  // 장애 유형별 URL 매핑
  const disabilityTypeToPath: { [key: string]: string } = {
    '지체장애': 'PDC',
    '뇌병변장애': 'BLD',
    '시각장애': 'VI',
    '청각장애': 'HI',
    '언어장애': 'SI',
    '안면장애': 'FD',
    '내부기관장애': 'IOD',
    '정신적장애': 'MD'
  };

  return (
    <nav className="board-list" role="navigation" aria-label="게시판 메뉴">
      <h3 id="boardListTitle">게시판<br />목록</h3>
      <BoardButton label="커뮤니티 메인" path="/community-main" onClick={navigate} />
      {disabilityTypes.map((type) => (
        <BoardButton
          key={type}
          label={`${type} 게시판`}
          path={`/${disabilityTypeToPath[type]}commu`}
          onClick={navigate}
        />
      ))}
    </nav>
  );
};

const PostList = ({ posts, categories, navigate }: { posts: Post[]; categories: string[]; navigate: (path: string) => void }) => (
  <section className="post-list-container" aria-labelledby="postListTitle">
    <SearchBar />
    <header className="post-header">
      <h2 id="postListTitle">전체 게시글</h2>
      <button 
        className="write-button" 
        onClick={() => navigate('/writepost')} 
        onContextMenu={(e) => {
          e.preventDefault();
          window.open('/writepost', '_blank');
        }}
        aria-label="새 게시글 작성하기"
      >
        글쓰기
      </button>
    </header>
    <div className="category-filter">
      {categories.map((category) => (
        <button key={category} className="category-button">{category}</button>
      ))}
    </div>
    <article className="post-list">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </article>
  </section>
);

const CommunityMain = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    axios.get('http://localhost:8080/community')
      .then(response => setCommunityData(response.data.home.fields))
      .catch(error => console.error('Error fetching community data:', error));
  }, []);

  if (!communityData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <main className="community-page" role="main">
        <div className="community-content">
          <BoardList disabilityTypes={communityData.disabilityTypes} navigate={navigate} />
          <PostList posts={communityData.posts} categories={communityData.categories} navigate={navigate} />
        </div>
      </main>
    </Layout>
  );
}

export default CommunityMain;
