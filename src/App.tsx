import React from 'react';
import './App.css';  // Стили
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from './mainPage';  // Импортируем компонент
import EventDescription from './descriptionPage';
import HomePage from './homePage.tsx';
import { Provider } from 'react-redux';
import storage from './reduxSlices/storage.tsx';

function App() {
  const event = {
    event_name: 'Пример мероприятия',
    event_type: 'Тип мероприятия',
    description: 'Описание данного мероприятия...',
    duration: 'Продолжительность',
    img_url: 'http://192.168.56.101:9000/static/children.jpg'
  };

  const data = {
    visitId: '12345', // замените на актуальный id
    currentEvents: [
      {
       event_name: 'Мероприятие 1',
       event_type: 'Тип мероприятия 1',
       description: 'Описание мероприятия 1',
       duration: 'Продолжительность 1',
       img_url: 'http://192.168.56.101:9000/static/children.jpg'
      },
      {
       event_name: 'Мероприятие 2',
       event_type: 'Тип мероприятия 2',
       description: 'Описание мероприятия 2',
       duration: 'Продолжительность 2',
       img_url: 'http://192.168.56.101:9000/static/children.jpg'
      },
      {
       event_name: 'Мероприятие 3',
       event_type: 'Тип мероприятия 3',
       description: 'Описание мероприятия 3',
       duration: 'Продолжительность 3',
       img_url: 'http://192.168.56.101:9000/static/children.jpg'
      },
    ]
  };

  return (
      //<VisitPage visitId={data.visitId} currentEvents={data.currentEvents} />
      //<MainPage />

      // <EventDescription event={event} />
      <BrowserRouter basename="/RepoName"> {/* RepoName - название вашего репозитория */}
      <Routes>
        <Route path="/" index element={<HomePage />} />
        <Route path="/events" element={<MainPage />} />
        <Route path="/events/:eventId" element={<EventDescription />} />
      </Routes>
    </BrowserRouter>
  );

}

export default App;