interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

const Header = ({ isLoggedIn, onLogout, onNavigate }: HeaderProps) => {
  return (
    <header className="logo-header" role="banner">
      <h3>MediLink</h3>
      <div className="user-menu" role="navigation" aria-label="사용자 메뉴">
        {isLoggedIn ? (
          <>
            <div className="user-menu-links">
              <a 
                onClick={() => onNavigate('/MemberInfo')} 
                aria-label="회원관리로 이동"
              >
                회원관리
              </a>
              <span className="separator">|</span>
              <a 
                onClick={() => onNavigate('/Mypage')} 
                aria-label="마이페이지로 이동"
              >
                마이페이지
              </a>
            </div>
            <button 
              onClick={onLogout} 
              aria-label="로그아웃"
            >
              로그아웃
            </button>
          </>
        ) : (
          <a 
            onClick={() => onNavigate('/login')} 
            aria-label="로그인 페이지로 이동"
          >
            로그인
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
