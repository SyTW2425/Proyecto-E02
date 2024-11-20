import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import Signup from './Signup';
import Signin from './Signin';

const Home = () => {
  return (
    <>
      <header className="header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">PokeDeck</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div className="container-fluid home-container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 text-center text-lg-left mb-4">
            <h1>Gotta Catch 'Em All!</h1>
            <p className="lead">Discover the perfect Pokémon card for any</p>
            <p>Trade Pokémon cards from anywhere!</p>
            <img src="/images/pokemon_trading_card_game_home_image.jpg" alt="Pokemon trading illustration" className="img-fluid" />
          </div>
          
          <div className="col-lg-6 col-md-12">
            <h2>Start trading for free</h2>
            <div className="row mt-3">
              <div className="col-md-6">
                <Signin />
              </div>
              {/* <div className="col-md-6">
                <Signup />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;