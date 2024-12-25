import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { darkMode } = useTheme();

  const username = localStorage.getItem('nombre_usuario');
  return (
    <div className={`home-container ${darkMode ? 'dark' : 'light'}`}>
      <header>
        <nav className="navbar">
          <h1>PokeDeck</h1>
          <ul>
            <li><Link to="/config">Configuración</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <h2 style={{ textAlign: 'center', marginTop: '5rem', color: '#333' }}>
          ¡Bienvenido a PokeDeck! Explora y gestiona tus cartas favoritas
        </h2>
        <div className="wrapper">
          <section className="section">
            <Link to="/catalog" className="link-button">
              <h2>Catálogo de Cartas</h2>
              <img src="/images/img-sobres-transparency.png" alt="Catálogo de cartas" />
            </Link>
          </section>
          <section className="section">
            <Link to={`/cartas/${username}`} className="link-button">
              <h2>Tu Colección</h2>
              <img src="/images/img-rotom.png" alt="Tu colección de cartas" />
            </Link>
          </section>
          <section className="section">
            <Link to={`/cartas/popular`} className="link-button">
              <h2>Buzón</h2>
              <img src="/images/buzon.png" alt="buzon" />
            </Link>
          </section>
          <section className="section">
            <Link to={`/intercambio/${username}`} className="link-button">
              <h2>Intercambio de Cartas</h2>
              <img src="/images/img-intercambio.png" alt="Intercambio de cartas" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
