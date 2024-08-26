import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosClient } from '../../utils/axiosClient';
import { likeAndUnlikePost, setLoading } from './postSlice';

export const getFeedData = createAsyncThunk(
  "user/getFeedData",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.get("user/getPostOfFollowing");
      return response.data.result;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

export const followAndUnfollow = createAsyncThunk(
  "user/followUnfollow",
  async (body, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.post("user/followUnfollow", body);
      return response.data.result.user;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    isLoading: false,
    feedData: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFeedData.fulfilled, (state, action) => {
      state.feedData = action.payload;
    });
    builder.addCase(likeAndUnlikePost.fulfilled, (state, action) => {
      const post = action.payload.post;
      const index = state?.feedData?.posts?.findIndex(
        (item) => item._id === post._id
      );

      if (index !== undefined && index !== -1) {
        state.feedData.posts[index] = post;
      }
    });
    builder.addCase(followAndUnfollow.fulfilled, (state, action) => {
      const user = action.payload
      const index = state?.feedData?.followings?.findIndex(item => item._id === user._id)
      if (index !== undefined && index !== -1) {
        state?.feedData?.followings?.splice(index, 1)
      } else {
        state?.feedData?.followings?.push(user)
      }
    });
  },
});

export default feedSlice.reducer;
