import React, { useState } from 'react';
import './Mypage.css'; // 스타일 파일 추가
import { FaSearch } from 'react-icons/fa';
import { FaUniversalAccess } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AccessibilityModal from '../components/AccessibilityModal';

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
    <div>
      {/* 상단 로고 및 회원관리 */}
      <header className="logo-header">
        <h3>MediLink</h3>
        <div className="user-menu">
          <a onClick={() => navigate('/mypage')}>회원관리 | 마이페이지</a>
        </div>
      </header>

      {/* 단축키 안내 */}
      <header className="navbar">
        <h3>단축키 안내</h3>
        <a href="#search">① 정보 검색</a>
        <a href="#medications">② 복용약 관리</a>
        <a href="#ads">③ 허위광고 판별</a>
        <a onClick={() => navigate('/login')}>④ 로그인</a>
      </header>

      <div className="mypage-wrapper">
        <h2>회원정보 수정</h2>
        <p>전화번호와 이메일 주소를 수정하거나 비밀번호를 재설정할 수 있어요.</p>

        {/* 개인정보 수정 */}
        <div className="section">
          <h3>개인정보 수정</h3>
          <label>
            이름
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            전화번호
            <div className="input-group">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isPhoneVerified}
              />
              <button onClick={handlePhoneVerify}>인증</button>
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="인증번호 입력"
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                disabled={isPhoneVerified}
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
              >
                확인
              </button>
            </div>
          </label>
          <label>
            이메일
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailVerified}
              />
              <button onClick={handleEmailVerify}>인증</button>
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="인증번호 입력"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
                disabled={isEmailVerified}
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
              >
                확인
              </button>
            </div>
          </label>
        </div>

        {/* 비밀번호 재설정 */}
        <div className="section">
          <h3>비밀번호 재설정</h3>
          <label>
            현재 비밀번호
            <div className="input-group">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button onClick={handlePasswordVerify}>확인</button>
            </div>
          </label>
          {isPasswordValid && (
            <>
            {/*현재 비밀번호 입력 후 확인되어야 새 비밀번호 입력 로직이 뜸*/}
              <label>
                새 비밀번호
                <div className="input-group">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="8자 이상 입력해주세요"
                  />
                </div>
              </label>
              <label>
                새 비밀번호 확인
                <div className="input-group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호를 다시 입력해주세요"
                  />
                  <button onClick={handleConfirmNewPassword}>확인</button>
                </div>
              </label>
              {passwordError && <p style={{ color: 'red', fontSize: '14px' }}>{passwordError}</p>}
            </>
          )}
        </div>

        {/* 저장 및 회원 탈퇴 */}
        <div className="actions">
          <button onClick={handleSave}>저장</button>
          <button 
            className="delete-account" 
            onClick={() => navigate('/secession')}
          >
            회원 탈퇴
          </button>
        </div>

        <div className="floating-buttons">
          <button 
            className="floating-button round"
            onClick={() => handleZoom('in')}
            title="화면 확대"
          >
            <FaSearch />
            <span>확대</span>
          </button>
          <button 
            className="floating-button round"
            onClick={() => handleZoom('out')}
            title="화면 축소"
          >
            <FaSearch />
            <span>축소</span>
          </button>
          <button 
            className="floating-button accessibility-button"
            onClick={() => setIsModalOpen(true)}
            title="접근성 기능 가이드"
            style={{ backgroundColor: '#00ff00' }}
          >
            <FaUniversalAccess />
            <span>접근성 기능 가이드라인</span>
          </button>
        </div>

      </div>

      <AccessibilityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Mypage;
