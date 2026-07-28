import React, { useState } from 'react'
import { Link } from 'react-router';
import { useNavigate } from "react-router";
import "./Register.scss";
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await handleRegister({ username, email, password });
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
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
      <form id="registerForm" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.4)',
            color: '#f87171',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '14px',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          disabled={isSubmitting}
          onChange={(e) => { setUserName(e.target.value) }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          disabled={isSubmitting}
          onChange={(e) => { setEmail(e.target.value) }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          disabled={isSubmitting}
          onChange={(e) => { setPassword(e.target.value) }}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
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