/*store.ts: Redux 스토어 설정 파일*/
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counterSlice';

/*configureStore: Redux Toolkit의 configureStore 함수*/
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

/*RootState: 스토어의 상태 타입*/
export type RootState = ReturnType<typeof store.getState>;

/*AppDispatch: 스토어의 디스패치 타입*/
export type AppDispatch = typeof store.dispatch;
