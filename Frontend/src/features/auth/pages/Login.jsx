import React from 'react'
import { Link } from 'react-router'

const Login = () => {
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
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit">
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