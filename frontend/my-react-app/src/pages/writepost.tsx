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
const SearchBar = () => (
  <div className="search-bar" role="search">
    <input
      type="text"
      placeholder="게시글 검색"
      className="search-input"
      aria-label="게시글 검색"
      style={{ color: '#000000' }}
    />
    <button className="search-button" aria-label="검색하기">검색</button>
  </div>
);

// 글쓰기 폼 인터페이스
interface WriteFormProps {
  title: string;
  content: string;
  category: string;
  disabilityType: string;
  tags: string[];
  newTag: string;
  selectedImage: File | null;
  imagePreview: string | null;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDisabilityTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onNewTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTag: () => void;
  onDeleteTag: (tag: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

// 글쓰기 폼 컴포넌트
const WriteForm = ({
  title,
  content,
  category,
  disabilityType,
  tags,
  newTag,
  selectedImage,
  imagePreview,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onDisabilityTypeChange,
  onNewTagChange,
  onAddTag,
  onDeleteTag,
  onImageUpload,
  onRemoveImage,
  onSubmit
}: WriteFormProps) => (
  <form className="post-form-container" role="form" aria-label="게시글 작성" onSubmit={onSubmit}>
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
        <option value="NOTICE">공지</option>
        <option value="QUESTION">질문</option>
        <option value="INFORMATION">자유</option>
      </select>
      <select
        value={disabilityType}
        onChange={onDisabilityTypeChange}
        className="board-select"
        aria-label="게시판 선택"
        style={{ color: '#000000' }}
      >
        <option value="">게시판 선택</option>
        <option value="PHYSICAL">지체장애 게시판</option>
        <option value="BRAIN">뇌병변장애 게시판</option>
        <option value="VISUAL">시각장애 게시판</option>
        <option value="AUDITORY">청각장애 게시판</option>
        <option value="LANGUAGE">언어장애 게시판</option>
        <option value="DEVELOPMENTAL">안면장애 게시판</option>
        <option value="INTERNAL_ORGANS">내부기관장애 게시판</option>
        <option value="INTELLECTUAL">정신적장애 게시판</option>
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
      <div className="image-upload-section" role="group" aria-label="이미지 업로드">
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
      </div>
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
    <button className="submit-button" type="submit" aria-label="게시글 등록하기">
      글쓰기
    </button>
  </form>
);

const WritePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [disabilityType, setDisabilityType] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 디버깅: 저장된 토큰과 axios 헤더 확인
    const token = localStorage.getItem('token');
    console.log("WritePost 요청 전, localStorage의 token:", token);
    console.log("Axios 기본 Authorization 헤더:", axios.defaults.headers.common['Authorization']);

    try {
      const payload = {
        title,
        content,
        category,      // "NOTICE", "QUESTION", "INFORMATION" 등
        disabilityType // "PHYSICAL", "BRAIN", "VISUAL", 등
      };

      const response = await axios.post(
        'http://localhost:8080/community/write',
        payload,
        { withCredentials: true }
      );

      console.log("WritePost 응답:", response.data);
      alert(response.data.message);
      navigate(`/community/post/${response.data.id}`);
    } catch (error: any) {
      console.error("WritePost 에러:", error);
      alert('게시글 등록에 실패했습니다.');
    }
  };

  return (
    <Layout>
      <div className="write-post-page">
        <BoardList navigate={navigate} />
        <main className="write-post-content" role="main">
          <SearchBar />
          <WriteForm
            title={title}
            content={content}
            category={category}
            disabilityType={disabilityType}
            tags={tags}
            newTag={newTag}
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            onTitleChange={(e) => setTitle(e.target.value)}
            onContentChange={(e) => setContent(e.target.value)}
            onCategoryChange={(e) => setCategory(e.target.value)}
            onDisabilityTypeChange={(e) => setDisabilityType(e.target.value)}
            onNewTagChange={(e) => setNewTag(e.target.value)}
            onAddTag={handleAddTag}
            onDeleteTag={handleDeleteTag}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            onSubmit={handleSubmit}
          />
        </main>
      </div>
    </Layout>
  );
};

export default WritePost;
