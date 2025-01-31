import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPosts, fetchPostDetail, createPost } from '../api/postApi';
import { PostRequest } from '../types/PostTypes';

interface Post {
  id: number;
  title: string;
  content: string;
  // ... 다른 필요한 속성들
}

interface PostState {
  posts: Post[];
  postDetail: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  postDetail: null,
  loading: false,
  error: null,
};

export const loadPosts = createAsyncThunk('post/loadPosts', async (params: { category?: string; disabilityType?: string; page: number }) => {
  return await fetchPosts(params);
});

export const loadPostDetail = createAsyncThunk('post/loadPostDetail', async (id: number) => {
  return await fetchPostDetail(id);
});

export const addPost = createAsyncThunk('post/addPost', async (postData: PostRequest) => {
  return await createPost(postData);
});

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(loadPostDetail.fulfilled, (state, action) => {
        state.postDetail = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload); // 새 게시글 추가
      });
  },
});

export default postSlice.reducer;
