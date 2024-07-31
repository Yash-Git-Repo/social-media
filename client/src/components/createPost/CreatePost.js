import React, { useState } from 'react'
import './CreatePost.scss'
import { BsCardImage } from 'react-icons/bs'
import { axiosClient } from '../../utils/axiosClient'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/slices/appConfigSlice'
import { getUserProfile } from '../../redux/slices/postSlice'
import Avatar from '../avatar/Avatar'
import createPostImg from "../../Assets/bg.jpg"

function CreatePost() {
  const [postImg, setPostImg] = useState('')
  const [caption, setcaption] = useState('')
  const dispatch = useDispatch('')
  const myProfile = useSelector(state => state.appConfigSliceReducer.myProfile)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result)
      }
    }
  }

  const handlePostSubmit = async () => {
    try {
      dispatch(setLoading(true))
      await axiosClient.post('/post/createPost', {
        caption,
        createPostImg,
      })
      dispatch(getUserProfile({ userId: myProfile?._id }))
    } catch (error) {
    } finally {
      dispatch(setLoading(false))
      setcaption('')
      setPostImg('')
    }
  }

  return (
    <div className="CreatePost">
      <div className="leftPartPost">
        <Avatar src='' />
      </div>
      <div className="rightPart">
        <input
          type="text"
          value={caption}
          className="captionInput"
          placeholder="What's on your mind ?"
          onChange={(e) => setcaption(e.target.value)}
        />
        {createPostImg && (
          <div className="imgContainer">
            <img className="postImg" src={createPostImg} alt="Post-Img"></img>
          </div>
        )}

        <div className="bottomPart">
          <div className="inputPostImg">
            <label htmlFor="inputImg" className="labelImg">
              <BsCardImage />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            ></input>
          </div>
          <button className="postBtn btn-primary" onClick={handlePostSubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
