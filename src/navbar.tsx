import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Импортируем необходимые хуки из Redux
import { logout, logoutUser } from './reduxSlices/authSlice'; // Импортируем экшн logout
import axios from 'axios'; // Импортируем axios
import Cookies from 'js-cookie'; // Импортируем js-cookie для работы с cookies
import './App.css'; // Импортируем стили для navbar
import { setInputValue } from './reduxSlices/eventSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, username, is_staff } = useSelector((state) => state.auth); // Получаем данные о пользователе из Redux состояния

  const handleLogout = async (e) => {
    e.preventDefault();
    dispatch(logoutUser());
    // try {
    //   const csrfToken = Cookies.get('csrftoken'); // Получаем CSRF токен из cookies

    //   const response = await axios.post('/api/logout/', {}, {
    //     headers: {
    //       'X-CSRFToken': csrfToken, // Подставляем CSRF токен в заголовок запроса
    //       'Content-Type': 'application/json',
    //     }
    //   });

    //   if (response.status === 204) {
    //     dispatch(setInputValue(''));
    //     dispatch(logout());
    //     navigate('/auth');
    //   }
    // } catch (error) {
    //   console.error('Ошибка при выходе:', error);
    //   alert('Ошибка при выходе. Пожалуйста, попробуйте позже.');
    // }
  };

  return (
    <nav className="navbar">

      {isAuthenticated ? (
        <>
          <Link to="/lks" className="navbar-link">{username}</Link>
        </>
      ) : (
          <span></span>
      )}

      <Link to="/events" className="navbar-link">Мероприятия</Link>
      {isAuthenticated && is_staff ? (
        <>
        <Link to="/events-table" className='navbar-link'>Таблица мероприятий</Link>
        </>
      ) : (
        <></>
      )}

      {isAuthenticated? (
        <>
          <Link to="/visits" className="navbar-link">Посещения</Link>
        </>
      ) : (
        <></>
      )}

      {isAuthenticated? (
        <>
          <Link to="/events" onClick={handleLogout} className="navbar-link">Выход</Link>
        </>
      ) : (
        <Link to="/auth" className="navbar-link">Вход</Link>
      )}
    </nav>
  );
};

export default Navbar;