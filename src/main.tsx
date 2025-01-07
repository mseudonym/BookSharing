import '@mantine/core/styles.css';
import './index.css';
import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { AppRoute } from './conts';
import { ProfilePage } from './pages/profile-page/profile-page';
import { BookPage } from './pages/book-page/book-page';
import {store} from "./store/store.ts";
import {checkAuth} from "./store/actions/user.ts";
import { WelcomePage } from './pages/welcome/welcome-page.tsx';


export const router = createBrowserRouter([
  {
    path: `${AppRoute.Root}`,
    element: <WelcomePage />,
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

store.dispatch(checkAuth)

root.render(
  <React.StrictMode>
    <MantineProvider>
      <RouterProvider router={router}/>
    </MantineProvider>
  </React.StrictMode>
);
