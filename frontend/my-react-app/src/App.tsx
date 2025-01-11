// 메인 컴포넌트 (이는 vite.config.ts 파일에서 필요한 설정 추가 후 생성한 파일)

import * as React from 'react';
import Counter from './Counter';  // 예제 컴포넌트
import './App.css';  // 애플리케이션의 기본 스타일 파일
const App = () => {
  return (
    <div>
      <h1>Vite + React + Redux + TypeScript Example</h1>
      <Counter />  // 예제 컴포넌트
    </div>
  );
};

export default App;
