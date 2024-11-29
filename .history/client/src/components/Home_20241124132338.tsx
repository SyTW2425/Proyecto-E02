import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import Signup from './Signup';
import Signin from './Signin';

function NavBar() {
  return (
    <nav className="navbar">
      <h1>PokeDeck</h1>
      <ul>
        <li><Link to="/home">Home</Link></li>
      </ul>
    </nav>
  );
}

const Home = () => {
  return (
    <div className="container">
      <NavBar />
    </div>
  );
};

export default Home;