/*counterSlice.ts: Redux 슬라이스 파일
* 카운터 상태와 관련된 액션 생성 및 리듀서 정의*/

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/*CounterState 인터페이스: 카운터 상태를 나타내는 타입
* value: 카운터 값을 나타내는 숫자*/
interface CounterState {
  value: number;
}

/*initialState: 초기 상태 설정
* value: 0으로 초기화*/
const initialState: CounterState = {
  value: 0,
};

/*counterSlice: 카운터 상태와 관련된 액션 생성 및 리듀서 정의
* name: 'counter': 슬라이스의 이름
* initialState: 초기 상태
* reducers: 액션 생성 함수 정의*/
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    /*increment: 카운터 값을 1 증가시키는 액션
    * state: 현재 상태
    * state.value: 현재 상태의 value 속성을 1 증가*/
    increment: (state) => {
      state.value += 1;
    },
    /*decrement: 카운터 값을 1 감소시키는 액션
    * state: 현재 상태
    * state.value: 현재 상태의 value 속성을 1 감소*/
    decrement: (state) => {
      state.value -= 1;
    },
    /*incrementByAmount: 카운터 값을 주어진 숫자만큼 증가시키는 액션
    * state: 현재 상태
    * action.payload: 증가할 숫자*/
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

/*counterSlice.actions: 생성된 액션 함수를 내보내는 부분
* increment, decrement, incrementByAmount: 생성된 액션 함수*/
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
