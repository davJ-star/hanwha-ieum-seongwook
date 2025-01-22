import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './writepost.css';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout';

const WritePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
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

  const handleSubmit = () => {
    alert('글이 등록되었습니다!');
    console.log({ title, content, category, subcategory, tags });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // 이미지 미리보기 URL 생성
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

  return (
    <Layout>
      <div className="write-post-page">
        {/* 좌측 게시판 목록 */}
        <div className="board-list">
          <h3>게시판 목록</h3>
          <button onClick={() => navigate('/PDCcommu')}>지체장애 게시판</button>
          <button onClick={() => navigate('/BLDcommu')}>뇌병변장애 게시판</button>
          <button onClick={() => navigate('/VIcommu')}>시각장애 게시판</button>
          <button onClick={() => navigate('/HIcommu')}>청각장애 게시판</button>
          <button onClick={() => navigate('/SIcommu')}>언어장애 게시판</button>
          <button onClick={() => navigate('/FDcommu')}>안면장애 게시판</button>
          <button onClick={() => navigate('/IODcommu')}>내부기관장애 게시판</button>
          <button onClick={() => navigate('/MDcommu')}>정신적장애 게시판</button>
        </div>

        {/* 우측 글쓰기 영역 */}
        <div className="write-post-content">
          {/* 게시글 검색창 */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="게시글 검색"
              className="search-input"
            />
            <button className="search-button">검색</button>
          </div>

          {/* 글쓰기 영역 */}
          <div className="post-form-container">
            <h2>글쓰기</h2>

            {/* 제목 입력 */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="post-title-input"
            />

            {/* 말머리 및 게시판 선택 */}
            <div className="select-container">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
              >
                <option value="">말머리 선택</option>
                <option value="공지">공지</option>
                <option value="질문">질문</option>
                <option value="자유">자유</option>
              </select>

              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="board-select"
              >
                <option value="">게시판 선택</option>
                <option value="복약">복약 게시판</option>
                <option value="질환">질환 게시판</option>
              </select>
            </div>

            {/* 내용 입력 */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="post-content-input"
            />

            {/* 이미지 업로드 및 태그 추가 */}
            <div className="additional-options">
              <div className="image-upload-section">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <button 
                  className="image-upload-button" 
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  이미지 업로드
                </button>
                {imagePreview && (
                  <div className="image-preview-container">
                    <img 
                      src={imagePreview} 
                      alt="미리보기" 
                      className="image-preview" 
                    />
                    <button 
                      className="remove-image-button"
                      onClick={handleRemoveImage}
                    >
                      이미지 삭제
                    </button>
                  </div>
                )}
              </div>

              <div className="tag-container">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="태그 추가"
                  className="tag-input"
                />
                <button className="add-tag-button" onClick={handleAddTag}>
                  추가
                </button>
                <div className="tag-list">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      #{tag}
                      <button
                        className="delete-tag-button"
                        onClick={() => handleDeleteTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 글쓰기 버튼 */}
            <button className="submit-button" onClick={handleSubmit}>
              글쓰기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WritePost;
