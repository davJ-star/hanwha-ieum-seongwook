/*index.ts: Redux 스토어 설정 파일
* Redux 스토어 설정 파일*/

/*configureStore: Redux Toolkit의 configureStore 함수
* 스토어를 생성하는 함수*/
import { configureStore } from '@reduxjs/toolkit';

/*TypedUseSelectorHook, useDispatch, useSelector: React Redux의 훅을 가져오는 부분
* TypedUseSelectorHook: 타입이 지정된 useSelector 훅
* useDispatch: 디스패치 함수를 가져오는 훅
* useSelector: 상태를 선택하는 훅*/
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// 예제 슬라이스 (필요하면 추가하세요)
import exampleSlice from './slices/exampleSlice';

/*store: Redux 스토어 생성
* configureStore: Redux Toolkit의 configureStore 함수
* reducer: 스토어의 리듀서 설정
* example: exampleSlice: 예제 슬라이스*/
export const store = configureStore({
  reducer: {
    example: exampleSlice,
  },
});

// 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Redux 커스텀 훅
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
