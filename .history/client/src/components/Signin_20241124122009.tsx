import React, { useState } from 'react';
import './SignupSignin.css';
import api from '../api';

const Signin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/signin', {
        email,
        password,
      });
      console.log('Signin successful:', response.data);
      // Redirigir o mostrar un mensaje de éxito
    } catch (error) {
      console.error('Signin error:', error);
      setError('Signin failed. Please try again.');
    }
  };

  return (
    <div className="box">
      <h2>Signin</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder='Enter email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autocomplete="email"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder='Enter password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autocomplete="current-password"
        />
        <button type="submit">Signin</button>
      </form>
    </div>
  );
};

export default Signin;