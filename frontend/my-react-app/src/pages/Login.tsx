import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import '../styles/pages/Login.css';
import AccessibilityModal from '../components/AccessibilityModal';
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
  userName: string;
  userPassword: string;
  error: string;
  onUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm = ({
  userName,
  userPassword,
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
      value={userName}
      onChange={onUserNameChange}
      placeholder="이메일"
    />
    <InputField
      type="password"
      name="userPassword"
      label="비밀번호를 입력해주세요."
      value={userPassword}
      onChange={onPasswordChange}
      placeholder="비밀번호"
    />
    <ErrorMessage error={error} />
    <input type="submit" value="로그인" style={{ color: '#000000' }} />
  </form>
);

function Login() {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://your-backend-url.com/api/login', {
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
          <LoginHeader />
          <LoginForm
            userName={userName}
            userPassword={userPassword}
            error={error}
            onUserNameChange={(e) => setUserName(e.target.value)}
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
