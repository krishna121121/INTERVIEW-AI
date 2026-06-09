import React from 'react'
import { Link } from 'react-router'
import { useNavigate } from "react-router";


const Register = () => {

  const navigate = useNavigate();
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
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '300px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}
      >
        <h2>Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />

        <button type="submit" onClick={()=>navigate("/home")}>
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