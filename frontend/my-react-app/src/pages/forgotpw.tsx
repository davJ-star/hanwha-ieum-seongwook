import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/forgotpw.css';
import Layout from '../components/Layout/Layout';
import { Link } from 'react-router-dom';

// 입력 필드 컴포넌트
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField = ({ 
  id, 
  label, 
  type, 
  value, 
  onChange, 
  placeholder 
}: InputFieldProps) => (
  <div className="form-group" role="group" aria-labelledby={`${id}Label`}>
    <label id={`${id}Label`} htmlFor={id} style={{ color: '#000000' }}>{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      aria-required="true"
      style={{ color: '#000000' }}
    />
  </div>
);

// 메시지 컴포넌트
interface MessageProps {
  message: string;
}

const Message = ({ message }: MessageProps) => (
  message && (
    <p 
      className="message" 
      role="alert" 
      aria-live="polite"
    >
      {message}
    </p>
  )
);

// 비밀번호 찾기 폼 컴포넌트
interface ForgotPasswordFormProps {
  name: string;
  email: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ForgotPasswordForm = ({
  name,
  email,
  onNameChange,
  onEmailChange,
  onSubmit
}: ForgotPasswordFormProps) => (
  <form onSubmit={onSubmit} aria-labelledby="pageTitle">
    <InputField
      id="name"
      label="이름"
      type="text"
      value={name}
      onChange={onNameChange}
      placeholder="이름을 입력하세요"
    />
    <InputField
      id="email"
      label="이메일"
      type="email"
      value={email}
      onChange={onEmailChange}
      placeholder="가입시 등록한 이메일을 입력하세요"
    />
    <button 
      type="submit" 
      className="submit-button" 
      aria-label="비밀번호 찾기 요청하기"
    >
      비밀번호 찾기
    </button>
  </form>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 사용자 인증 API 호출 (테스트 전)
      const response = await axios.post(`/*추후 추가 예정*/`, {
        name,
        email
      }).catch(() => ({ data: { success: false } }));

      if (response.data.success) {
        setIsVerified(true);
        setMessage('사용자 인증이 완료되었습니다. 새로운 비밀번호를 입력해주세요.');
      } else {
        setMessage('이름 또는 이메일이 일치하지 않습니다.');
      }
    } catch (error) {
      setMessage('사용자 인증 중 오류가 발생했습니다.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 비밀번호 변경 API 호출 (테스트 전)
      const response = await axios.post(`/{id}/mypage/password`, {
        email,
        newPassword
      }).catch(() => ({ data: { success: false } }));

      if (response.data.success) {
        setMessage('비밀번호가 성공적으로 변경되었습니다.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage('비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      setMessage('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <Layout>
      <main className="forgot-password-wrapper" role="main">
        <div className="forgot-password-container">
          <h1 id="pageTitle">비밀번호 찾기</h1>
          <div className="forgot-password-form">
            {!isVerified ? (
              <ForgotPasswordForm
                name={name}
                email={email}
                onNameChange={(e) => setName(e.target.value)}
                onEmailChange={(e) => setEmail(e.target.value)}
                onSubmit={handleVerify}
              />
            ) : (
              <form onSubmit={handlePasswordChange} aria-labelledby="resetPasswordTitle">
                <h2 id="resetPasswordTitle">새 비밀번호 설정</h2>
                <InputField
                  id="newPassword"
                  label="새 비밀번호"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                />
                <InputField
                  id="confirmPassword"
                  label="새 비밀번호 확인"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
                <button 
                  type="submit" 
                  className="submit-button"
                  aria-label="비밀번호 변경하기"
                >
                  비밀번호 변경
                </button>
              </form>
            )}
            <Message message={message} />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ForgotPassword;
