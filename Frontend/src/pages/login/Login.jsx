import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  LOGIN_FAILURE,
  LOGIN_START,
  LOGIN_SUCCESS,
  loadUserData,
} from "../../features/user/userSlice";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isFetching } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(LOGIN_START());

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      dispatch(LOGIN_FAILURE());
      return;
    }

    if (email.trim() === "" || password.trim() === "") {
      toast.error("Input Field Can't Be Empty");
      dispatch(LOGIN_FAILURE());
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("login me " + res.data);
      Cookies.set("token", res.data.token);

      dispatch(LOGIN_SUCCESS(res.data.others));
      dispatch(loadUserData());
      toast.success(`Login: ${res.data.others.username}`);

      if (res.data.isSuperAdmin) {
        navigate(`/super/${res.data._id}`);
      }
    } catch (err) {
      dispatch(LOGIN_FAILURE());
      console.error(err);
      toast.error("Invalid Username/Password");
    }
  };

  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          className="loginInput"
          placeholder="Enter your Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          className="loginInput"
          placeholder="Enter your Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="loginButton" type="submit" disabled={isFetching}>
          Login
        </button>
      </form>
    </div>
  );
}
