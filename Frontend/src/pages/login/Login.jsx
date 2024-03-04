import {useRef } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS, loadUserData } from "../../features/user/userSlice";
import { toast } from "react-toastify";

export default function Login() {
  const userRef = useRef();
  const passwordRef = useRef();
  const {isFetching} = useSelector((store)=>store.user)

  const dispatchh = useDispatch()
  const navigate = useNavigate()
  

  const handleSubmit = async(e) => {
    e.preventDefault();
    dispatchh(LOGIN_START())
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login",{
        username:userRef.current.value,
        password:passwordRef.current.value,
      })
      console.log(res.data)
      dispatchh(LOGIN_SUCCESS(res.data))
      dispatchh(loadUserData())
      toast.success('Login : '+res.data.username)
      if(res.data.isSuperAdmin){
        navigate('/super/'+res.data._id)
      }
    } catch (err) {
      dispatchh(LOGIN_FAILURE())
      console.log(err);
      toast.error("Invalid Username/Password")
    }
  };
  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          className="loginInput"
          placeholder="Enter your Username"
          required
          ref = {userRef}
        />
        <label>Password</label>
        <input
          type="password"
          className="loginInput"
          placeholder="Enter your Password"
          required
          ref={passwordRef}
        />
        <button className="loginButton" type="submit" disabled={isFetching} >
          Login
        </button>
      </form>
      {/* <button className="loginRegisterButton">
        <Link className="link" to="/register">
          Register
        </Link>
      </button> */}
    </div>
  );
}
