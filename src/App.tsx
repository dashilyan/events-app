import React from 'react';
import './App.css';  // Стили
import { createBrowserRouter, RouterProvider, BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from './mainPage';  // Импортируем компонент
import EventDescription from './descriptionPage';
import HomePage from './homePage.tsx';
import Breadcrumbs from './breadcrumbs.tsx';
import { Provider } from 'react-redux';
import storage from './reduxSlices/storage.tsx';

function App() {
  // const event = {
  //   event_name: 'Пример мероприятия',
  //   event_type: 'Тип мероприятия',
  //   description: 'Описание данного мероприятия...',
  //   duration: 'Продолжительность',
  //   img_url: 'http://192.168.56.101:9000/static/children.jpg'
  // };

  // const data = {
  //   visitId: '12345', // замените на актуальный id
  //   currentEvents: [
  //     {
  //      event_name: 'Мероприятие 1',
  //      event_type: 'Тип мероприятия 1',
  //      description: 'Описание мероприятия 1',
  //      duration: 'Продолжительность 1',
  //      img_url: 'http://192.168.56.101:9000/static/children.jpg'
  //     },
  //     {
  //      event_name: 'Мероприятие 2',
  //      event_type: 'Тип мероприятия 2',
  //      description: 'Описание мероприятия 2',
  //      duration: 'Продолжительность 2',
  //      img_url: 'http://192.168.56.101:9000/static/children.jpg'
  //     },
  //     {
  //      event_name: 'Мероприятие 3',
  //      event_type: 'Тип мероприятия 3',
  //      description: 'Описание мероприятия 3',
  //      duration: 'Продолжительность 3',
  //      img_url: 'http://192.168.56.101:9000/static/children.jpg'
  //     },
  //   ]
  // };

  // Создаем маршрутизатор с путями для всех страниц
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/events',
      element: <MainPage />
    },
    {
      path: '/events/:eventId',
      element: <EventDescription />
    },
    {
      path: '/menu',
      element: <Breadcrumbs />
    }
  ], { basename: '/events-app' });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }
  return (
    <Provider store={storage}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
