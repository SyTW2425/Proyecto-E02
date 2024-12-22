import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/SignupSignin.css';
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
      response.data.token && localStorage.setItem('token', response.data.token);
      console.log('response:', response);
      toast.success('Signup successful');
      
      // Obtener el nombre del usuario
      const userResponse = await api.get('/users', {
        params: { email },
        headers: { Authorization: `Bearer ${response.data.token}` }
      });
      // obtener el id del usuario
     // console.log('userResponse:', userResponse);
      localStorage.setItem('id_usuario', userResponse.data._id);
     // console.log('localestorage:', localStorage);
      // añadir tiempo de espera grande
      //await new Promise(resolve => setTimeout(resolve, 5000000));

      localStorage.setItem('nombre_usuario', userResponse.data.name);
      window.location.href = '/home';
    } catch (error: any) {
      setError((error).response.data);
      toast.error((error).response.data);
      return;
    }
  };

  return (
    <div>
      <img src="/images/PoKeDeCk-19-12-2024.png" alt="Logo" className="logo" />
      <div className="box">
        <ToastContainer />
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
            autoComplete="current-password"
          />
          <button type="submit">Signin</button>
        </form>
        <p>¿No tienes cuenta? <Link to="/signup">Regístrate</Link></p>
      </div>
    </div>
  );
};

export default Signin;