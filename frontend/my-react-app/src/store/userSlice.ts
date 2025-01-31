import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = axiosInstance.defaults.baseURL;


export interface User {
  id: number;
  nickname: string;
  email: string;
  profileImage: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: {
    nickname: string;
    email: string;
    password: string;
    profileImage: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  }
);

export const sendVerificationCode = createAsyncThunk(
  'user/sendVerificationCode',
  async (email: string) => {
    await axios.post(`${API_BASE_URL}/send-verification`, { email });
  }
);

export const verifyCode = createAsyncThunk(
  'user/verifyCode',
  async ({ email, code }: { email: string; code: string }) => {
    const response = await axios.post(`${API_BASE_URL}/verify-code`, { email, code });
    return response.data;
  }
);

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '회원가입 중 오류가 발생했습니다.';
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.error = '인증 코드 발송 중 오류가 발생했습니다.';
        console.log(action.error.message);
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.error = '인증 코드 확인 중 오류가 발생했습니다.';
        console.log(action.error.message);
      });
  },
});

export default userSlice.reducer;
