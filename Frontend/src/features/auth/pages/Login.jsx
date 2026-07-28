import React, { useState } from 'react'
import { useNavigate, Link } from "react-router";
import { useAuth } from '../hooks/useAuth';
import "./Login.scss";

const Login = () => {
  const { handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";
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
      <form id='f123' onSubmit={handleSubmit}>
        <h2>Login</h2>

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
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          required
          disabled={isSubmitting}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          required
          disabled={isSubmitting}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Login"}
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