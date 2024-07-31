import React, { useEffect, useRef } from 'react'
import Login from './pages/login/Login'
import SignUp from './pages/signUp/SignUp'
import Home from './pages/home/Home'
import { Routes, Route } from 'react-router-dom'
import RequireUser from './components/RequireUser'
import Feed from './components/feed/Feed'
import Profile from './components/profile/Profile'
import UpdateProfile from './components/updateProfile/UpdateProfile'
import { useSelector } from 'react-redux'
import LoadingBar from 'react-top-loading-bar'

function App() {
  const isLoading = useSelector(state => state.appConfigSliceReducer.isLoading)
  const loadingRef = useRef()

  useEffect(() => {
    if(isLoading){
      loadingRef.current?.continuousStart();
    } else {
      loadingRef.current?.complete();
    }
  },)
  return (
    <div className='App'>
      <LoadingBar color='red' ref={loadingRef} />
      <Routes>
        <Route element={<RequireUser />}>
          <Route path='/' element={<Home />}>
            <Route index element={<Feed />} />
            <Route path='profile/:userId' element={<Profile />} />
            <Route path='updateProfile' element={<UpdateProfile />} />
          </Route>
        </Route>
        {/* <Route element={<OnlyIfNotLoggedIn />}> */}
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        {/* </Route> */}
      </Routes>
    </div>
  )
}

export default App