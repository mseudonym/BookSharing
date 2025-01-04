import '@mantine/core/styles.css';
import './index.css';
import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { AppRoute } from './conts';
import { ProfilePage } from './pages/profile-page/profile-page';
import { BookPage } from './pages/book-page/book-page';


const router = createBrowserRouter([
  {
    path: `${AppRoute.Root}`,
    element: <Navigate to={AppRoute.Profile} />,
  },
  {
    path: `${AppRoute.Profile}`,
    element: <ProfilePage/>,
  },
  {
    path: `${AppRoute.Book}`,
    element: <BookPage/>,
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MantineProvider>
      <RouterProvider router={router}/>
    </MantineProvider>
  </React.StrictMode>
);
