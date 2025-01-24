import React, { useState } from 'react';
import './forgotpw.css';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

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
            <form onSubmit={handleSubmit} aria-labelledby="pageTitle">
              <div className="form-group" role="group" aria-labelledby="nameLabel">
                <label id="nameLabel" htmlFor="name">이름</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  required
                  aria-required="true"
                />
              </div>
              <div className="form-group" role="group" aria-labelledby="emailLabel">
                <label id="emailLabel" htmlFor="email">이메일</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="가입시 등록한 이메일을 입력하세요"
                  required
                  aria-required="true"
                />
              </div>
              <button type="submit" className="submit-button" aria-label="비밀번호 찾기 요청하기">
                비밀번호 찾기
              </button>
            </form>
            {message && <p className="message" role="alert" aria-live="polite">{message}</p>}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ForgotPassword;
