import React,{useState} from 'react'
import { Link } from 'react-router'
import { useNavigate } from "react-router";
import "./Register.scss";
import { useAuth } from '../hooks/useAuth';


const Register = () => {

  const navigate = useNavigate();
  const [username,setUserName]=useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const {loading ,handleRegister}=useAuth();

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
      
      await handleRegister({username,email,password});
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
        id="registerForm"
        onSubmit={handleSubmit}
      >
        <h2>Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          onChange={(e)=>{setUserName(e.target.value)}}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={(e)=>{setEmail(e.target.value)}}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={(e)=>{setPassword(e.target.value)}}
        />

        <button type="submit">
          Register
        </button>

        <p>
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register;