import '@mantine/core/styles.css';
import './index.css';
import React from 'react';
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {MantineProvider} from '@mantine/core';
import {AppRoute} from './conts';
import {ProfilePage} from './pages/profile-page/profile-page';
import {BookPage} from './pages/book-page/book-page';
import {store} from "./store/store.ts";
import {checkAuthAction} from "./store/actions/user-actions.ts";
import { Provider } from 'react-redux';
import { LoginPage } from './pages/registration-login-page/login-page.tsx';
import {RegistrationPage} from "./pages/registration-login-page/registration-page.tsx";
import {WelcomePage} from "./pages/welcome-page/welcome-page.tsx";
import {ProfileFillingPage} from "./pages/profile-filling-page/profile-filling-page.tsx";

export const router = createBrowserRouter([
    {
        path: `${AppRoute.Root}`,
        element: <WelcomePage/>,
    },
    {
        path: `${AppRoute.Register}`,
        element: <RegistrationPage/>,
    },
    {
        path: `${AppRoute.Login}`,
        element: <LoginPage/>,
    },
    {
        path: `${AppRoute.Profile}`,
        element: <ProfilePage/>,
    },
    {
        path: `${AppRoute.ProfileFilling}`,
        element: <ProfileFillingPage/>,
    },
    {
        path: `${AppRoute.Book}`,
        element: <BookPage/>,
    }
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

store.dispatch(checkAuthAction())

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <MantineProvider>
                <RouterProvider router={router}/>
            </MantineProvider>
        </Provider>
    </React.StrictMode>
);
