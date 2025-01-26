import React from 'react';
import '../components/AccessibilityModal.css';

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
      <div className="modal-content" role="document">
        <h2 id="modal-title" className="modal-title">✅ 접근성 기능 사용 가이드라인</h2>
        <div className="modal-body" role="region" aria-label="접근성 기능 설명">
          <div className="guideline-container">
            <section className="guideline-section">
              <div className="guideline-subsection">
                <h4>&lt;PC 접근성 기능 활용 방법&gt;</h4>
                <ol>
                  <li>
                    <strong>스크린 리더:</strong>
                    <ul>
                      <li>Windows: Windows 키 + Ctrl + Enter</li>
                      <li>Mac: Cmd + F5</li>
                    </ul>
                  </li>
                  <li>
                    <strong>키보드 내비게이션:</strong>
                    <ul>
                      <li>Tab 키: 다음 버튼/링크 이동</li>
                      <li>Shift + Tab: 이전 항목으로 이동</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </section>

            <section className="guideline-section">
              <div className="guideline-subsection">
                <h4>&lt;모바일 접근성 기능 활용 방법&gt;</h4>
                <ol>
                  <li>
                    <strong>화면 읽기 기능:</strong>
                    <ul>
                      <li>Android: 설정 &gt; 접근성 &gt; TalkBack</li>
                      <li>iPhone: 설정 &gt; 손쉬운 사용 &gt; VoiceOver</li>
                    </ul>
                  </li>
                  <li>
                    <strong>음성 제어:</strong>
                    <ul>
                      <li>Android: 설정 &gt; 접근성 &gt; 음성 제어</li>
                      <li>iPhone: 설정 &gt; 손쉬운 사용 &gt; 음성 제어</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </section>

            <section className="guideline-section">
              <div className="guideline-subsection">
                <h4>&lt;공통 접근성 기능 활용 방법&gt;</h4>
                <ol>
                  <li>
                    <strong>고대비 설정:</strong>
                    <ul>
                      <li>Windows/Android: 접근성 &gt; 고대비</li>
                      <li>Mac/iOS: 손쉬운 사용 &gt; 고대비</li>
                    </ul>
                  </li>
                  <li>
                    <strong>텍스트 확대:</strong>
                    <ul>
                      <li>PC: Ctrl/Cmd + (+/-)</li>
                      <li>모바일: 설정 &gt; 접근성 &gt; 글자 크기</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </section>
          </div>
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
