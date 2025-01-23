import React, { useState } from "react";

// 한글 초성, 중성, 종성 분리
const INITIAL = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const MEDIAL = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];
const FINAL = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

// 초성, 중성, 종성 매핑 테이블 (점자)
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

// 한글을 초성, 중성, 종성으로 분리
const decomposeHangul = (char: string): { initial: string; medial: string; final: string } | null => {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null; // 한글 음절이 아닌 경우
  const initial = Math.floor(code / 588);
  const medial = Math.floor((code % 588) / 28);
  const final = code % 28;
  return {
    initial: INITIAL[initial],
    medial: MEDIAL[medial],
    final: FINAL[final],
  };
};

// 초성, 중성, 종성 조합
const composeHangul = (initial: string, medial: string, final: string): string | null => {
  const initialIndex = INITIAL.indexOf(initial);
  const medialIndex = MEDIAL.indexOf(medial);
  const finalIndex = FINAL.indexOf(final);
  if (initialIndex === -1 || medialIndex === -1 || finalIndex === -1) return null;
  return String.fromCharCode(0xac00 + initialIndex * 588 + medialIndex * 28 + finalIndex);
};

// 텍스트 → 점자 변환
const convertToBraille = (text: string): string => {
  return text
    .split("")
    .map((char) => {
      const decomposed = decomposeHangul(char);
      if (decomposed) {
        const { initial, medial, final } = decomposed;
        return (
          (initialBrailleMap[initial] || "?") +
          " " +
          (medialBrailleMap[medial] || "?") +
          " " +
          (finalBrailleMap[final] || "?")
        );
      }
      return char; // 한글이 아닌 경우 그대로 반환
    })
    .join(" ");
};

// 점자 → 텍스트 변환
const convertToText = (braille: string): string => {
  const chars = braille.split("  "); // 한 문자당 점자 세트는 공백으로 구분
  return chars
    .map((set) => {
      const [initial, medial, final] = set.split(" ");
      const initialKey = Object.keys(initialBrailleMap).find((key) => initialBrailleMap[key] === initial);
      const medialKey = Object.keys(medialBrailleMap).find((key) => medialBrailleMap[key] === medial);
      const finalKey = Object.keys(finalBrailleMap).find((key) => finalBrailleMap[key] === final);
      return composeHangul(initialKey || "", medialKey || "", finalKey || "") || "?";
    })
    .join("");
};

// React 컴포넌트
const BrailleConverter: React.FC = () => {
  const [input, setInput] = useState("");
  const [isBrailleToText, setIsBrailleToText] = useState(false);
  const [output, setOutput] = useState("");

  const handleConvert = () => {
    setOutput(isBrailleToText ? convertToText(input) : convertToBraille(input));
  };

  return (
    <div>
      <h1>Braille Converter</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="텍스트 또는 점자를 입력하세요."
      />
      <div>
        <label>
          <input type="checkbox" checked={isBrailleToText} onChange={(e) => setIsBrailleToText(e.target.checked)} />
          점자 → 텍스트
        </label>
      </div>
      <button onClick={handleConvert}>변환</button>
      <div>
        <h2>결과:</h2>
        <p>{output}</p>
      </div>
    </div>
  );
};

export default BrailleConverter;
