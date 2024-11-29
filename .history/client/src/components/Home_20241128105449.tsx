import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import Signup from './Signup';
import Signin from './Signin';
import Logout from './Logout';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <h1>PokeDeck</h1>
      <span className="menu-toggle" onClick={toggleMenu}>
        &#9776;
      </span>
      <ul className={menuOpen ? 'active' : ''}>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
}

const Home = () => {
  return (
    <div className="fullscreen-container">
      <header>
        <NavBar />
      </header>
      <main>
        <div className="wrapper">
          <section className="section">
            <Link to="/catalogo" className="link-button">
              <h2>Catálogo de Cartas</h2>
              <img src="/images/img-sobres-transparency.png" alt="Icono de catálogo" />
            </Link>
          </section>
          <section className="section">
            <h2>Mis Cartas</h2>
            <Link to="/baraja" className="link-button"> <img src="/images/img-baraja.jpg" alt="Icono de baraja" /></Link>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;