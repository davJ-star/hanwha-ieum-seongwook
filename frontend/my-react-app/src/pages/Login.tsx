import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/Login.css';
import Layout from '../components/Layout/Layout';

// 로그인 헤더 컴포넌트
const LoginHeader = () => (
  <div className="login-header">
    <h3>환영합니다!</h3>
    <h1>로그인</h1>
  </div>
);

// 입력 필드 컴포넌트
interface InputFieldProps {
  type: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField = ({
  type,
  name,
  label,
  value,
  onChange,
  placeholder
}: InputFieldProps) => (
  <>
    <h3>{label}</h3>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      aria-required="true"
      style={{ color: '#000000' }}
    />
  </>
);

// 에러 메시지 컴포넌트
interface ErrorMessageProps {
  error: string;
}

const ErrorMessage = ({ error }: ErrorMessageProps) => (
  error && <p role="alert">{error}</p>
);

// 추가 버튼 컴포넌트
const AdditionalButtons = () => (
  <div className="additional-buttons">
    <Link to="/signup">회원가입</Link>
    <Link to="/forgotpw">비밀번호 찾기</Link>
  </div>
);

// 로그인 폼 컴포넌트
interface LoginFormProps {
  username: string;
  password: string;
  error: string;
  onUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm = ({
  username,
  password,
  error,
  onUserNameChange,
  onPasswordChange,
  onSubmit
}: LoginFormProps) => (
  <form onSubmit={onSubmit}>
    <InputField
      type="text"
      name="userName"
      label="이메일 주소를 입력해주세요."
      value={username}
      onChange={onUserNameChange}
      placeholder="이메일"
    />
    <InputField
      type="password"
      name="userPassword"
      label="비밀번호를 입력해주세요."
      value={password}
      onChange={onPasswordChange}
      placeholder="비밀번호"
    />
    <ErrorMessage error={error} />
    <input type="submit" value="로그인" style={{ color: '#000000' }} />
  </form>
);

function Login() {
  const [username, setUserName] = useState('');
  const [password, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [logoutMessage, setLogoutMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const logout = params.get('logout');
    if (logout) {
      // 로그아웃 API 호출
      const handleLogout = async () => {
        try {
          await axios.post('/logout');
          localStorage.removeItem('token');
          setLogoutMessage('로그아웃되었습니다.');
        } catch (err) {
          if (axios.isAxiosError(err) && err.response) {
            setLogoutMessage('로그아웃 중 오류가 발생했습니다.');
            console.error('로그아웃 오류:', err.response.data);
          } else {
            setLogoutMessage('서버에 연결할 수 없습니다.');
          }
        }
      };
      handleLogout();
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setUserName(email);
    if (email && !validateEmail(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(username)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:8080/login',
        { username, password },
        { withCredentials: true }
      );
      const token = response.data.token;
      console.log("Login 성공! 받은 토큰:", token);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      alert('로그인 성공!');
      navigate('/mypage');
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || '로그인 실패. 다시 시도해주세요.');
      } else {
        setError('서버에 연결할 수 없습니다.');
      }
    }
  };

  return (
    <Layout>
      <div className="login-container" role="main">
        <div className="login-wrapper">
          <LoginHeader />
          {logoutMessage && <p className="logout-message" role="status">{logoutMessage}</p>}
          <LoginForm
            username={username}
            password={password}
            error={error || emailError}
            onUserNameChange={handleEmailChange}
            onPasswordChange={(e) => setUserPassword(e.target.value)}
            onSubmit={handleSubmit}
          />
          <button 
            className="kakao-login-btn" 
            onClick={() => alert('카카오 로그인 시도')}
            style={{ color: '#000000' }}
          >
            카카오 로그인
          </button>
          <AdditionalButtons />
        </div>
      </div>
    </Layout>
  );
}

export default Login;
