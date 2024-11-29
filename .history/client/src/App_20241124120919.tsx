import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Signin from './components/Signin';
import './App.css';
import { Link } from 'react-router-dom';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory({
  v7_startTransition: true,
  v7_relativeSplatPath: true,
});

function App() {
  return (
    <HistoryRouter history={history}>
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
    </HistoryRouter>
  );
}

export default App;