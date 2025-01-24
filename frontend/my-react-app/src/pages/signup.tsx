import React, { useState } from 'react';
import './signup.css'; // 스타일 파일 추가
import Layout from '../components/Layout';

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
          <form role="form" aria-labelledby="signupTitle">
            <div role="group" aria-labelledby="emailTitle">
              <h4 id="emailTitle">이메일</h4>
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                  aria-required="true"
                  aria-label="이메일 주소 입력"
                />
                <button 
                  onClick={handleSendCode}
                  type="button"
                  aria-label="인증코드 받기"
                >
                  인증코드 받기
                </button>
              </div>
            </div>

            <div role="group" aria-labelledby="verificationTitle">
              <h4 id="verificationTitle">인증코드</h4>
              <div className="input-group">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="인증코드 입력"
                  aria-required="true"
                  aria-label="인증코드 입력"
                />
                <button 
                  onClick={handleVerifyCode}
                  type="button"
                  aria-label="인증코드 확인"
                >
                  확인
                </button>
              </div>
            </div>

            <div role="group" aria-labelledby="passwordTitle">
              <h4 id="passwordTitle">비밀번호</h4>
              <div className="input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  aria-required="true"
                  aria-label="비밀번호 입력"
                />
              </div>
            </div>
            
            <button 
              className="signup-button"
              onClick={handleSignup}
              type="submit"
              aria-label="가입하기"
            >
              가입하기
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;