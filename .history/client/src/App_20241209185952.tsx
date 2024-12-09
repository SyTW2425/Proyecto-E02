import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Home from './components/Home';
import Logout from './components/Logout';
import Config from './components/Config';
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
            <Route path="/logout" element={<Logout />} />
            <Route path="/config" element={<Config />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;