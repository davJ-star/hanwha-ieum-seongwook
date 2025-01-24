import React, { useState } from 'react';
import '../styles/pages/signup.css'; // 스타일 파일 추가
import Layout from '../components/Layout/Layout';

// 입력 그룹 컴포넌트
interface InputGroupProps {
  id: string;
  title: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  onButtonClick?: () => void;
  buttonText?: string;
}

const InputGroup = ({
  id,
  title,
  type,
  value,
  onChange,
  placeholder,
  onButtonClick,
  buttonText
}: InputGroupProps) => (
  <div role="group" aria-labelledby={id}>
    <h4 id={id}>{title}</h4>
    <div className="input-group">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-required="true"
        aria-label={placeholder}
        style={{ color: '#000000' }}
      />
      {buttonText && onButtonClick && (
        <button 
          onClick={onButtonClick}
          type="button"
          aria-label={buttonText}
        >
          {buttonText}
        </button>
      )}
    </div>
  </div>
);

// 회원가입 폼 컴포넌트
interface SignupFormProps {
  email: string;
  verificationCode: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerificationCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendCode: () => void;
  onVerifyCode: () => void;
  onSignup: () => void;
}

const SignupForm = ({
  email,
  verificationCode,
  password,
  onEmailChange,
  onVerificationCodeChange,
  onPasswordChange,
  onSendCode,
  onVerifyCode,
  onSignup
}: SignupFormProps) => (
  <form role="form" aria-labelledby="signupTitle">
    <InputGroup
      id="emailTitle"
      title="이메일"
      type="email"
      value={email}
      onChange={onEmailChange}
      placeholder="이메일 주소"
      onButtonClick={onSendCode}
      buttonText="인증코드 받기"
    />

    <InputGroup
      id="verificationTitle"
      title="인증코드"
      type="text"
      value={verificationCode}
      onChange={onVerificationCodeChange}
      placeholder="인증코드 입력"
      onButtonClick={onVerifyCode}
      buttonText="확인"
    />

    <InputGroup
      id="passwordTitle"
      title="비밀번호"
      type="password"
      value={password}
      onChange={onPasswordChange}
      placeholder="비밀번호"
    />
    
    <button 
      className="signup-button"
      onClick={onSignup}
      type="submit"
      aria-label="가입하기"
    >
      가입하기
    </button>
  </form>
);

const Signup = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSendCode = () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    alert('인증 코드가 이메일로 전송되었습니다.');
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      alert('인증 코드를 입력해주세요.');
      return;
    }
    alert('인증이 완료되었습니다.');
  };

  const handleSignup = () => {
    if (!email || !verificationCode || !password) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    alert('회원가입이 완료되었습니다.');
  };

  return (
    <Layout>
      <div className="signup-page" role="main">
        <div className="signup-container">
          <h2 id="signupTitle">회원가입</h2>
          <SignupForm
            email={email}
            verificationCode={verificationCode}
            password={password}
            onEmailChange={(e) => setEmail(e.target.value)}
            onVerificationCodeChange={(e) => setVerificationCode(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSendCode={handleSendCode}
            onVerifyCode={handleVerifyCode}
            onSignup={handleSignup}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Signup;