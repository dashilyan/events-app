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
]);

// Рендерим приложение с провайдером роутера
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <RouterProvider router={router} />
  // </StrictMode>
  <StrictMode>
  <Provider store={storage}>
    <RouterProvider router={router} />
  </Provider>
</StrictMode>
);