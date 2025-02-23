import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import {Halak } from './Halak';
import { Fogasok } from './Fogasok';
import { Horgaszok } from './Horgaszok';
import { Tavak } from './Tavak';
import { Feladatok } from './Feladatok';

export const App = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/feladatok">Feladatok</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/halak">Halak</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/fogasok">Fogások</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/horgaszok">Horgászok</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/tavak">Tavak</NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/feladatok" element={<Feladatok />} />
        <Route path="/halak" element={<Halak />} />
        <Route path="/fogasok" element={<Fogasok />} />
        <Route path="/horgaszok" element={<Horgaszok />} />
        <Route path="/tavak" element={<Tavak />} />
      </Routes>
    </Router>
  );
};