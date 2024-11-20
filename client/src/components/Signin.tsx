import React, { useState } from 'react';
import { postData } from '../utils/data-utils';
import './Signin.css';

interface SigninProps {
  className?: string;
}

const Signin: React.FC<SigninProps> = ({ className }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await postData('/auth/signin', { username, password });
      console.log('Signin successful:', response);
    } catch (error) {
      console.error('Error during signin:', error);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className={`signin-form ${className}`}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            placeholder="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Signin</button>
      </form>
    </div>
  );
};

export default Signin;