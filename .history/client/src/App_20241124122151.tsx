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
]);

function App() {
  return (
    <RouterProvider router={router}>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Signin</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Signin />} /> 
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </RouterProvider>
  );
}

export default App;