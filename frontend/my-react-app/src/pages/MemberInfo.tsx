import React, { useState } from 'react';
import '../styles/pages/MemberInfo.css'; // 스타일 파일 추가
import { FaSearch } from 'react-icons/fa';
import { FaUniversalAccess } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';

// 입력 필드 컴포넌트
interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
}

const InputField = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder
}: InputFieldProps) => (
  <label id={id}>
    {label}
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-labelledby={id}
      placeholder={placeholder}
      style={{ color: '#000000' }}
    />
  </label>
);

// 인증 버튼 컴포넌트
interface VerifyButtonProps {
  onClick: () => void;
  label: string;
}

const VerifyButton = ({ onClick, label }: VerifyButtonProps) => (
  <button 
    onClick={onClick} 
    aria-label={label}
    style={{ color: '#000000' }}
  >
    인증
  </button>
);

// 인증 입력 필드 컴포넌트
interface VerificationInputGroupProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  disabled: boolean;
  type: string;
}

const VerificationInputGroup = ({
  value,
  onChange,
  onVerify,
  disabled,
  type
}: VerificationInputGroupProps) => (
  <div className="input-group">
    <input
      type="text"
      placeholder="인증번호 입력"
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-label={`${type} 인증번호 입력`}
      style={{ color: '#000000' }}
    />
    <button
      onClick={onVerify}
      style={{ color: '#000' }}
      aria-label="인증번호 확인"
    >
      확인
    </button>
  </div>
);

// 개인정보 수정 섹션 컴포넌트
interface PersonalInfoSectionProps {
  name: string;
  phone: string;
  email: string;
  phoneCode: string;
  emailCode: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneVerify: () => void;
  onEmailVerify: () => void;
  onPhoneCodeVerify: () => void;
  onEmailCodeVerify: () => void;
}

const PersonalInfoSection = ({
  name,
  phone,
  email,
  phoneCode,
  emailCode,
  isPhoneVerified,
  isEmailVerified,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onPhoneCodeChange,
  onEmailCodeChange,
  onPhoneVerify,
  onEmailVerify,
  onPhoneCodeVerify,
  onEmailCodeVerify
}: PersonalInfoSectionProps) => (
  <section className="section" aria-labelledby="personalInfoTitle">
    <h3 id="personalInfoTitle">개인정보 수정</h3>
    <div role="form">
      <InputField
        id="nameLabel"
        label="이름"
        value={name}
        onChange={onNameChange}
      />
      <label id="phoneLabel">
        전화번호
        <div className="input-group">
          <input
            type="text"
            value={phone}
            onChange={onPhoneChange}
            disabled={isPhoneVerified}
            aria-labelledby="phoneLabel"
            style={{ color: '#000000' }}
          />
          <VerifyButton onClick={onPhoneVerify} label="전화번호 인증하기" />
        </div>
        <VerificationInputGroup
          value={phoneCode}
          onChange={onPhoneCodeChange}
          onVerify={onPhoneCodeVerify}
          disabled={isPhoneVerified}
          type="전화번호"
        />
      </label>
      <label id="emailLabel">
        이메일
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            disabled={isEmailVerified}
            aria-labelledby="emailLabel"
            style={{ color: '#000000' }}
          />
          <VerifyButton onClick={onEmailVerify} label="이메일 인증하기" />
        </div>
        <VerificationInputGroup
          value={emailCode}
          onChange={onEmailCodeChange}
          onVerify={onEmailCodeVerify}
          disabled={isEmailVerified}
          type="이메일"
        />
      </label>
    </div>
  </section>
);

// 비밀번호 재설정 섹션 컴포넌트
interface PasswordSectionProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError: string;
  isPasswordValid: boolean;
  onCurrentPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordVerify: () => void;
  onConfirmNewPassword: () => void;
}

const PasswordSection = ({
  currentPassword,
  newPassword,
  confirmPassword,
  passwordError,
  isPasswordValid,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onPasswordVerify,
  onConfirmNewPassword
}: PasswordSectionProps) => (
  <section className="section" aria-labelledby="passwordTitle">
    <h3 id="passwordTitle">비밀번호 재설정</h3>
    <div role="form">
      <label id="currentPwLabel">
        현재 비밀번호
        <div className="input-group">
          <input
            type="password"
            value={currentPassword}
            onChange={onCurrentPasswordChange}
            aria-labelledby="currentPwLabel"
            style={{ color: '#000000' }}
          />
          <button 
            onClick={onPasswordVerify} 
            aria-label="현재 비밀번호 확인"
            style={{ color: '#000000' }}
          >
            확인
          </button>
        </div>
      </label>
      {isPasswordValid && (
        <>
          <label id="newPwLabel">
            새 비밀번호
            <div className="input-group">
              <input
                type="password"
                value={newPassword}
                onChange={onNewPasswordChange}
                placeholder="8자 이상 입력해주세요"
                aria-labelledby="newPwLabel"
                style={{ color: '#000000' }}
              />
            </div>
          </label>
          <label id="confirmPwLabel">
            새 비밀번호 확인
            <div className="input-group">
              <input
                type="password"
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
                placeholder="새 비밀번호를 다시 입력해주세요"
                aria-labelledby="confirmPwLabel"
                style={{ color: '#000000' }}
              />
              <button 
                onClick={onConfirmNewPassword} 
                aria-label="새 비밀번호 확인"
                style={{ color: '#000000' }}
              >
                확인
              </button>
            </div>
          </label>
          {passwordError && <p role="alert" aria-live="polite">{passwordError}</p>}
        </>
      )}
    </div>
  </section>
);

const Mypage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('홍길동');
  const [phone, setPhone] = useState('010-1234-5678');
  const [email, setEmail] = useState('hongildong@example.com');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePhoneVerify = () => {
    alert('문자메시지로 인증번호가 발송되었습니다.');
    // 인증번호 발송 로직 추가
  };

  const handleEmailVerify = () => {
    alert('이메일로 인증번호가 발송되었습니다.');
    // 이메일 인증번호 발송 로직 추가
  };

  const handlePasswordVerify = () => {
    // 현재 비밀번호 확인 로직 추가
    if (currentPassword === 'your_current_password') {
      setIsPasswordValid(true);
      alert('비밀번호가 확인되었습니다.');
    } else {
      setIsPasswordValid(false);
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleConfirmNewPassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    setPasswordError('');
    alert('새 비밀번호가 설정되었습니다.');
  };

  const handleSave = () => {
    // 저장 로직 추가
    alert('회원 정보가 저장되었습니다.');
  };

  const handleZoom = (zoomType: string) => {
    const currentZoom = document.body.style.zoom ? parseFloat(document.body.style.zoom) : 1;
    if (zoomType === 'in') document.body.style.zoom = (currentZoom + 0.1).toString();
    if (zoomType === 'out') document.body.style.zoom = (currentZoom - 0.1).toString();
  };

  return (
    <Layout>
      <div role="main">
        <div className="mypage-wrapper">
          <h2 id="pageTitle">회원정보 수정</h2>
          <p>전화번호와 이메일 주소를 수정하거나 비밀번호를 재설정할 수 있어요.</p>

          <PersonalInfoSection
            name={name}
            phone={phone}
            email={email}
            phoneCode={phoneCode}
            emailCode={emailCode}
            isPhoneVerified={isPhoneVerified}
            isEmailVerified={isEmailVerified}
            onNameChange={(e) => setName(e.target.value)}
            onPhoneChange={(e) => setPhone(e.target.value)}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPhoneCodeChange={(e) => setPhoneCode(e.target.value)}
            onEmailCodeChange={(e) => setEmailCode(e.target.value)}
            onPhoneVerify={handlePhoneVerify}
            onEmailVerify={handleEmailVerify}
            onPhoneCodeVerify={() => {
              if (phoneCode === '123456') {
                setIsPhoneVerified(true);
                alert('전화번호 인증이 완료되었습니다.');
              } else {
                alert('인증번호가 일치하지 않습니다.');
              }
            }}
            onEmailCodeVerify={() => {
              if (emailCode === '654321') {
                setIsEmailVerified(true);
                alert('이메일 인증이 완료되었습니다.');
              } else {
                alert('인증번호가 일치하지 않습니다.');
              }
            }}
          />

          <PasswordSection
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            passwordError={passwordError}
            isPasswordValid={isPasswordValid}
            onCurrentPasswordChange={(e) => setCurrentPassword(e.target.value)}
            onNewPasswordChange={(e) => setNewPassword(e.target.value)}
            onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
            onPasswordVerify={handlePasswordVerify}
            onConfirmNewPassword={handleConfirmNewPassword}
          />

          <div className="actions" role="group" aria-label="회원 정보 관리">
            <button onClick={handleSave} aria-label="변경사항 저장">저장</button>
            <button 
              className="delete-account" 
              onClick={() => navigate('/secession')}
              aria-label="회원 탈퇴 페이지로 이동"
              style={{ color: '#000000' }}
            >
              회원 탈퇴
            </button>
          </div>
        </div>

        <AccessibilityModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default Mypage;
