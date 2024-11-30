import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import MainPage from './mainPage';
import EventDescription from './descriptionPage';
import HomePage from './homePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './App.css';
import Breadcrumbs from './breadcrumbs.tsx';

import { Provider } from 'react-redux';
import storage from './reduxSlices/storage.tsx';

import {registerSW} from "virtual:pwa-register";

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
  registerSW()
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
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