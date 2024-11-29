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
        <li><Link to="/home">Home</Link></li>
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
        <section className="section">
          <h2>Catálogo de Cartas</h2>
          <p>Explora todas las cartas disponibles en nuestra plataforma.</p>
          {/* Aquí puedes añadir componentes o enlaces para ver el catálogo de cartas */}
        </section>
        <section className="section">
          <h2>Buscar Usuarios y Cartas</h2>
          <p>Busca otros usuarios y las cartas que poseen.</p>
          {/* Aquí puedes añadir componentes o enlaces para buscar usuarios y sus cartas */}
        </section>
        <section className="section">
          <h2>Intercambio de Cartas</h2>
          <p>Realiza intercambios de cartas con otros jugadores.</p>
          {/* Aquí puedes añadir componentes o enlaces para hacer intercambios de cartas */}
        </section>
      </main>
    </div>
  );
};

export default Home;