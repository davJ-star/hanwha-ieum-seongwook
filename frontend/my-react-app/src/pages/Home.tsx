// 홈 페이지(이는 vite.config.ts 파일에서 필요한 설정 추가 후 생성한 파일)

/*import * as React from 'react': React 라이브러리를 가져오는 부분
* React: React 라이브러리*/
import * as React from 'react';

/*useAppSelector, useAppDispatch: 스토어의 훅을 가져오는 부분
* useAppSelector: 스토어의 상태를 선택하는 훅
* useAppDispatch: 스토어의 디스패치 함수를 가져오는 훅*/
import { useAppSelector, useAppDispatch } from '../store/hooks';

/*increment, decrement: 카운터 상태를 업데이트하는 액션 함수
* increment: 카운터 값을 1 증가시키는 액션
* decrement: 카운터 값을 1 감소시키는 액션*/
import { increment, decrement } from '../store/slices/exampleSlice';

const Home: React.FC = () => {
  const count = useAppSelector((state) => state.example.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Counter Example</h1>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

export default Home;
