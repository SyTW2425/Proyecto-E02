import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Signin from './components/Signin';
import './App.css';
import { Link } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <Home />,
  },
]);

function NavBar() {
  return (
    <nav className="navbar">
      <h1>PokeDeck</h1>
      <ul>
        <li><Link to="/">Página 1</Link></li>
        <li><Link to="/signup">Página 2</Link></li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <RouterProvider router={router}>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Signin />} /> 
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </RouterProvider>
  );
}

export default App;