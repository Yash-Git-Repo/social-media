import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { axiosClient } from '../../utils/axiosClient'

export const getMyInfo = createAsyncThunk('user/getMyInfo', async (body, thunkAPI) => {
    try {
        thunkAPI.dispatch(setLoading(true));
        const response = await axiosClient.get('/user/getMyInfo');
        return response.data.result.getInfo
    } catch (error) {
        return Promise.reject(error)
    } finally {
        thunkAPI.dispatch(setLoading(false));
    }
})

export const updateMyProfile = createAsyncThunk("user/updateMy/Profile", async(body,thunkAPI) =>{
    try {
      thunkAPI.dispatch(setLoading(true));
      
      const response = await axiosClient.put("user/updateUserProfile",body);
      return response.result
    } catch (e) {
      console.error("updateMyProfile error", e);
    return Promise.reject(e);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  })

const appConfigSlice = createSlice({
    name: 'appConfigSlice',
    initialState: {
        isLoading: false,
        myProfile: {}
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMyInfo.fulfilled, (state, action) => {
          state.myProfile = action.payload;
        });
        builder.addCase(updateMyProfile.fulfilled, (state, action) => {
          state.myProfile = action.payload;
        });
      },
})

export default appConfigSlice.reducer;

export const { setLoading } = appConfigSlice.actions