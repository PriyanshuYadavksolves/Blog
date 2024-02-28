import { useState } from "react";
import "./register.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(false)
    try {
      const res = await axios.post("http://localhost:8000/api/auth/register", {
        username,
        email,
        password,
        profilePic:"https://tse1.mm.bing.net/th?id=OIP.KEJaw671I5WYuftNN0IOZAAAAA&pid=Api&P=0&h=220"
      });
      console.log(res.data)
     res.data && window.location.replace("/login")
    } catch (err) {
      setError(true)
    }
  };

  return (
    <div className="register">
      <span className="registerTitle">Register</span>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          className="registerInput"
          placeholder="Enter your Username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          className="registerInput"
          placeholder="Enter your Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          className="registerInput"
          placeholder="Enter yout password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="registerButton" type="submit">
          Register
        </button>
      </form>
      <button className="registerLoginButton">
        <Link className="link" to="/login">
          Login
        </Link>
      </button>
      {error && <span style={{color:"red",marginTop:"10px"}}>Something went wrong!</span>}
    </div>
  );
}
