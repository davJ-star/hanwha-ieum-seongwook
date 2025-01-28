import React, { useState } from 'react';
import '../styles/pages/signup.css'; // 스타일 파일 추가
import Layout from '../components/Layout/Layout';
import { FaUpload } from 'react-icons/fa'; // 아이콘 추가

//테스트 전

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
  profileImage: string;
  nickname: string;
  email: string;
  verificationCode: string;
  password: string;
  passwordConfirm: string;
  onProfileImageChange: (image: string) => void;
  onNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerificationCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordConfirmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendCode: () => void;
  onVerifyCode: () => void;
  onSignup: () => void;
}

const SignupForm = ({
  profileImage,
  nickname,
  email,
  verificationCode,
  password,
  passwordConfirm,
  onProfileImageChange,
  onNicknameChange,
  onEmailChange,
  onVerificationCodeChange,
  onPasswordChange,
  onPasswordConfirmChange,
  onSendCode,
  onVerifyCode,
  onSignup
}: SignupFormProps) => (
  <form role="form" aria-labelledby="signupTitle">
    <div className="profile-section" aria-label="커뮤니티 프로필">
      <div className="profile-image-container" role="img" aria-label="프로필 이미지">
        <img 
          src={profileImage || '/images/profile.png'} 
          alt="프로필 사진" 
          className="profile-image"
        />
        <label className="upload-button" role="button" aria-label="프로필 사진 업로드">
          <FaUpload />
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  onProfileImageChange(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="visually-hidden"
          />
        </label>
      </div>
      
      <InputGroup
        id="nicknameTitle"
        title="닉네임"
        type="text"
        value={nickname}
        onChange={onNicknameChange}
        placeholder="닉네임을 입력하세요"
      />
    </div>

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

    <InputGroup
      id="passwordConfirmTitle"
      title="비밀번호 재확인"
      type="password"
      value={passwordConfirm}
      onChange={onPasswordConfirmChange}
      placeholder="비밀번호 재확인"
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
  const [profileImage, setProfileImage] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
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
    if (!email || !verificationCode || !password || !passwordConfirm || !nickname) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
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
            profileImage={profileImage}
            nickname={nickname}
            email={email}
            verificationCode={verificationCode}
            password={password}
            passwordConfirm={passwordConfirm}
            onProfileImageChange={setProfileImage}
            onNicknameChange={(e) => setNickname(e.target.value)}
            onEmailChange={(e) => setEmail(e.target.value)}
            onVerificationCodeChange={(e) => setVerificationCode(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onPasswordConfirmChange={(e) => setPasswordConfirm(e.target.value)}
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