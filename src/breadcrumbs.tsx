import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './App.css';

const mockEvents = [
  { pk: 1, event_name: 'Выставка робототехники', event_type: 'Выставка', duration: '2 часа', description: 'Описание выставки', img_url: null },
  { pk: 2, event_name: 'Лекция по искусственному интеллекту', event_type: 'Лекция', duration: '1.5 часа', description: 'Описание лекция', img_url: null },
  { pk: 3, event_name: 'Мастер-класс по программированию', event_type: 'Мастер-класс', duration: '3 часа', description: 'Описание мастер-класса', img_url: null },
];

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'null');
  const breadcrumbsMapping = {
    '': 'Главная',
    'events': 'Мероприятия',
    'description': 'Описание',
    'visit':'Посещение',
    'visits':'Таблица посещений',
    'lks':'Личный кабинет',
    'auth':'Вход',
    'reg':'Регистрация'
  };
  const [eventNames, setEventNames] = useState({}); // Состояние для хранения имен мероприятий

  useEffect(() => {
    const fetchEventNames = async () => {
      // Создаем объект для хранения имен мероприятий по ID
      const newEventNames = {};
      try{
        const response = await fetch(`/api/events/`);
        const eventData = await response.json();
        eventData.forEach(event => {
          newEventNames[event.pk] = event.event_name;
        });
        setEventNames(newEventNames);
      } catch (error){
      mockEvents.forEach(event => {
        newEventNames[event.pk] = event.event_name;
      });
      setEventNames(newEventNames);
    }
    }
    fetchEventNames();
  }, []);


  return (
    <nav className="breadcrumbs mt-4">
      <Link to="/" style={{ color: '#006CDC' }}>Главная</Link>
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        let breadcrumbText = breadcrumbsMapping[pathname] || pathname;
        let separator = ' > '; // Initialize separator
        const containsVisit = pathnames.includes('visit');
        const isLastNumber = index === pathnames.length - 1 && !isNaN(parseInt(pathname));
    
        if (containsVisit && isLastNumber) {
          separator = ' ';
          breadcrumbText = ""; // or some other appropriate text, e.g., '...' or null.
        } else if (index === pathnames.length - 1 && !isNaN(parseInt(pathname)) && pathnames[index-1] !== 'visit') {
          breadcrumbText = eventNames[parseInt(pathname)] || `Мероприятие ${pathname}`;
        }
        // else if ((index === pathnames.length - 1 && !isNaN(parseInt(pathname)) && pathnames[index-1] == 'visit') || pathnames[index] == 'visit') {
        //   breadcrumbText="";
        // }

        return (
          <span key={routeTo}>
            {separator}
            <Link to={routeTo} style={{ color: '#006CDC' }}>{breadcrumbText}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;