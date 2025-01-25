import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      role="contentinfo" 
      className="footer"
      style={{
        backgroundColor: '#F2F2DF',
        padding: '2rem',
        marginTop: 'auto'
      }}
    >
      <div className="footer-content">
        <nav aria-label="푸터 내비게이션">
          <ul className="footer-links">
            <li><a href="/about">회사 소개</a></li>
            <li><a href="/terms">이용약관</a></li>
            <li><a href="/privacy">개인정보처리방침</a></li>
          </ul>
        </nav>
        <p className="copyright">
          © {currentYear} 웹사이트명. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 