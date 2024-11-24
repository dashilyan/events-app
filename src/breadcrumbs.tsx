import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './App.css'; // Импортируем стили для breadcrumbs

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'null'); // Убираем пустые элементы и 'null'

  const breadcrumbsMapping = {
    '': 'Главная',
    'main': 'Услуги',
    'description': 'Описание'
  };

  return (
    <nav className="breadcrumbs mt-4">
      <Link to="/" style={{ color: '#006CDC' }}>Главная</Link>
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;

        const isNumber = !isNaN(pathname) || pathname === 'null';

        if (isNumber) return null;

        const breadcrumbText = breadcrumbsMapping[pathname] || pathname;

        return (
          <span key={routeTo}>
            {' > '} {/* Разделитель */}
            <Link to={routeTo} style={{ color: '#006CDC' }}>{breadcrumbText}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;