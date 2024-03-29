import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT,loadUserData,UPDATE_START,UPDATE_SUCCESS,UPDATE_FAILURE } from "../../features/user/userSlice";
import { toast } from "react-toastify";
import "./topbar.css";
import axios from "axios";
import Cookies from "js-cookie";

export default function Topbar() {
  const { userData } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const token = Cookies.get('token')

  const handleLogout = () => {
    dispatch(LOGOUT());
    toast.info("Logout Successfully");
    navigate("/login");
  };

  const handleRequest = async() =>{
    if(userData.isSuperAdmin){
      toast.info("You Are SuperAdmin")
    }
    else if(userData.isAdmin){
      toast.info("Yor Are Admin")
    }else if(userData.isRequested){
      toast.info("You Have Allready Requested For Admin")
    }else{
      try {
        dispatch(UPDATE_START())
        const res = await axios.put("http://localhost:5000/api/users/request/"+userData._id,{},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data)
        dispatch(UPDATE_SUCCESS(res.data))
        dispatch(loadUserData())
        toast.success("Request Sent")
      } catch (error) {
        dispatch(UPDATE_FAILURE())
        console.log(error)
        toast.error("Something Went Wrong!")
      }
    }
  }

  const handleSearch = (e) => {
      console.log("Search term:", searchTerm);
      toast.success(`Search for : ${searchTerm}`)
      navigate(`/post/title/?title=${searchTerm}`)
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
      {userData && <div className="topCenter">
        <input
          type="text"
          placeholder="Search..."
          className="topSearchInput"
          value={searchTerm}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="topSearchIcon fas fa-search" onClick={handleSearch}></i>
      </div>}
      <div className="topRight">
        {userData ? (
          <div className="right">
              <li className="logout" onClick={handleRequest}>
              {userData.isAdmin ? (userData.isSuperAdmin ? "SUPERADMIN" : "ADMIN") : (userData.isRequested ? "REQUESTED" : "REQUEST")}
            </li>
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
