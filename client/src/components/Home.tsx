import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useTheme } from '../context/ThemeContext';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <h1>PokeDeck</h1>
      <ul>
        <li><Link to="/buscar-usuario">Buscar Usuario</Link></li>
        <li><Link to="/config">Configuración</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
}

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`home-container ${darkMode ? 'dark' : 'light'}`}>
      <header>
        <NavBar />
      </header>
      <main>
        <h2 style={{ textAlign: 'center', marginTop: '5rem', color: '#333' }}>
          ¡Bienvenido a PokeDeck! Explora y gestiona tus cartas favoritas
        </h2>
        <div className="wrapper">
          <section className="section">
            <Link to="/catalogo" className="link-button">
              <h2>Catálogo de Cartas</h2>
              <img src="/images/img-sobres-transparency.png" alt="Catálogo de cartas" />
            </Link>
          </section>
          <section className="section">
            <Link to={`/cartas/${localStorage.getItem('nombre_usuario')}`} className="link-button">
              <h2>Tu Colección</h2>
              <img src="/images/img-rotom.png" alt="Tu colección de cartas" />
            </Link>
          </section>
          <section className="section">
            <Link to={`/cartas/popular`} className="link-button">
              <h2>Cartas Más Populares</h2>
              <img src="/images/cartas-valiosas-background.png" alt="Cartas más populares" />
            </Link>
          </section>
          <section className="section">
            <Link to={'/intercambio'} className="link-button">
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
