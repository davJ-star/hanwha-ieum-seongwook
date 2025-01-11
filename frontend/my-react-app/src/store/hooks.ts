/*hooks.ts: 스토어의 훅을 정의하는 파일
* 스토어의 훅을 정의하는 파일*/

/*TypedUseSelectorHook, useDispatch, useSelector: React Redux의 훅을 가져오는 부분
* TypedUseSelectorHook: 타입이 지정된 useSelector 훅
* useDispatch: 디스패치 함수를 가져오는 훅
* useSelector: 상태를 선택하는 훅*/
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

/*RootState, AppDispatch: 스토어의 상태와 디스패치 함수를 나타내는 타입
* RootState: 스토어의 상태를 나타내는 타입
* AppDispatch: 스토어의 디스패치 함수를 나타내는 타입*/
import type { RootState, AppDispatch } from './index';

/*useAppDispatch: 스토어의 디스패치 함수를 가져오는 훅
* useAppSelector: 스토어의 상태를 선택하는 훅*/
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
