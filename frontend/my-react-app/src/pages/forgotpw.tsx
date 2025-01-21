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
      <div className="forgot-password-wrapper">
        <div className="forgot-password-container">
          <h1>비밀번호 찾기</h1>
          <div className="forgot-password-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">이메일</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="가입시 등록한 이메일을 입력하세요"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                비밀번호 찾기
              </button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
