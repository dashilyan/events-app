// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Импортируем стили для navbar

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/" className="navbar-link">Главная</Link>
      <Link to="/main" className="navbar-link">Услуги</Link>
    </div>
  );
};

export default Navbar;