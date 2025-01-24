import React from 'react';
import './AccessibilityModal.css';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityModal = ({ isOpen, onClose }: AccessibilityModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-content"
        role="document"
      >
        <h2 id="modal-title" tabIndex={-1}>접근성 기능 가이드라인</h2>
        <div className="modal-body" role="region" aria-label="접근성 기능 설명">
          <section aria-labelledby="zoom-title">
            <h3 id="zoom-title">화면 확대/축소</h3>
            <p>- 우측 하단의 확대/축소 버튼을 클릭하여 화면 크기를 조절할 수 있습니다.</p>
          </section>
          
          <section aria-labelledby="shortcuts-title">
            <h3 id="shortcuts-title">단축키 안내</h3>
            <nav role="navigation" aria-label="단축키 메뉴">
              <p>- ① 정보 검색</p>
              <p>- ② 복용약 관리</p>
              <p>- ③ 허위광고 판별</p>
              <p>- ④ 로그인</p>
            </nav>
          </section>
          
          <section aria-labelledby="screen-reader-title">
            <h3 id="screen-reader-title">화면 읽기</h3>
            <p>- 스크린 리더 지원</p>
            <p>- 모든 이미지에 대체 텍스트 제공</p>
          </section>
          
          <section aria-labelledby="contrast-title">
            <h3 id="contrast-title">색상 대비</h3>
            <p>- 시각적 편의성을 위한 고대비 색상 사용</p>
          </section>
        </div>
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="접근성 가이드라인 닫기"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default AccessibilityModal;
