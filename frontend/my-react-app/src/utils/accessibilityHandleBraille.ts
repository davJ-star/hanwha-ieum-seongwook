import { HanBraille } from "./hanbraille";
import { Braille } from "./braille";

export const handleBrailleClick = () => {
  // 검색 결과 컨테이너에서 텍스트 추출
  const resultsContainer = document.querySelector('.results-container');
  if (!resultsContainer) return;
  
  const text = resultsContainer.textContent || '';
  if (!text.trim()) return;

  // 언어 설정 (기본값: 'ko')
  const language: "ko" | "en" = "ko";

  // 점자 변환
  const converter = language === "ko" ? new HanBraille() : new Braille();
  const brailleText = converter.UnifiedBrl(text);

  // 결과 알림
  alert(`변환된 점자 텍스트:\n${brailleText}`);

  // BRF 파일 생성 및 다운로드
  const brfBlob = new Blob([brailleText], { type: "text/plain" });
  const url = URL.createObjectURL(brfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "output.brf";
  a.click();
  URL.revokeObjectURL(url);
};

export const handleBrailleRevert = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.brf';
  
  fileInput.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      
      // HanBraille 인스턴스 생성
      const converter = new HanBraille();
      
      // 점자를 텍스트로 변환
      const result = text.split('\n').map(line => {
        return line.split('   ')  // 문자 단위로 분리
          .map(char => {
            if (!char.trim()) return '';
            
            // 각 점자 문자를 변환
            const parts = char.split(' ');
            if (parts.length < 2) return char; // 한글이 아닌 경우 그대로 반환
            
            // 초성, 중성, 종성 찾기
            const initialKey = Object.entries(initialBrailleMap)
              .find(([_, value]) => value === parts[0])?.[0];
            const medialKey = Object.entries(medialBrailleMap)
              .find(([_, value]) => value === parts[1])?.[0];
            const finalKey = parts[2] ? Object.entries(finalBrailleMap)
              .find(([_, value]) => value === parts[2])?.[0] : '';

            if (!initialKey || !medialKey) return char;
            
            return composeHangul(initialKey, medialKey, finalKey || '') || char;
          })
          .join('');
      }).join('\n');

      // 결과 표시
      const resultDiv = document.createElement('div');
      resultDiv.style.position = 'fixed';
      resultDiv.style.top = '50%';
      resultDiv.style.left = '50%';
      resultDiv.style.transform = 'translate(-50%, -50%)';
      resultDiv.style.padding = '20px';
      resultDiv.style.backgroundColor = 'white';
      resultDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      resultDiv.style.borderRadius = '8px';
      resultDiv.style.zIndex = '1000';
      resultDiv.style.maxWidth = '80%';
      resultDiv.style.maxHeight = '80vh';
      resultDiv.style.overflow = 'auto';

      // 모달 외부 클릭 시 닫히도록 오버레이 추가
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
      overlay.style.zIndex = '999';
      
      // 오버레이 클릭 시 모달 닫기
      overlay.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(resultDiv);
      };

      // 모달 내부 클릭 시 이벤트 전파 중단
      resultDiv.onclick = (e) => {
        e.stopPropagation();
      };

      // 닫기 버튼 추가
      const closeButton = document.createElement('button');
      closeButton.textContent = '닫기';
      closeButton.style.marginTop = '10px';
      closeButton.style.padding = '5px 10px';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '4px';
      closeButton.style.backgroundColor = '#007bff';
      closeButton.style.color = '#000000';
      closeButton.style.cursor = 'pointer';
      closeButton.style.display = 'block';  // 블록 레벨 요소로 변경
      closeButton.style.margin = '10px auto';  // 상하 여백 10px, 좌우 auto로 중앙 정렬
      closeButton.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(resultDiv);
      };

      // 결과 텍스트와 닫기 버튼을 div에 추가
      resultDiv.innerHTML = `<h3>변환된 텍스트:</h3><p>${result}</p>`;
      resultDiv.appendChild(closeButton);

      // div를 페이지에 추가 (오버레이를 먼저 추가)
      document.body.appendChild(overlay);
      document.body.appendChild(resultDiv);

    } catch (error) {
      alert("점자 변환 중 오류가 발생했습니다. 올바른 BRF 파일인지 확인해주세요.");
    }
  };

  // 파일 선택 다이얼로그 표시
  fileInput.click();
};

// BrailleConverter.tsx에서 가져온 필요한 매핑 테이블과 함수들
const initialBrailleMap: { [key: string]: string } = {
  ㄱ: "100000",
  ㄴ: "101000",
  ㄷ: "110000",
  ㄹ: "110100",
  ㅁ: "100100",
  ㅂ: "111000",
  ㅅ: "111100",
  ㅇ: "101100",
  ㅈ: "011000",
  ㅊ: "011100",
  ㅋ: "100010",
  ㅌ: "101010",
  ㅍ: "110010",
  ㅎ: "110110",
};

const medialBrailleMap: { [key: string]: string } = {
  ㅏ: "100001",
  ㅑ: "100011",
  ㅓ: "101001",
  ㅕ: "101011",
  ㅗ: "110001",
  ㅜ: "110011",
  ㅡ: "111001",
  ㅣ: "111011",
  ㅐ: "100101",
  ㅔ: "101101",
  ㅚ: "110101",
  ㅝ: "111101",
};

const finalBrailleMap: { [key: string]: string } = {
  "": "",
  ㄱ: "100000",
  ㄴ: "101000",
  ㄷ: "110000",
  ㄹ: "110100",
  ㅁ: "100100",
  ㅂ: "111000",
  ㅅ: "111100",
  ㅇ: "101100",
  ㅈ: "011000",
  ㅊ: "011100",
  ㅋ: "100010",
  ㅌ: "101010",
  ㅍ: "110010",
  ㅎ: "110110",
};

const INITIAL = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const MEDIAL = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const FINAL = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

const composeHangul = (initial: string, medial: string, final: string): string | null => {
  const initialIndex = INITIAL.indexOf(initial);
  const medialIndex = MEDIAL.indexOf(medial);
  const finalIndex = FINAL.indexOf(final);
  if (initialIndex === -1 || medialIndex === -1 || finalIndex === -1) return null;
  return String.fromCharCode(0xac00 + initialIndex * 588 + medialIndex * 28 + finalIndex);
};
