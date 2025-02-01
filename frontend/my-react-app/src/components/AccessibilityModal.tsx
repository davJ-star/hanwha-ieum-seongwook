import React from 'react';
import '../components/AccessibilityModal.css';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityModal = ({ isOpen, onClose }: AccessibilityModalProps) => {
  if (!isOpen) return null;

  // 모달 외부 클릭 처리 함수
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}  // 외부 클릭 이벤트 핸들러 추가
    >
      <div className="modal-content" role="document">
        <h2 id="modal-title" className="modal-title">✔️ 접근성 기능 사용 가이드라인</h2>
        <div className="modal-body" role="region" aria-label="접근성 기능 설명">
          <div className="guideline-container">
            <section className="guideline-section">
              <div className="guideline-subsection">
                <h4>&lt;🖥️PC 접근성 기능 활용 방법&gt;</h4>
                <ol>
                  <li>
                    <b>스크린 리더(Screen Reader)는 웹사이트의 텍스트와 버튼을 음성으로 안내해줘요!</b>
                    <ul>
                      <li style={{ listStyleType: 'none' }}>1) Windows (내레이터)</li>
                      <li>Windows 키 + Ctrl + Enter를 눌러 내레이터를 켜주세요.</li>
                      <li style={{ listStyleType: 'none' }}>2) Mac (VoiceOver)</li>
                      <li>Cmd + F5를 눌러 VoiceOver를 켜주세요.</li>
                      <li>VoiceOver 유틸리티에서 음성 속도와 탐색 방식을 조정할 수 있어요.</li>
                    </ul>
                  </li>
                  <li>
                    <b>키보드 내비게이션으로 키보드만으로 웹사이트를 사용할 수 있어요!</b>
                    <ul>
                      <li style={{ listStyleType: 'none' }}>1) Windows 및 Mac 공통</li>
                      <li>Tab 키: 웹페이지에서 다음 버튼, 링크, 입력 필드 등으로 이동해요.</li>
                      <li>Shift + Tab 키: 이전 항목으로 돌아가요.</li>
                      <li>화살표 키: 드롭다운 메뉴나 선택 항목이 있는 경우 위아래 또는 좌우로 이동해요.</li>
                      <li>Enter 키: 강조된 버튼이나 링크를 클릭할 수 있어요.</li>
                      <li>Space 키: 체크박스 또는 토글 스위치를 활성화할 수 있어요.</li>
                      <li>F11 키: 전체 화면 모드로 전환할 수 있어요.</li>
                    </ul>
                  </li>

                  <li>
                    <b>고대비 설정으로 더 편안한 화면을 만날 수 있어요!</b>
                    <ul>
                      <li style={{ listStyleType: 'none' }}>1) Windows</li>
                      <li>설정&gt;접근성&gt;고대비 테마를 선택 후 원하는 테마 적용</li>
                      <li>단축키: Shift + Alt + Print Screen.</li>
                      <li style={{ listStyleType: 'none' }}>2) Mac</li>
                      <li>시스템 설정&gt;손쉬운 사용&gt;줌&gt;활성화</li>
                      <li>세 손가락으로 트랙패드를 두 번 탭해 화면을 확대할 수 있어요.</li>
                      <li>키보드 단축키(Option + Command + '+'/'-')로 텍스트 크기를 조정할 수 있어요.</li>
                    </ul>
                  </li>

                  <li>
                    <b>텍스트 확대로 화면을 더 크게 볼 수 있어요!</b>
                    <ul>
                      <li style={{ listStyleType: 'none' }}>1) Windows</li>
                      <li>설정&gt;접근성&gt;디스플레이&gt;텍스트 크기 조정</li>
                      <li>돋보기로 화면의 일부만 확대하거나 전체 화면을 확대할 수 있어요.</li>
                      <li>단축키: Windows 키 + '+'(확대), Windows 키 + '-'(축소)</li>
                      <li style={{ listStyleType: 'none' }}>2) Mac</li>
                      <li>시스템 설정&gt;손쉬운 사용&gt;디스플레이&gt;대비 증가 체크</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </section>

            <section className="guideline-section">
              <div className="guideline-subsection">
                <h4>&lt;📱모바일 접근성 기능 활용 방법&gt;</h4>
                <ol>
                  <li>
                    <b>화면 읽기 기능이 모바일 화면을 음성으로 안내해줘요!</b>
                    <ul>
                      <li style={{ listStyleType: 'none' }}>1)Android(TalkBack)</li>
                      <li>설정 앱&gt;접근성&gt;TalkBack&gt;활성화</li>
                      <li>TalkBack 설정에서 음성 속도, 피드백 옵션 등을 조정할 수 있어요.</li>
                      <li style={{ listStyleType: 'none' }}>2)iPhone(VoiceOver)</li>
                      <li>설정 앱&gt;손쉬운 사용&gt;VoiceOver&gt;활성화</li>
                      <li>한 손가락으로 화면 탐색, 두 손가락으로 스크롤 등 제스처를 통해 음성 안내를 받을 수 있어요.</li>
                    </ul>
                  </li>
                  
                  <li>
                    <b>음성 제어로 음성만으로 모바일 기기를 사용할 수 있어요</b>
                    <ul>
                      <li>앱 열기/닫기: "MediLink 열어/닫아"</li>
                      <li>스크롤: "스크롤 위로", "스크롤 아래로"</li>
                      <li>버튼 클릭: "검색 버튼 클릭", "로그인 버튼 클릭"</li>
                      <li>텍스트 입력: "검색어 입력", "아이디 입력", "비밀번호 입력"</li>
                      <li style={{ listStyleType: 'none' }}>1)Android: 설정 &gt; 접근성 &gt; 음성 제어</li>
                      <li>설정 앱&gt;접근성&gt;음성 제어&gt;활성화</li>
                      <li style={{ listStyleType: 'none' }}>2)iPhone: 설정 &gt; 손쉬운 사용 &gt; 음성 제어</li>
                      <li>설정 앱&gt;손쉬운 사용&gt;음성 제어&gt;활성화</li>
                    </ul>
                  </li>
                  
                  <li>
                    <b>고대비 모드로 더 편안한 화면을 만날 수 있어요!</b>
                    <ul>
                      <li style={{ listStyleType: 'none' }}>1)Android</li>
                      <li>설정 앱&gt;접근성&gt;고대비 텍스트&gt;활성화</li>
                      <li style={{ listStyleType: 'none' }}>2)iPhone</li>
                      <li>설정 앱&gt;손쉬운 사용&gt;디스플레이 및 텍스트 크기&gt;대비 증가 활성화</li>
                    </ul>
                  </li>

                  <li>
                    <b>텍스트 확대로 화면을 더 크게 볼 수 있어요!</b>
                    <ul>
                      <li style={{ listStyleType: 'none' }}>1)Android</li>
                      <li>설정 앱&gt;접근성&gt;글자 크기 또는 확대 제스처 선택</li>
                      <li>글자 크기 슬라이더를 조정하거나, 확대 제스처를 활성화해 화면을 두 번 탭하고 드래그해 확대하세요.</li>
                      <li style={{ listStyleType: 'none' }}>2)iPhone</li>
                      <li>설정 앱&gt;손쉬운 사용&gt;줌&gt;활성화</li>
                      <li>세 손가락으로 화면을 두 번 탭해 확대, 세 손가락으로 드래그 해 이동할 수 있어요.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </section>

            <section className="guideline-section">
              <div className="guideline-subsection">
                <h4>&lt;💊MediLink 자체 개발 접근성 기능 활용 방법&gt;</h4>
                <ol>
                  <li>
                    <b>MediLink 자체 개발 접근성 기능은 현재 tts, 수어 해설, 점자파일(.BRF) 변환 및 역변환이 제공되고 있습니다!</b>
                    <ul>
                      <li>MediLink 자체 접근성 기능은 질병/의약품 검색 및 상세페이지와 의약품 허위광고 판별 페이지에 제공되고 있습니다.</li>
                      <li>tts 기능은 현재 한국어와 영어가 제공되고 있습니다.</li>
                      <li>수어 해설 기능은 현재 한국어만 제공되고 있습니다.</li>
                      <li>점자파일(.BRF) 변환 및 역변환 기능은 현재 한국어, 영어가 제공됩니다.</li>
                    </ul>
                  </li>

                  <li>
                    <b>tts 기능 활용 방법</b>
                    <ul>
                      <li>좌측의 스피커 모양 아이콘을 클릭하면 해당 정보에 대한 안내가 음성으로 제공됩니다.</li>
                    </ul>
                  </li>

                  <li>
                    <b>수어 해설 기능 활용 방법</b>
                    <ul>
                      <li>중앙의 손짓 모양 아이콘을 클릭하면 해당 정보에 대한 안내가 수어로 제공됩니다.</li>
                    </ul>
                  </li>

                  <li>
                    <b>점자파일(.BRF) 변환 및 역변환 기능 활용 방법</b>
                    <ul>
                      <li>좌측의 점자파일 모양 아이콘을 클릭하면 해당 정보에 대한 안내가 점자파일(.BRF)로 제공되며 점자 역변환 버튼을 클릭하면 파일 창이 뜨고, 변환할 BRF 파일을 추가하면 텍스트로 역변환 되는 기능이 제공됩니다.</li>
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
