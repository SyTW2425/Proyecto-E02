import React, { useState } from 'react';
import './SignupSignin.css';
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
      return;
    }

    try {
      const response = await api.post('/auth/signup', {
        name: username,
        email,
        password,
      });
      console.log('Signup successful:', response.data);
      // Redirigir o mostrar un mensaje de éxito
      window.location.href = '/home';
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="box">
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
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder='Enter email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder='Enter password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder='Confirm password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;