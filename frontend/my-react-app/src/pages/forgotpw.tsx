import React, { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 비밀번호 찾기 로직 구현
    setMessage('입력하신 이메일로 비밀번호 재설정 링크가 전송되었습니다.');
  };

  return (
    <Layout>
      <main className="forgot-password-wrapper" role="main">
        <div className="forgot-password-container">
          <h1 id="pageTitle">비밀번호 찾기</h1>
          <div className="forgot-password-form">
            <ForgotPasswordForm
              name={name}
              email={email}
              onNameChange={(e) => setName(e.target.value)}
              onEmailChange={(e) => setEmail(e.target.value)}
              onSubmit={handleSubmit}
            />
            <Message message={message} />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ForgotPassword;
