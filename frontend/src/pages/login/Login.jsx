import {useRef,useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error,setError] = useState(false)

    const handleSubmit = async(e)=>{
        e.preventDefault()    
        setError(false)
        try {
          const res = await axios.post('http://localhost:8000/api/auth/login',{
            email:emailRef.current.value,
            password: passwordRef.current.value
          })
          if(res.data.isSuperAdmin){
            window.location.replace(`/super/${res.data._id}`)
          }else{

            window.location.replace('/home')
          }
        } catch (error) {
          console.log(error)
          setError(true)
        }
    }
  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          className="loginInput"
          placeholder="Enter your email"
          required
          ref = {emailRef}
        />
        <label>Password</label>
        <input
          type="password"
          className="loginInput"
          placeholder="Enter yout password"
          required
          ref={passwordRef}
        />
        {/* <button className="loginButton" type="submit" disabled={isFetching} > */}
        <button className="loginButton" type="submit" >

          Login
        </button>
      </form>
      <button className="loginRegisterButton">
        <Link className="link" to="/register">
          Register
        </Link>
      </button>
      {error && <span style={{color:"red",marginTop:"10px"}}>Something went wrong!</span>}
    </div>
  )
}

export default Login
