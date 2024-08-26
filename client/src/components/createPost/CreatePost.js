import React, { useState } from "react";
import "./CreatePost.scss";
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from "../../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/appConfigSlice";
import { getUserProfile } from "../../redux/slices/postSlice";
import Avatar from "../avatar/Avatar";

function CreatePost() {
  const [postImg, setPostImg] = useState("");
  const [showPostImg, setShowPostImg] = useState("");
  const [caption, setcaption] = useState("");
  const dispatch = useDispatch("");
  const myProfile = useSelector(
    (state) => state.appConfigSliceReducer.myProfile
  );
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPostImg(file);
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setShowPostImg(fileReader.result);
      }
    };
  };

  const handlePostSubmit = async () => {

    if (!caption || !postImg) {
      alert('Caption and image are required');
      return;
    }

    try {
      dispatch(setLoading(true));

      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('photo', postImg);

      await axiosClient.post('/post/createPost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(getUserProfile({ userId: myProfile?._id }));
    } catch (error) {
      alert('Failed to create post');
    } finally {
      dispatch(setLoading(false));
      setcaption("");
      setPostImg("");
      setShowPostImg("")
    }
  };

  return (
    <div className="CreatePost">
      <div className="leftPartPost">
        <Avatar src={myProfile?.avatar?.url} />
      </div>
      <div className="rightPart">
        <input
          type="text"
          value={caption}
          className="captionInput"
          placeholder="What's on your mind ?"
          onChange={(e) => setcaption(e.target.value)}
        />
        {showPostImg && (
          <div className="imgContainer">
            <img className="postImg" src={showPostImg} alt="Post-Img"></img>
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
  );
}

export default CreatePost;
