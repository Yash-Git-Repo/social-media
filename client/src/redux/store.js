import { configureStore } from '@reduxjs/toolkit'
import appConfigSliceReducer from '../redux/slices/appConfigSlice'
import postSliceReducer from '../redux/slices/postSlice'
import feedSliceReducer from '../redux/slices/feedSlice'

export default configureStore({
    reducer: {
        appConfigSliceReducer,
        postSliceReducer,
        feedSliceReducer
    }
})