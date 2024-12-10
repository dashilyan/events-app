import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import EventsPage from './eventsPage';
import EventDescription from './descriptionPage';
import HomePage from './homePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './App.css';
import Breadcrumbs from './breadcrumbs.tsx';

import { Provider } from 'react-redux';
import storage from './reduxSlices/storage.tsx';

// Создаем маршрутизатор с путями для всех страниц
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/events',
    element: <EventsPage />
  },
  {
    path: '/events/:eventId',
    element: <EventDescription />
  }
], { basename: '/events-app' });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/events-app/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}

// Рендерим приложение с провайдером роутера
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>
);