import React, { useState } from 'react';
import './SignupSignin.css';

const Signin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signin user:', email, password);
  };

  return (
    <div className="box">
      <h2>Signin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder='Enter email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder='Enter password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signin</button>
      </form>
    </div>
  );
};

export default Signin;