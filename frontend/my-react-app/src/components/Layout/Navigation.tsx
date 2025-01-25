interface NavigationProps {
  onNavigate: (path: string) => void;
}

const Navigation = ({ onNavigate }: NavigationProps) => {
  return (
    <nav className="navbar" role="navigation" aria-label="메인 메뉴">
      <h4 className="shortcut-guide">단축키 안내</h4>
      <a href="#search" aria-label="정보 검색">
        <span className="shortcut-guide">① </span>
        정보 검색
      </a>
      <a href="#medications" aria-label="복용약 관리">
        <span className="shortcut-guide">② </span>
        복용약 관리
      </a>
      <a 
        onClick={() => onNavigate('/FADsearch')} 
        aria-label="허위광고 판별"
      >
        <span className="shortcut-guide">③ </span>
        허위광고 판별
      </a>
    </nav>
  );
};

export default Navigation;
