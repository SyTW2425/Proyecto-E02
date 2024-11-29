import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import Signup from './Signup';
import Signin from './Signin';

const Home = () => {
  return (
    <div className="container">
      <header className="header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">PokeDeck</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signin">Sign In</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
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