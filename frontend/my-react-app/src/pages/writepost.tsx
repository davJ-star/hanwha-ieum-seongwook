import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/writepost.css';
import Layout from '../components/Layout/Layout';

// 게시판 버튼 인터페이스
interface BoardButtonProps {
  label: string;
  path: string;
  onClick: (path: string) => void;
}

// 게시판 버튼 컴포넌트
const BoardButton = ({ label, path, onClick }: BoardButtonProps) => (
  <button 
    onClick={() => onClick(path)} 
    aria-label={`${label}으로 이동`}
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
    { label: '안면장애 게시판', path: '/FDcommu' },
    { label: '내부기관장애 게시판', path: '/IODcommu' },
    { label: '정신적장애 게시판', path: '/MDcommu' }
  ];

  return (
    <div className="board-list" role="navigation" aria-label="게시판 목록">
      <h3 id="boardListTitle">게시판 목록</h3>
      {boards.map((board) => (
        <BoardButton
          key={board.path}
          label={board.label}
          path={board.path}
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
      <button type="submit" className="search-button" aria-label="검색하기">
        검색
      </button>
    </form>
  );
};

// 글쓰기 폼 인터페이스
interface WriteFormProps {
  title: string;
  content: string;
  category: string;
  subcategory: string;
  tags: string[];
  newTag: string;
  // selectedImage: File | null;
  // imagePreview: string | null;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubcategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onNewTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTag: () => void;
  onDeleteTag: (tag: string) => void;
  // onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // onRemoveImage: () => void;
  onSubmit: () => void;
}

// 글쓰기 폼 컴포넌트
const WriteForm = ({
  title,
  content,
  category,
  subcategory,
  tags,
  newTag,
  // selectedImage,
  // imagePreview,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onSubcategoryChange,
  onNewTagChange,
  onAddTag,
  onDeleteTag,
  // onImageUpload,
  // onRemoveImage,
  onSubmit
}: WriteFormProps) => (
  <form className="post-form-container" role="form" aria-label="게시글 작성">
    <h2 id="writePostTitle">글쓰기</h2>

    <input
      type="text"
      value={title}
      onChange={onTitleChange}
      placeholder="제목을 입력하세요"
      className="post-title-input"
      aria-label="게시글 제목"
      aria-required="true"
      style={{ color: '#000000' }}
    />

    <div className="select-container" role="group" aria-label="게시글 분류">
      <select
        value={category}
        onChange={onCategoryChange}
        className="category-select"
        aria-label="말머리 선택"
        style={{ color: '#000000' }}
      >
        <option value="">말머리 선택</option>
        <option value="공지">공지</option>
        <option value="질문">질문</option>
        <option value="자유">자유</option>
      </select>

      <select
        value={subcategory}
        onChange={onSubcategoryChange}
        className="board-select"
        aria-label="게시판 선택"
        style={{ color: '#000000' }}
      >
        <option value="">게시판 선택</option>
        <option value="복약">지체장애 게시판</option>
        <option value="질환">뇌병변장애 게시판</option>
        <option value="복약">시각장애 게시판</option>
        <option value="복약">청각장애 게시판</option>
        <option value="복약">언어장애 게시판</option>
        <option value="복약">안면장애 게시판</option>
        <option value="복약">내부기관장애 게시판</option>
        <option value="복약">정신적장애 게시판</option>
      </select>
    </div>

    <textarea
      value={content}
      onChange={onContentChange}
      placeholder="내용을 입력하세요"
      className="post-content-input"
      aria-label="게시글 내용"
      aria-required="true"
      style={{ color: '#000000' }}
    />

    <div className="additional-options" role="group" aria-label="추가 옵션">
      {/* <div className="image-upload-section" role="group" aria-label="이미지 업로드">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={onImageUpload}
          style={{ display: 'none' }}
          aria-label="이미지 파일 선택"
        />
        <button 
          className="image-upload-button" 
          onClick={() => document.getElementById('image-upload')?.click()}
          type="button"
          aria-label="이미지 업로드하기"
        >
          이미지 업로드
        </button>
        {imagePreview && (
          <div className="image-preview-container" role="group" aria-label="이미지 미리보기">
            <img 
              src={imagePreview} 
              alt="업로드된 이미지 미리보기" 
              className="image-preview" 
            />
            <button 
              className="remove-image-button"
              onClick={onRemoveImage}
              type="button"
              aria-label="이미지 삭제하기"
            >
              이미지 삭제
            </button>
          </div>
        )}
      </div> */}

      <div className="tag-container" role="group" aria-label="태그 관리">
        <input
          type="text"
          value={newTag}
          onChange={onNewTagChange}
          placeholder="태그 추가"
          className="tag-input"
          aria-label="새 태그 입력"
          style={{ color: '#000000' }}
        />
        <button 
          className="add-tag-button" 
          onClick={onAddTag}
          type="button"
          aria-label="태그 추가하기"
        >
          추가
        </button>
        <div className="tag-list" role="list" aria-label="추가된 태그 목록">
          {tags.map((tag, index) => (
            <span key={index} className="tag-item" role="listitem">
              #{tag}
              <button
                className="delete-tag-button"
                onClick={() => onDeleteTag(tag)}
                type="button"
                aria-label={`${tag} 태그 삭제`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>

    <button 
      className="submit-button" 
      onClick={onSubmit}
      type="submit"
      aria-label="게시글 등록하기"
    >
      글쓰기
    </button>
  </form>
);

const WritePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleAddTag = () => {
    if (newTag.trim() !== '' && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  /* const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  }; */

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      // 검색 요청 API 호출 (테스트 전)
      const response = await axios.get(`/*추후 경로 추가*/`);
      console.log('검색 결과:', response.data);
      // 검색 결과 처리 로직 추가
    } catch (err) {
      console.error('검색 중 오류 발생:', err);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // 유효성 검사
      if (!title.trim()) {
        alert('제목을 입력해주세요.');
        return;
      }
      if (!content.trim()) {
        alert('내용을 입력해주세요.');
        return;
      }
      if (!category) {
        alert('말머리를 선택해주세요.');
        return;
      }
      if (!subcategory) {
        alert('게시판을 선택해주세요.');
        return;
      }

      setIsLoading(true);
      
      // 이미지 업로드 관련 코드 주석 처리
      /* let imageUrl = null;
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        // 이미지 업로드 요청 API 호출
        const imageResponse = await axios.post('/api/upload/image', formData);
        imageUrl = imageResponse.data.url;
      } */

      // 게시글 데이터 생성
      const postData = {
        title,
        content,
        category,
        subcategory,
        tags,
        // imageUrl,
      };

      // 게시글 등록 요청
      const response = await axios.post('/api/posts', postData);
      
      alert('게시글이 성공적으로 등록되었습니다!');
      navigate(`/post/${response.data.id}`); // 작성된 게시글로 이동동
    } catch (err) {
      console.error('게시글 등록 중 오류 발생:', err);
      setError('게시글 등록 중 오류가 발생했습니다.');
      alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="write-post-page">
        <BoardList navigate={navigate} />
        <main className="write-post-content" role="main">
          <SearchBar onSearch={handleSearch} />
          {error && <div className="error-message">{error}</div>}
          <WriteForm
            title={title}
            content={content}
            category={category}
            subcategory={subcategory}
            tags={tags}
            newTag={newTag}
            // selectedImage={selectedImage}
            // imagePreview={imagePreview}
            onTitleChange={(e) => setTitle(e.target.value)}
            onContentChange={(e) => setContent(e.target.value)}
            onCategoryChange={(e) => setCategory(e.target.value)}
            onSubcategoryChange={(e) => setSubcategory(e.target.value)}
            onNewTagChange={(e) => setNewTag(e.target.value)}
            onAddTag={handleAddTag}
            onDeleteTag={handleDeleteTag}
            // onImageUpload={handleImageUpload}
            // onRemoveImage={handleRemoveImage}
            onSubmit={handleSubmit}
          />
          {isLoading && <div className="loading-spinner">처리중...</div>}
        </main>
      </div>
    </Layout>
  );
};

export default WritePost;
