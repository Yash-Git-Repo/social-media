import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosClient } from '../../utils/axiosClient'; // Ensure axiosClient is set up to handle API requests

export const deleteUserProfile = createAsyncThunk(
  'appConfig/deleteMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.delete('/user/deleteUserProfile');
      return; // Optionally, return any data you might need after deletion
    } catch (error) {
      // Return error message to be used in the component
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const deleteUserSlice = createSlice({
  name: 'deleteUSerSlice',
  initialState: {
    myProfile: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Define other reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle the deleteUserProfile action
      .addCase(deleteUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.loading = false;
        state.myProfile = null; // Clear the profile data
        // Optionally, handle other state updates here
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      });
  },
});

export default deleteUserSlice.reducer;
