import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import './Login.css';

function Login() {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://your-backend-url.com/api/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName, userPassword }),
        });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert('로그인 성공!');
        navigate('/mypage');
      } else {
        const errorData = await response.json();
        setError(errorData.message || '로그인 실패. 다시 시도해주세요.');
      }
    } catch (err) {
      setError('서버에 연결할 수 없습니다.');
    }
  };

  const handleZoom = (zoomType: string) => {
    const currentZoom = document.body.style.zoom ? parseFloat(document.body.style.zoom) : 1;
    if (zoomType === 'in') document.body.style.zoom = (currentZoom + 0.1).toString();
    if (zoomType === 'out') document.body.style.zoom = (currentZoom - 0.1).toString();
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h3>환영합니다!</h3>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <h3>전화번호 또는 이메일 주소를 입력해주세요.</h3>
          <input
            type="text"
            name="userName"
            placeholder="전화번호 또는 이메일"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <h3>비밀번호를 입력해주세요.</h3>
          <input
            type="password"
            name="userPassword"
            placeholder="비밀번호"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input type="submit" value="로그인" />
        </form>
        <button className="kakao-login-btn" onClick={() => alert('카카오 로그인 시도')}>
          카카오 로그인
        </button>
        <div className="additional-buttons">
          <a href="/signup">회원가입</a>
          <a href="/forgot-password">비밀번호 찾기</a>
        </div>
      </div>

      <div className="floating-buttons">
        <button 
          className="floating-button zoom-button round"
          onClick={() => handleZoom('in')}
          title="화면 확대"
        >
          <FaSearch />
          <span>확대</span>
        </button>
        <button 
          className="floating-button zoom-button round"
          onClick={() => handleZoom('out')}
          title="화면 축소"
        >
          <FaSearch />
          <span>축소</span>
        </button>
        <button 
          className="floating-button accessibility-button"
          onClick={() => navigate('/accessibility-guide')}
          title="접근성 기능 가이드"
          style={{ backgroundColor: '#00ff00' }}
        >
          <FaUniversalAccess />
          <span>접근성 기능 가이드라인</span>
        </button>
      </div>
    </div>
  );
}
export default Login;
