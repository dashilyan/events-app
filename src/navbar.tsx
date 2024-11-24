// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Импортируем стили для navbar

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/menu" className="navbar-link">Меню</Link>
      <Link to="/events" className="navbar-link">Мероприятия</Link>
    </div>
  );
};

export default Navbar;