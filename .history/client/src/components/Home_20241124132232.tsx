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
      <header className="header">
        <h1>Gotta Catch 'Em All!</h1>
      </header>
      <aside className="sidebar">
        {/* Aquí puedes agregar contenido para la barra lateral si es necesario */}
      </aside>
      <main className="main">
        <div className="text-center text-lg-left mb-4">
          <h1>Gotta Catch 'Em All!</h1>
          <p className="lead">Discover the perfect Pokémon card for any</p>
          <p>Trade Pokémon cards from anywhere!</p>
          <img src="/images/pokemon_trading_card_game_home_image.jpg" alt="Pokemon trading illustration" className="img-fluid" />
        </div>
      </main>
      <section className="section">
      </section>
      <div className="content">
        {/* Aquí puedes agregar contenido adicional si es necesario */}
      </div>
      <footer className="footer">
        <p>&copy; 2024 PokeDeck. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;