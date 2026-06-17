import React, { useState } from 'react'
import { useNavigate ,Link} from "react-router";

import { useAuth } from '../hooks/useAuth';
import "./Login.scss";

const Login = () => {

const {loading ,handleLogin}=useAuth();
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

  const navigate = useNavigate();
  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{

      await handleLogin({email,password});
      navigate("/");
    }catch(err){
      console.log(err);
    }
  }

  if(loading){
    return (<main><h1>loading</h1></main>);
  }
  return (

    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <form
        id='f123' onSubmit={handleSubmit}
      >
        <h2>Login</h2>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" >
          Login
        </button>

        <p>
          Don't have an account?{' '}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login;