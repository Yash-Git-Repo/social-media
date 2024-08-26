import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosClient } from '../../utils/axiosClient';

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (body, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.post("/user/getUserProfile", body);
      return response.data.result
    } catch (e) {
      return Promise.reject(e);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

export const likeAndUnlikePost = createAsyncThunk(
  "/post/likeAndUnlike",
  async (body, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.post("/post/likeAndUnlike", body);
      return response.data.result
    } catch (e) {
      return Promise.reject(e);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

const postSlice = createSlice({
  name: 'postSlice',
  initialState: {
    isLoading: false,
    userProfile: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.userProfile = action.payload;
    });
    builder.addCase(likeAndUnlikePost.fulfilled, (state, action) => {
      const post = action.payload.post;
      const index = state?.userProfile?.posts?.findIndex(
        (item) => item._id === post._id
      );

      if (index !== undefined && index !== -1) {
        state.userProfile.posts[index] = post;
      }
    });
  },
});

export default postSlice.reducer;

export const { setLoading } = postSlice.actions;
