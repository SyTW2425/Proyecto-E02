import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <h1>PokeDeck</h1>
      <ul>
        {/* <li><Link to="/config">Configuración</Link></li> */}
        <li><Link to="/">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;