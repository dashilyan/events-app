import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import EventsPage from './eventsPage';
import EventDescription from './descriptionPage';
import HomePage from './homePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './App.css';
import AuthPage from './authPage.tsx';
import VisitPage from './visitPage.tsx';
import VisitsTable from './visitsTablePage.tsx';
import LKSPage from './lksPage.tsx';
import RegPage from './regPage.tsx';
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
  },
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/visit/:visitId',
    element: <VisitPage />
  },
  {
    path: '/visits',
    element: <VisitsTable />
  },
  {
    path: '/lks',
    element: <LKSPage />
  },
  {
    path: '/reg',
    element: <RegPage />
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