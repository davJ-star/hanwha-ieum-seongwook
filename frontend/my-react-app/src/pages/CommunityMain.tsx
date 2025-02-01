// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/pages/commu.css';
// import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
// import AccessibilityModal from '../components/AccessibilityModal';
// import Layout from '../components/Layout/Layout';

// // 게시판 버튼 인터페이스
// interface BoardButtonProps {
//   label: string;
//   path: string;
//   onClick: (path: string) => void;
// }

// // 게시판 버튼 컴포넌트
// const BoardButton = ({ label, path, onClick }: BoardButtonProps) => (
//   <button 
//     aria-label={`${label}으로 이동`}
//     onClick={() => onClick(path)}
//     onContextMenu={(e) => {
//       e.preventDefault();
//       window.open(path, '_blank');
//     }}
//   >
//     {label}
//   </button>
// );

// // 검색바 컴포넌트
// const SearchBar = () => (
//   <div className="search-bar" role="search">
//     <input
//       type="text"
//       placeholder="게시글 검색"
//       className="search-input"
//       aria-label="게시글 검색"
//     />
//     <button 
//       className="search-button" 
//       aria-label="검색하기"
//     >
//       검색
//     </button>
//   </div>
// );

// // 게시글 아이템 인터페이스
// interface PostItemProps {
//   title: string;
//   author: string;
//   date: string;
// }

// // 게시글 아이템 컴포넌트
// const PostItem = ({ title, author, date }: PostItemProps) => (
//   <div className="post-item" role="article">
//     <h4>{title}</h4>
//     <p>작성자: {author}</p>
//     <p>작성일: <time dateTime={date}>{date}</time></p>
//   </div>
// );

// // 게시판 목록 컴포넌트
// const BoardList = ({ navigate }: { navigate: (path: string) => void }) => {
//   const boards = [
//     { label: '커뮤니티 메인', path: '/community-main' },
//     { label: '지체장애 게시판', path: '/PDCcommu' },
//     { label: '뇌병변장애 게시판', path: '/BLDcommu' },
//     { label: '시각장애 게시판', path: '/VIcommu' },
//     { label: '청각장애 게시판', path: '/HIcommu' },
//     { label: '언어장애 게시판', path: '/SIcommu' },
//     { label: '안면장애 게시판', path: '/FDcommu' },
//     { label: '내부기관장애 게시판', path: '/IODcommu' },
//     { label: '정신적장애 게시판', path: '/MDcommu' }
//   ];

//   return (
//     <nav className="board-list" role="navigation" aria-label="게시판 메뉴">
//       <h3 id="boardListTitle">게시판<br />목록</h3>
//       {boards.map((board) => (
//         <BoardButton
//           key={board.path}
//           label={board.label}
//           path={board.path}
//           onClick={navigate}
//         />
//       ))}
//     </nav>
//   );
// };

// // 게시글 목록 컴포넌트
// const PostList = ({ navigate }: { navigate: (path: string) => void }) => (
//   <section className="post-list-container" aria-labelledby="postListTitle">
//     <SearchBar />
//     <header className="post-header">
//       <h2 id="postListTitle">전체 게시글</h2>
//       <button 
//         className="write-button" 
//         onClick={() => navigate('/writepost')} 
//         onContextMenu={(e) => {
//           e.preventDefault();
//           window.open('/writepost', '_blank');
//         }}
//         style={{ color: '#000000' }}
//         aria-label="새 게시글 작성하기"
//       >
//         글쓰기
//       </button>
//     </header>
    
//     <article className="post-list">
//       <PostItem 
//         title="게시글 제목 예시"
//         author="홍길동"
//         date="2024-03-21"
//       />
//       {/* 추가 게시글들... */}
//     </article>
//   </section>
// );

// const CommunityMain = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsLoggedIn(false);
//     alert('로그아웃 되었습니다.');
//   };

//   return (
//     <Layout>
//       <main className="community-page" role="main">
//         <div className="community-content">
//           <BoardList navigate={navigate} />
//           <PostList navigate={navigate} />
//         </div>
//       </main>
//     </Layout>
//   );
// }

// export default CommunityMain;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  <div className="post-item" role="article">
    <h4>{post.title}</h4>
    <p>카테고리: {post.category}</p>
    <p>장애 유형: {post.disabilityType}</p>
    <p>작성자: {post.authorName || '익명'}</p>
    <p>작성일: <time dateTime={post.createdAt}>{post.createdAt}</time></p>
    <p>댓글 수: {post.commentsCount}</p>
  </div>
);

const BoardList = ({ disabilityTypes, navigate }: { disabilityTypes: string[]; navigate: (path: string) => void }) => (
  <nav className="board-list" role="navigation" aria-label="게시판 메뉴">
    <h3 id="boardListTitle">게시판<br />목록</h3>
    <BoardButton label="커뮤니티 메인" path="/community-main" onClick={navigate} />
    {disabilityTypes.map((type) => (
      <BoardButton
        key={type}
        label={`${type} 게시판`}
        path={`/${type}commu`}
        onClick={navigate}
      />
    ))}
  </nav>
);

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
        style={{ color: '#000000' }}
        aria-label="새 게시글 작성하기"
      >
        글쓰기
      </button>
    </header>
    
    {/* 카테고리 필터 추가(질문, 자유, 공지) */}
    <div className="category-filter">
      {categories.map((category) => (
        <button style={{ margin: "0px 0.35em" }} 
        key={category}>{category}</button>
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

    fetch('http://localhost:8080/community')
      .then(response => response.json())
      .then(data => setCommunityData(data.home.fields))
      .catch(error => console.error('Error fetching community data:', error));
  }, []);

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
          <BoardList disabilityTypes={communityData.disabilityTypes} navigate={navigate} />
          <PostList posts={communityData.posts} categories={communityData.categories} navigate={navigate} />
        </div>
      </main>
    </Layout>
  );
}

export default CommunityMain;
