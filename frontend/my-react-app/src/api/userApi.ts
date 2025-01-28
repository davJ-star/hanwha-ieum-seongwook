import axiosInstance from './axiosInstance';
import { AddUserRequest } from '../types/UserTypes';

export const registerUser = async (userData: AddUserRequest) => {
  const response = await axiosInstance.post('/user', userData);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await axiosInstance.post(`/${id}/mypage/delete`);
  return response.data;
};