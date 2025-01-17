import React from 'react';
import './AccessibilityModal.css';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityModal = ({ isOpen, onClose }: AccessibilityModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>접근성 기능 가이드라인</h2>
        <div className="modal-body">
          <h3>화면 확대/축소</h3>
          <p>- 우측 하단의 확대/축소 버튼을 클릭하여 화면 크기를 조절할 수 있습니다.</p>
          
          <h3>단축키 안내</h3>
          <p>- ① 정보 검색</p>
          <p>- ② 복용약 관리</p>
          <p>- ③ 허위광고 판별</p>
          <p>- ④ 로그인</p>
          
          <h3>화면 읽기</h3>
          <p>- 스크린 리더 지원</p>
          <p>- 모든 이미지에 대체 텍스트 제공</p>
          
          <h3>색상 대비</h3>
          <p>- 시각적 편의성을 위한 고대비 색상 사용</p>
        </div>
        <button className="modal-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default AccessibilityModal;
