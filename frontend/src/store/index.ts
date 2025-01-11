import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // 여기에 리듀서를 추가합니다
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
