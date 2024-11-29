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
        <div className="row">
          <div className="column">
            <div className="column">
              <section className="section">
                <h2>Perfil de Usuario</h2>
                <p>Consulta tu perfil de usuario.</p>
                {/* Aquí puedes añadir componentes o enlaces para ver tu perfil de usuario */}
              </section>
            </div>
            <div className="column">
              <section className="section">
                <h2>Introduce tu Carta</h2>
                <p>Introduce una nueva carta para tu colección.</p>
                {/* Aquí puedes añadir componentes o enlaces para crear una carta */}
              </section>
            </div>
          </div>
          <div className="column">
            <section className="section">
              <h2>Cartas en tu Colección</h2>
              <p>Consulta las cartas que tienes en tu colección.</p>
              {/* Aquí puedes añadir componentes o enlaces para ver las cartas que tienes */}
            </section>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <section className="section">
              <h2>Catálogo de Cartas</h2>
              <Link to="/catalogo" className="link-button">
                <img src="/images/img-sobres.jpg" alt="Icono de catálogo" />
              </Link>
            </section>
          </div>
          <div className="column">
            <section className="section">
              <h2>Cartas más valiosas</h2>
              <p>Descubre las cartas más valiosas en nuestra plataforma.</p>
              {/* Aquí puedes añadir componentes o enlaces para ver las cartas más valiosas */}
            </section>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <section className="section">
              <h2>Buscar Usuarios y Cartas</h2>
              <p>Busca otros usuarios y las cartas que poseen.</p>
              {/* Aquí puedes añadir componentes o enlaces para buscar usuarios y sus cartas */}
            </section>
          </div>
          <div className="column">
            <section className="section">
              <h2>Intercambio de Cartas</h2>
              <p>Realiza intercambios de cartas con otros jugadores.</p>
              {/* Aquí puedes añadir componentes o enlaces para hacer intercambios de cartas */}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;