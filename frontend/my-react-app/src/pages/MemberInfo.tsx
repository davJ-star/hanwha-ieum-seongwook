// export default MemberInfo;
import React, { useState } from 'react';
import '../styles/pages/MemberInfo.css';
// import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout/Layout';
import axios from 'axios';

// 입력 필드 컴포넌트 (이미 알고 계신 구성)
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
      style={{ color: '#000000', display: 'block' }}
    />
  </label>
);

// 인증 버튼 컴포넌트
interface VerifyButtonProps {
  onClick: () => void;
  label: string;
}

const VerifyButton = ({ onClick, label }: VerifyButtonProps) => (
  <button onClick={onClick} aria-label={label} style={{ color: '#000000' }}>
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
    <button onClick={onVerify} style={{ color: '#000000' }} aria-label="인증번호 확인">
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
  // phone,
  email,
  // phoneCode,
  emailCode,
  // isPhoneVerified,
  isEmailVerified,
  onNameChange,
  // onPhoneChange,
  onEmailChange,
  // onPhoneCodeChange,
  onEmailCodeChange,
  // onPhoneVerify,
  onEmailVerify,
  // onPhoneCodeVerify,
  onEmailCodeVerify
}: PersonalInfoSectionProps) => (
  <section className="section" aria-labelledby="personalInfoTitle">
    <h3 id="personalInfoTitle">개인정보 수정</h3>
    <div role="form">

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

// MemberInfo 페이지 컴포넌트
const MemberInfo = () => {
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

  const handleEmailVerify = async () => {
    try {
      const response = await axios.post('/api/email/send-verification', {
        email: email
      });
      
      if (response.status === 200) {
        alert('이메일로 인증번호가 발송되었습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '인증번호 발송에 실패했습니다.');
      }
    }
  };

  const handleEmailCodeVerify = async () => {
    try {
      const response = await axios.post('/api/email/verify', {
        email: email,
        verificationCode: emailCode
      });
      
      if (response.status === 200) {
        setIsEmailVerified(true);
        alert('이메일이 성공적으로 변경되었습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '인증번호가 일치하지 않습니다.');
      }
    }
  };

  const handleNameUpdate = async () => {
    try {
      const response = await axios.put('/*추후추가예정*/', {
        name: name
      });
      
      if (response.status === 200) {
        alert('이름이 성공적으로 변경되었습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '이름 변경에 실패했습니다.');
      }
    }
  };

  const handlePasswordVerify = async () => {
    try {
      const response = await axios.post('/*추후추가예정*/', {
        currentPassword: currentPassword
      });
      
      if (response.status === 200) {
        setIsPasswordValid(true);
        alert('비밀번호가 확인되었습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsPasswordValid(false);
        alert(error.response?.data?.message || '현재 비밀번호가 일치하지 않습니다.');
      }
    }
  };

  const handleConfirmNewPassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    
    try {
      const response = await axios.post('/{id}/mypage/password', {
        currentPassword: currentPassword,
        newPassword: newPassword
      });
      
      if (response.status === 200) {
        setPasswordError('');
        alert('비밀번호가 성공적으로 변경되었습니다.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsPasswordValid(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setPasswordError(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
      }
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (confirmDelete) {
      try {
        const response = await axios.delete('/{id}/mypage/delete');
        if (response.status === 200) {
          alert('회원 탈퇴가 완료되었습니다.');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data?.message || '회원 탈퇴에 실패했습니다.');
        }
      }
    }
  };

  const handleSave = async () => {
    try {
      if (name) {
        await handleNameUpdate();
      }
      alert('모든 변경사항이 저장되었습니다.');
    } catch (error) {
      console.log(error.response);
      alert('변경사항 저장에 실패했습니다.');
    }
  };

  // const handleZoom = (zoomType: string) => {
  //   const currentZoom = document.body.style.zoom ? parseFloat(document.body.style.zoom) : 1;
  //   if (zoomType === 'in') document.body.style.zoom = (currentZoom + 0.1).toString();
  //   if (zoomType === 'out') document.body.style.zoom = (currentZoom - 0.1).toString();
  // };

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
            onEmailCodeVerify={handleEmailCodeVerify}
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
              onClick={handleDeleteAccount}
              aria-label="회원 탈퇴"
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

export default MemberInfo;
