import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/commu.css';
import Layout from '../components/Layout/Layout';

// interface Post {
//   id: number;
//   title: string;
//   category: string;
//   disabilityType: string;
//   authorName: string | null;
//   createdAt: string;
//   commentsCount: number;
// }

//LocalDateTime
interface Post {  
  id: number;
  title: string;
  content: string;
  authorName: string | null;
  category: string;
  disabilityType: string;
  createdAt: string;
  comments: string [];
  disabilityTypeValue: string;
  formattedCreatedAt: string;
  categoryValue: string;

}

interface CommunityData {
// pagination: {
//   totalPages: number;
//   // hasPrevious: boolean;
//   // hasNext: boolean;
//   currentPage: number;
// };
totalPages: number;
keyword: string;
currentPage: number;
// disabilityTypes: string[];
// categories: string[];
posts: Post[]; 
}

// interface disabilityTypes {
//   disabilityTypes: string[];
// }

const BoardButton = ({ label, path, onClick }: { label: string; path: string; onClick: (path: string) => void }) => (
  <button 
    aria-label={`${label}으로 이동`}
    onClick={() => onClick(path)}
    onContextMenu={(e) => {
      e.preventDefault();
      window.open(path, '_blank');
    }}
  >
    {label}
  </button>
);

const SearchBar = ({ onSearch }: { onSearch: (keyword: string) => void }) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = () => {
    onSearch(searchKeyword);
  };

  return (
    <div className="search-bar" role="search">
      <input
        type="text"
        placeholder="게시글 검색"
        className="search-input"
        aria-label="게시글 검색"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      <button 
        className="search-button" 
        aria-label="검색하기"
        onClick={handleSearch}
      >
        검색
      </button>
    </div>
  );
};

const PostItem = ({ post }: { post: Post }) => (
  // 게시글 아이템 컴포넌트
  <div 
    className="post-item" 
    role="article"
    // 게시글 클릭 시 게시글 상세 페이지로 이동
    onClick={() => {
      window.location.href = `/post/${post.id}`;
    }}
    style={{ cursor: 'pointer' }}
    //
  >

    <h4>{post.title}</h4>
    <p>카테고리: {post.category}</p>
    <p>장애 유형: {post.disabilityType}</p>
    <p>작성자: {post.authorName || '익명'}</p>
    <p>작성일: <time dateTime={post.createdAt}>{post.createdAt}</time></p>
    <p>댓글 수: {post.comments?.length} </p>
  </div>
);

const BoardList = ({ disabilityTypes, navigate }: { disabilityTypes: string []; navigate: (path: string) => void }) => {
  // 장애 유형별 URL 매핑 추가
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

/*페이지네이션*/
const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    // 화면에 표시되는 페이지 번호는 1부터 시작하도록 조정
    const displayPage = currentPage + 1;
    let startPage = Math.max(1, displayPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="pagination" role="navigation" aria-label="페이지 네비게이션">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="이전 페이지"
      >
        이전
      </button>
      
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum - 1)}
          className={currentPage === pageNum - 1 ? 'active' : ''}
          aria-label={`${pageNum} 페이지`}
          aria-current={currentPage === pageNum - 1 ? 'page' : undefined}
        >
          {pageNum}
        </button>
      ))}
      
      {totalPages > getPageNumbers()[getPageNumbers().length - 1] && (
        <>
          <span>...</span>
          <button
            onClick={() => onPageChange(totalPages - 1)}
            aria-label={`${totalPages} 페이지`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        aria-label="다음 페이지"
      >
        다음
      </button>
    </div>
  );
};

const PostList = ({ posts = [], categories, navigate, onSearch, currentPage, totalPages, onPageChange }: 
  { posts: Post[]; categories: string[]; navigate: (path: string) => void; onSearch: (keyword: string) => void; 
    currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => (
  <section className="post-list-container" aria-labelledby="postListTitle">
    <SearchBar onSearch={onSearch} />
    <header className="post-header">
      <h2 id="postListTitle">시각장애 게시판</h2>
      <button 
        className="write-button" 
        onClick={() => navigate('/writepost')} 
        onContextMenu={(e) => {
          e.preventDefault();
          window.open('/writepost', '_blank');
        }}
        style={{ color: '#000000' }}
        aria-label="새 게시글 작성하기"
      >
        글쓰기
      </button>
    </header>

    <article className="post-list">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))
      ) : (
        <div>검색 결과가 없습니다.</div>
      )}
    </article>
    
    <Pagination 
      currentPage={currentPage} 
      totalPages={totalPages} 
      onPageChange={onPageChange}
    />
  </section>
);

const CommunityMain = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
 
  const fetchCommunityData = (page: number = 0) => {
    // 페이지 네이션 추가
    // 게시글 목록 조회 API 호출
    axios.get(`http://localhost:8080/community/VISUAL?page=${page}&size=9`)
      .then(response => setCommunityData(response.data.home.fields))
      .catch(error => console.error('Error fetching community data:', error));
  };

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      fetchCommunityData(currentPage);
      return;
    }

    axios.get(`http://localhost:8080/community/VISUAL/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&size=9`)
      .then(response => {
        const searchData = response.data.fields;
        if (searchData) {
          setCommunityData({
            posts: searchData.posts || [],
            totalPages: searchData.pagination.totalPages || 1,
            currentPage: searchData.pagination.currentPage || 0,
            keyword: searchData.keyword
          });
        }
      })
      .catch(error => {
        console.error('검색 중 오류 발생:', error);
        setCommunityData({
          posts: [],
          totalPages: 1,
          currentPage: 0,
          keyword: keyword
        });
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCommunityData(page);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchCommunityData(currentPage);
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.');
  };

  if (!communityData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <main className="community-page" role="main">
        <div className="community-content">
          <BoardList disabilityTypes={['지체장애', '뇌병변장애', '시각장애', '청각장애', '언어장애', '안면장애', '내부기관장애', '정신적장애']} navigate={navigate} /> {/*  communityData.disabilityTypes */}
          <PostList 
            posts={communityData.posts} 
            categories={['질문', '자유', '공지']} // communityData.categories
            navigate={navigate}
            onSearch={handleSearch}
            currentPage={currentPage}
            totalPages={communityData.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </Layout>
  );
}

export default CommunityMain;
