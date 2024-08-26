import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import "./Profile.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../createPost/CreatePost";
import { getUserProfile } from "../../redux/slices/postSlice";
import { followAndUnfollow } from "../../redux/slices/feedSlice";
import userImg from "../../Assets/user.png";

function Profile() {
  const params = useParams();
  const dispatch = useDispatch();
  const userProfile = useSelector(
    (state) => state.postSliceReducer.userProfile
  );
  const myProfile = useSelector(
    (state) => state.appConfigSliceReducer.myProfile
  );
  const feedData = useSelector((state) => state.feedSliceReducer.feedData);
  const [isMyProfile, SetisMyProfile] = useState();
  const [isFollowing, setIsfollowing] = useState();
  const userProfileImg = userProfile?.avatar?.url;
  const imageSrc = userProfileImg || userImg;

  function handleUserFollow() {
    dispatch(followAndUnfollow({ userIdToFollow: params.userId }));
  }

  useEffect(() => {
    dispatch(
      getUserProfile({
        userId: params.userId,
      })
    );
    setIsfollowing(
      feedData?.followings?.some((item) => item._id === params.userId)
    );
    SetisMyProfile(myProfile?._id === params.userId);
  }, [params.userId, myProfile, feedData]);
  const navigate = useNavigate();

  return (
    <div className="Profile">
      <div className="container">
        <div className="left-part">
          {isMyProfile && <CreatePost />}
          {userProfile?.posts?.map((item) => {
            return <Post key={item._id} post={item} />;
          })}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img className="user-img" src={imageSrc} alt="userImg" />
            <h3 className="user-name">{userProfile?.name}</h3>
            <p>{userProfile?.bio}</p>
            <div className="follower-info">
              <h4>{userProfile?.followers?.length} Followers</h4>
              <h4>{userProfile?.followings?.length} Following</h4>
            </div>
            {isMyProfile ? (
              <button
                className="update btn-secondary"
                onClick={() => navigate("/updateProfile")}
              >
                Update
              </button>
            ) : (
              <button className="follow btn-primary" onClick={handleUserFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
