// FILE: Logout.tsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const Logout: React.FC = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logout successful');
    history.push('/signin');
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default Logout;