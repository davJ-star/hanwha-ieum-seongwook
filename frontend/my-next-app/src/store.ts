/*store.ts: Redux 스토어 설정 파일
* Redux 스토어를 생성하고 리듀서를 등록*/

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice';

/*configureStore: Redux 스토어 생성 함수
* reducer: 리듀서 함수를 등록*/
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

/*RootState: 스토어의 상태 타입
* ReturnType<typeof store.getState>: store.getState 함수의 반환 타입을 나타냄*/
export type RootState = ReturnType<typeof store.getState>;

/*AppDispatch: 스토어의 디스패치 타입
* typeof store.dispatch: store.dispatch 함수의 타입을 나타냄*/
export type AppDispatch = typeof store.dispatch;
