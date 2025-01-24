import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import './Login.css';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout';

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

  return (
    <Layout>
      <div className="login-container" role="main">
        <div className="login-wrapper">
          <div className="login-header">
            <h3>환영합니다!</h3>
            <h1>로그인</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <h3>전화번호 또는 이메일 주소를 입력해주세요.</h3>
            <input
              type="text"
              name="userName"
              placeholder="전화번호 또는 이메일"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              aria-required="true"
            />
            <h3>비밀번호를 입력해주세요.</h3>
            <input
              type="password"
              name="userPassword"
              placeholder="비밀번호"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
              aria-required="true"
            />
            {error && <p role="alert">{error}</p>}
            <input type="submit" value="로그인" />
          </form>
          <button 
            className="kakao-login-btn" 
            onClick={() => alert('카카오 로그인 시도')}
          >
            카카오 로그인
          </button>
          <div className="additional-buttons">
            <Link to="/signup">회원가입</Link>
            <Link to="/forgotpw">비밀번호 찾기</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default Login;
