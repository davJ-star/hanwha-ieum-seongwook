import React, { useState } from 'react';
import './Mypage.css'; // 스타일 파일 추가
import { FaSearch } from 'react-icons/fa';
import { FaUniversalAccess } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AccessibilityModal from '../components/AccessibilityModal';
import Layout from '../components/Layout';

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

          <section className="section" aria-labelledby="personalInfoTitle">
            <h3 id="personalInfoTitle">개인정보 수정</h3>
            <div role="form">
              <label id="nameLabel">
                이름
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  aria-labelledby="nameLabel"
                  style={{ color: '#000000' }}
                />
              </label>
              <label id="phoneLabel">
                전화번호
                <div className="input-group">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isPhoneVerified}
                    aria-labelledby="phoneLabel"
                  />
                  <button onClick={handlePhoneVerify} aria-label="전화번호 인증하기">인증</button>
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="인증번호 입력"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    disabled={isPhoneVerified}
                    aria-label="전화번호 인증번호 입력"
                  />
                  <button
                    onClick={() => {
                      // 인증 로직 추가
                      if (phoneCode === '123456') {
                        setIsPhoneVerified(true);
                        alert('전화번호 인증이 완료되었습니다.');
                      } else {
                        alert('인증번호가 일치하지 않습니다.');
                      }
                    }}
                    style={{ color: '#000' }}
                    aria-label="인증번호 확인"
                  >
                    확인
                  </button>
                </div>
              </label>
              <label id="emailLabel">
                이메일
                <div className="input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isEmailVerified}
                    aria-labelledby="emailLabel"
                  />
                  <button onClick={handleEmailVerify} aria-label="이메일 인증하기">인증</button>
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="인증번호 입력"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    disabled={isEmailVerified}
                    aria-label="이메일 인증번호 입력"
                  />
                  <button
                    onClick={() => {
                      // 인증 로직 추가
                      if (emailCode === '654321') {
                        setIsEmailVerified(true);
                        alert('이메일 인증이 완료되었습니다.');
                      } else {
                        alert('인증번호가 일치하지 않습니다.');
                      }
                    }}
                    style={{ color: '#000' }}
                    aria-label="인증번호 확인"
                  >
                    확인
                  </button>
                </div>
              </label>
            </div>
          </section>

          <section className="section" aria-labelledby="passwordTitle">
            <h3 id="passwordTitle">비밀번호 재설정</h3>
            <div role="form">
              <label id="currentPwLabel">
                현재 비밀번호
                <div className="input-group">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    aria-labelledby="currentPwLabel"
                  />
                  <button onClick={handlePasswordVerify} aria-label="현재 비밀번호 확인">확인</button>
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
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="8자 이상 입력해주세요"
                        aria-labelledby="newPwLabel"
                      />
                    </div>
                  </label>
                  <label id="confirmPwLabel">
                    새 비밀번호 확인
                    <div className="input-group">
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="새 비밀번호를 다시 입력해주세요"
                        aria-labelledby="confirmPwLabel"
                      />
                      <button onClick={handleConfirmNewPassword} aria-label="새 비밀번호 확인">확인</button>
                    </div>
                  </label>
                  {passwordError && <p role="alert" aria-live="polite">{passwordError}</p>}
                </>
              )}
            </div>
          </section>

          <div className="actions" role="group" aria-label="회원 정보 관리">
            <button onClick={handleSave} aria-label="변경사항 저장">저장</button>
            <button 
              className="delete-account" 
              onClick={() => navigate('/secession')}
              aria-label="회원 탈퇴 페이지로 이동"
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
