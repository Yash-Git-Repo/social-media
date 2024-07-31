import { useDispatch, useSelector } from 'react-redux';
import defaultUserImg from '../../Assets/user.png'
import "./UpdateProfile.scss";
import { useEffect, useState } from 'react';
import { setLoading, updateMyProfile } from '../../redux/slices/appConfigSlice';

function UpdateProfile() {
  const myProfile = useSelector(state => state.appConfigSliceReducer.myProfile)
  const [name, setName] = useState()
  const [bio, setBio] = useState()
  const [userImg, setUserImg] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    setName(myProfile?.name || '');
    setBio(myProfile?.bio || ''); 
    setUserImg(myProfile?.avatar?.url || defaultUserImg)
  }, [])

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
      console.error('FileReader error:', error); // Log any errors
    };
    
    fileReader.readAsDataURL(file); // Read the file as a Data URL
  } else {
    console.warn('No file selected'); // Log a warning if no file is selected
  }
}


  function handleSubmit(e) {
    e.preventDefault()
   dispatch(updateMyProfile({
    name,
    bio,
   }))
  }

  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className="label-Img">
              <img src={userImg} alt={name} />
            </label>
            <input
              className='inputImg'
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
          <button className="deleteAccount btn-primary">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
