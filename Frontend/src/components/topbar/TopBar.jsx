import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../features/user/userSlice";
import { toast } from "react-toastify";
import "./topbar.css";

export default function Topbar() {
  const { userData } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    dispatch(LOGOUT());
    toast.info("Logout Successfully");
    navigate("/login");
  };

  const handleSearch = () => {
    // Implement search functionality here
    console.log("Search term:", searchTerm);
    // You can navigate to a search results page or fetch data based on the search term
  };

  return (
    <div className="top">
      <div className="topLeft">
        <ul className="topList">
          <li className="topListItem">
            <Link to="/" className="link">
              HOME
            </Link>
          </li>
          {userData && userData.isSuperAdmin && (
            <li className="topListItem">
              <Link to={`/super/${userData._id}`} className="link">
                DASHBOARD
              </Link>
            </li>
          )}
          <li className="topListItem">
            <Link to="/write" className="link">
              WRITE
            </Link>
          </li>
        </ul>
      </div>
      <div className="topCenter">
        <input
          type="text"
          placeholder="Search..."
          className="topSearchInput"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="topSearchIcon fas fa-search" onClick={handleSearch}></i>
      </div>
      <div className="topRight">
        {userData ? (
          <div className="right">
            <Link to="/settings">
              <img className="topImg" src={userData.profilePic} alt="" />
            </Link>
            <li className="logout" onClick={handleLogout}>
              LOGOUT
            </li>
          </div>
        ) : (
          <ul className="topList">
            <li className="topListItem">
              <Link to="/login" className="link">
                LOGIN
              </Link>
            </li>
            <li className="topListItem">
              <Link to="/register" className="link">
                REGISTER
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
