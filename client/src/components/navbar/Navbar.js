import "./Navbar.scss";
import Avatar from "../avatar/Avatar";
import { useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { useEffect } from "react";

function Navbar() {
  const myProfile = useSelector(
    (state) => state.appConfigSliceReducer.myProfile
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      await axiosClient.post("/auth/logout");
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/login");
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="Navbar">
      <div className="container">
        <h2 className="banner hover-link" onClick={() => navigate("/")}>
          Social Media
        </h2>
        <div className="right-side">
          <div
            className="profile hover-link"
            onClick={() => navigate(`profile/${myProfile?._id}`)}
          >
            <Avatar src={myProfile?.avatar?.url} />
          </div>
          <div className="logout hover-link" onClick={handleLogout}>
            <IoMdLogOut />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
