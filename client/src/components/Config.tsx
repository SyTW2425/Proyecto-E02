import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Config.css';
import { useTheme } from '../context/ThemeContext';

const Config = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  return (
    <div className="config-container">
      <h2>Configuraciones Generales</h2>
      <button onClick={toggleDarkMode}>
        {darkMode ? 'Activar Tema Claro' : 'Activar Tema Oscuro'}
      </button>
      <button onClick={handleBack} className="back-button">
        Volver Atrás
      </button>
    </div>
  );
};

export default Config;