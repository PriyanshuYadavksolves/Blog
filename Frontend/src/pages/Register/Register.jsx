import { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      setIsFetching(false);
      return;
    }

    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
      toast.error("Input Field Can't Be Empty");
      setIsFetching(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
        profilePic: "https://tse1.mm.bing.net/th?id=OIP.KEJaw671I5WYuftNN0IOZAAAAA&pid=Api&P=0&h=220",
      });
      
      toast.success("User Created Successfully");
      res.data && navigate("/login");
    } catch (err) {
      setIsFetching(false);
      console.error(err);
      if (err.response) {
        toast.error(err.response.data);
      } else {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="register">
      <span className="registerTitle">Register</span>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="registerInput"
          placeholder="Enter Your Username"
          required
        />
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="registerInput"
          placeholder="Enter Your Email"
          required
        />
        <label>Password</label>
        <div className="passwordInputContainer">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="registerInput"
            placeholder="Enter Your Password"
            required
          />
          <i
            className={`passwordVisibilityIcon ${showPassword ? "fas fa-eye-slash" : "fas fa-eye"}`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>
        <button className="registerButton" type="submit" disabled={isFetching}>
          Register
        </button>
      </form>
    </div>
  );
}
