import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/writepost.css';
import Layout from '../components/Layout/Layout';

// 글쓰기 폼 인터페이스
interface WriteFormProps {
  title: string;
  content: string;
  category: string;
  disabilityType: string;
  // tags: string[];
  // newTag: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDisabilityTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  // onNewTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // onAddTag: () => void;
  // onDeleteTag: (tag: string) => void;
  onSubmit: () => void;
}

// 글쓰기 폼 컴포넌트
const WriteForm = ({
  title,
  content,
  category,
  disabilityType,
  // tags,
  // newTag,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onDisabilityTypeChange,
  // onNewTagChange,
  // onAddTag,
  // onDeleteTag,
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
        value={disabilityType}
        onChange={onDisabilityTypeChange}
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
  const [disabilityType, setDisabilityType] = useState('');
  // const [tags, setTags] = useState<string[]>([]);
  // const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
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
      if (!disabilityType) {
        alert('게시판을 선택해주세요.');
        return;
      }

      setIsLoading(true);
      const postData = {
        title,
        content,
        category,
        disabilityType,
        // tags,
      };

      // 게시글 등록 API 호출
      // 
      const response = await axios.post('/community/write', postData);
      alert('게시글이 성공적으로 등록되었습니다!');
      navigate(`/post/${response.data.id}`);
    } catch (err) {
      console.error('게시글 등록 중 오류 발생:', err);
      console.log(err.response);
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.response.config);
      console.log(err.response.request);
      setError('게시글 등록 중 오류가 발생했습니다.');
      alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="write-post-page">
        <main className="write-post-content" role="main">
          {error && <div className="error-message">{error}</div>}
          <WriteForm
            title={title}
            content={content}
            category={category}
            disabilityType={disabilityType}
            // tags={tags}
            // newTag={newTag}
            onTitleChange={(e) => setTitle(e.target.value)}
            onContentChange={(e) => setContent(e.target.value)}
            onCategoryChange={(e) => setCategory(e.target.value)}
            onDisabilityTypeChange={(e) => setDisabilityType(e.target.value)}
            // onNewTagChange={(e) => setNewTag(e.target.value)}
            // onAddTag={handleAddTag}
            // onDeleteTag={handleDeleteTag}
            onSubmit={handleSubmit}
          />
          {isLoading && <div className="loading-spinner">처리중...</div>}
        </main>
      </div>
    </Layout>
  );
};

export default WritePost;
