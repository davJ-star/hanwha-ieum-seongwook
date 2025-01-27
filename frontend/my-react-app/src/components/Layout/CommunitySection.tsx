import React from 'react';
import { 
  FaWheelchair, 
  FaBrain, 
  FaEye, 
  FaDeaf, 
  FaCommentSlash, 
  FaLaugh, 
  FaHeart 
} from 'react-icons/fa';
import { GiBrain as FaBrainAlt } from 'react-icons/gi';
import './CommunitySection.css';

interface CommunityItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const communityItems: CommunityItem[] = [
  { id: 'pdc', label: '지체장애', path: '/PDCcommu', icon: <FaWheelchair /> },
  { id: 'bld', label: '뇌병변장애', path: '/BLDcommu', icon: <FaBrain /> },
  { id: 'vi', label: '시각장애', path: '/VIcommu', icon: <FaEye /> },
  { id: 'hi', label: '청각장애', path: '/HIcommu', icon: <FaDeaf /> },
  { id: 'si', label: '언어장애', path: '/SIcommu', icon: <FaCommentSlash /> },
  { id: 'fd', label: '안면장애', path: '/FDcommu', icon: <FaLaugh /> },
  { id: 'iod', label: '내부기관장애', path: '/IODcommu', icon: <FaHeart /> },
  { id: 'md', label: '정신적장애', path: '/MDcommu', icon: <FaBrainAlt /> },
];

interface CommunityButtonProps {
  item: CommunityItem;
  onClick: (path: string) => void;
}

const CommunityButton: React.FC<CommunityButtonProps> = ({ item, onClick }) => (
  <button
    className="community-button"
    onClick={() => onClick(item.path)}
    aria-label={`${item.label} 커뮤니티로 이동`}
    style={{ backgroundColor: '#f5f5f5' }}
  >
    <div className="icon-container">
      {React.cloneElement(item.icon as React.ReactElement, { className: 'community-icon' })}
    </div>
    <span className="community-label">{item.label}</span>
  </button>
);

interface CommunitySectionProps {
  navigate: (path: string) => void;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({ navigate }) => {
  return (
    <section className="community-section" role="region" aria-label="커뮤니티 바로가기">
      <h2 className="community-title">커뮤니티 바로가기</h2>
      <p className="community-description">
        같은 장애와 질환을 가진 사용자들과 복약 정보와 치료 경험을 나누어보세요!
      </p>
      <div className="community-grid">
        {communityItems.map((item) => (
          <CommunityButton
            key={item.id}
            item={item}
            onClick={navigate}
          />
        ))}
      </div>
    </section>
  );
};

export default CommunitySection;
