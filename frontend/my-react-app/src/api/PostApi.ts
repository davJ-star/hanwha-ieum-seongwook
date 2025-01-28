import axiosInstance from './axiosInstance';
import { PostRequest } from '../types/PostTypes';

export const fetchPosts = async (params: { category?: string; disabilityType?: string; page: number }) => {
  const response = await axiosInstance.post('/community', params);
  return response.data;
};

export const fetchPostDetail = async (id: number) => {
  const response = await axiosInstance.get(`/community/post/${id}`);
  return response.data;
};

export const createPost = async (postData: PostRequest) => {
  const response = await axiosInstance.post('/community/write', postData);
  return response.data;
};
