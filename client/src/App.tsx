import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Home from './components/Home';
import Catalog from './components/Catalog';
import Logout from './components/Logout';
import Config from './components/Config';
import MyCollection from './components/Mycollection';
import AddCard from './components/AddCard';
import Intercambio from './components/Intercambio';
import Mail from './components/Mail';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/config" element={<Config />} />
            <Route path="/cartas/:username" element={<MyCollection />} />
            <Route path="/cartas/add/:username" element={<AddCard />} />
            <Route path="/intercambio/:username" element={<Intercambio />} />
            <Route path="/mail" element={<Mail />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;