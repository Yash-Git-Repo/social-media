import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import defaultUserImg from "../../Assets/user.png";
import "./UpdateProfile.scss";
import { updateMyProfile } from "../../redux/slices/appConfigSlice";
import { deleteUserProfile } from "../../redux/slices/deleteUserSlice";
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../deleteModal/DeleteModal';

function UpdateProfile() {
  const myProfile = useSelector(
    (state) => state.appConfigSliceReducer.myProfile
  );
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [userImg, setUserImg] = useState();
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    setName(myProfile?.name || "");
    setBio(myProfile?.bio || "");
    setUserImg(myProfile?.avatar?.url || defaultUserImg);
  }, [dispatch]);

  function handleImagechange(e) {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        if (fileReader.readyState === FileReader.DONE) {
          setUserImg(fileReader.result);
        }
      };

      fileReader.onerror = (error) => {
        console.error("FileReader error:", error); // Log any errors
      };

      fileReader.readAsDataURL(file); // Read the file as a Data URL
    } else {
      console.warn("No file selected"); // Log a warning if no file is selected
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      updateMyProfile({
        name,
        bio,
        userImg,
      })
    ).then(() => {
      // Redirect to the profile page after the profile is updated
      navigate(`/profile/${myProfile._id}`);
    }).catch(error => {
      console.error("Failed to update profile:", error);
    });
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      try {
        await dispatch(deleteUserProfile());
        setSuccessMessage("User deleted successfully.");
        setShowModal(true); // Show the modal with success message
        setTimeout(() => {
          navigate('/signUp');
        }, 3000);
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
    }
  };

  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className="label-Img">
              <img src={userImg} alt={name} />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImagechange}
            ></input>
          </div>
        </div>
        <div className="right-part">
          <form>
            <input
              value={name}
              type="text"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              value={bio}
              type="text"
              placeholder="Your Bio"
              onChange={(e) => setBio(e.target.value)}
            />
            <input
              type="submit"
              className="btn-primary"
              onClick={handleSubmit}
            />
          </form>
          <button className="deleteAccount btn-primary" onClick={handleDeleteAccount}>Delete Account</button>
          {showModal && (
            <DeleteModal message={successMessage} onClose={() => setShowModal(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
