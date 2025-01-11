/*eslint.config.mjs: ESLint 설정 파일
* ESLint 설정을 정의하고 프로젝트에 적용*/

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

/*fileURLToPath: URL을 파일 경로로 변환하는 함수
* import.meta.url: 현재 파일의 URL*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*FlatCompat: ESLint 호환성 클래스
* baseDirectory: 기본 디렉토리 경로*/
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/*eslintConfig: ESLint 설정 배열
* compat.extends("next/core-web-vitals", "next/typescript"): 확장된 설정 추가*/
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

/*export default eslintConfig: 설정을 내보내는 부분*/
export default eslintConfig;
