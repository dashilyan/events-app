import React, {useEffect} from 'react';
import './App.css';  // Стили
import { createBrowserRouter, RouterProvider, BrowserRouter, Route, Routes } from "react-router-dom";
import EventsPage from './eventsPage';  // Импортируем компонент
import EventDescription from './descriptionPage';
import HomePage from './homePage.tsx';
import Breadcrumbs from './breadcrumbs.tsx';
import { Provider } from 'react-redux';
import storage from './reduxSlices/storage.tsx';

import AuthPage from './authPage.tsx';
import VisitPage from './visitPage.tsx';
import VisitsTable from './visitsTablePage.tsx';
import LKSPage from './lksPage.tsx';
import RegPage from './regPage.tsx';

import EventsTable from './moderator-interface/eventsTablePage.tsx'
import EditEvent from './moderator-interface/editEventPage.tsx'
import ForbiddenPage from './403Page.tsx';
import ErrorNoPage from './404Page.tsx';

function App() {

  useEffect(() => {
    if (window.TAURI) {
      const { invoke } = window.TAURI.tauri;

      invoke('tauri', { cmd: 'create' })
        .then((response: any) => console.log(response))
        .catch((error: any) => console.log(error));

      return () => {
        invoke('tauri', { cmd: 'close' })
          .then((response: any) => console.log(response))
          .catch((error: any) => console.log(error));
      };
    }
  }, []);

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
    },
    {
      path: '/events-table',
      element: <EventsTable />
    },
    {
      path: '/404',
      element: <ErrorNoPage />
    },
    {
      path: '/403',
      element: <ForbiddenPage />
    },
    {
      path: '/edit-event/:eventId',
      element: <EditEvent />
    },
    {
      path: '/edit-event/',
      element: <EditEvent />
    },
  ], { basename: '/events-app' });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/events-app/serviceWorker.js")
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
