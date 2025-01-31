import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, deleteUser } from '../api/userApi';
import { AddUserRequest } from '../types/UserTypes';

export const register = createAsyncThunk('user/register', async (userData: AddUserRequest) => {
  return await registerUser(userData);
});

export const removeUser = createAsyncThunk('user/removeUser', async (id: number) => {
  return await deleteUser(id);
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(removeUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default userSlice.reducer;
