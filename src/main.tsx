import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import MainPage from './mainPage';
import VisitPage from './visitPage';
import EventDescription from './descriptionPage';
import HomePage from './homePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './App.css';


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
    path: '/visit/:visitId',
    element: <VisitPage />
  },
  {
    path: '/events/:eventId',
    element: <EventDescription />
  }
]);

// Рендерим приложение с провайдером роутера
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);