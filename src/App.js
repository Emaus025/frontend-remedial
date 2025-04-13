import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Logs from './components/Logs';
import ProtectedRoute from './components/ProtectedRoute';
import './styles.css';

const App = () => (
  <Router>
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/logs" element={<Logs />} />
      </Route>
    </Routes>
  </Router>
);

export default App;