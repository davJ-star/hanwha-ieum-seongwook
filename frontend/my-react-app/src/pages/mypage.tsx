import React, { useState } from 'react';
import './Mypage.css'; // 스타일 파일 추가

const Mypage = () => {
  const [name, setName] = useState('홍길동');
  const [phone, setPhone] = useState('010-1234-5678');
  const [email, setEmail] = useState('hongildong@example.com');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

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

  const handleSave = () => {
    // 저장 로직 추가
    alert('회원 정보가 저장되었습니다.');
  };

  return (
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
          <label>
            새 비밀번호
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
        )}
      </div>

      {/* 저장 및 회원 탈퇴 */}
      <div className="actions">
        <button onClick={handleSave}>저장</button>
        <button className="delete-account">회원 탈퇴</button>
      </div>
    </div>
  );
};

export default Mypage;
