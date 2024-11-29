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
          <div>One</div>
          <div>Two</div>
          <div>Three</div>
          <div>Four</div>
          <div>Five</div>
        </div>
      </main>
    </div>
  );
};

export default Home;