import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/SignupSignin.css';
import api from '../api';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Signup:', username, email, password, confirmPassword);
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    try {
      api.post('/auth/signup', {
        name: username,
        email,
        password,
      });
      localStorage.setItem('nombre_usuario', username);
      toast.success('Signup successful');
      window.location.href = '/';
    } catch (error: any) {
      setError((error).response.data);
      toast.error((error).response.data);
      return;
    }
  };

  return (
    <div className="signup-signin-background">
      <div className="signup-signin-container">
        <img src="/images/PoKeDeCk-19-12-2024.png" alt="Logo" className="logo" />
        <div className="box">
          <ToastContainer />
          <h2>Signup</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              name="username"
              placeholder='Enter username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button type="submit">Signup</button>
          </form>
          <p>¿Ya tienes cuenta? <Link to="/">Inicia Sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;