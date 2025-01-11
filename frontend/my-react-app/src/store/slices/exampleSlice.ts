// 예제 슬라이스
/*exampleSlice.ts: 예제 슬라이스 파일
* 예제 상태와 관련된 액션 생성 및 리듀서 정의*/

/*createSlice: Redux Toolkit의 createSlice 함수
* 슬라이스를 생성하는 함수
* PayloadAction: 액션의 페이로드 타입을 나타내는 타입*/
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/*ExampleState 인터페이스: 예제 상태를 나타내는 타입
* value: 예제 상태의 값을 나타내는 숫자*/
interface ExampleState {
  value: number;
}

/*initialState: 초기 상태 설정
* value: 0으로 초기화*/
const initialState: ExampleState = {
  value: 0,
};

/*createSlice: Redux Toolkit의 createSlice 함수
* 슬라이스를 생성하는 함수
* name: 슬라이스의 이름
* initialState: 초기 상태
* reducers: 액션 생성 및 리듀서 정의*/
const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    /*increment: 예제 상태의 value를 1 증가시키는 액션
    * state: 현재 상태
    * state.value: 현재 상태의 value 속성을 1 증가*/
    increment: (state) => {
      state.value += 1;
    },
    /*decrement: 예제 상태의 value를 1 감소시키는 액션
    * state: 현재 상태
    * state.value: 현재 상태의 value 속성을 1 감소*/
    decrement: (state) => {
      state.value -= 1;
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

/*exampleSlice.actions: 생성된 액션 함수를 내보내는 부분
* increment, decrement, setValue: 생성된 액션 함수*/
export const { increment, decrement, setValue } = exampleSlice.actions;

/*exampleSlice.reducer: 생성된 리듀서를 내보내는 부분
* exampleSlice.reducer: 생성된 리듀서*/
export default exampleSlice.reducer;
