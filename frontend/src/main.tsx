import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import { MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { checkAuth } from './actions/user-actions.ts';
import { Loading } from './components/loading/loading.tsx';
import { AppRoute } from './conts';
import { BookAdditionPage } from './pages/book-addition-page/book-addition-page.tsx';
import { BookPage } from './pages/book-page/book-page';
import { EmailConfirmationPage } from './pages/email-confirmation-page/email-confirmation-page.tsx';
import { ErrorPage } from './pages/error-page/error-page.tsx';
import { FriendsPage } from './pages/friends-page/friends-page.tsx';
import { ProfileFillingPage } from './pages/profile-filling-page/profile-filling-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { LoginPage } from './pages/registration-login';
import { UserPage } from './pages/user-page/user-page';
import { RegistrationPage } from './pages/registration-login/registration-page/registration-page';
import { WelcomePage } from './pages/welcome-page/welcome-page';
import { queryClient } from './services/query-client.ts';
import { ShelfPage } from './pages/shelf-page/shelf-page.tsx';
import { SearchFriendsPage } from './pages/search-friends-page/search-friends-page.tsx';
import { theme } from './theme';
import { Layout } from './ui/layout.tsx';
import { Notifications } from '@mantine/notifications';

export const router = createBrowserRouter([
  {
    path: `${AppRoute.Root}`,
    element: <WelcomePage />,
  },
  {
    path: `${AppRoute.Register}`,
    element: <RegistrationPage />,
  },
  {
    path: `${AppRoute.Login}`,
    element: <LoginPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: `${AppRoute.Profile}`,
        element: <ProfilePage />,
      },
      {
        path: `${AppRoute.Shelf}`,
        element: <ShelfPage />,
      },
      {
        path: `${AppRoute.Friends}`,
        element: <FriendsPage />,
      },
    ],
  },
  {
    path: `${AppRoute.EmailConfirmation}`,
    element: <EmailConfirmationPage />,
  },
  {
    path: `${AppRoute.ProfileFilling}`,
    element: <ProfileFillingPage />,
  },
  {
    path: `${AppRoute.User}`,
    element: <UserPage />,
  },
  {
    path: `${AppRoute.Book}`,
    element: <BookPage />,
  },
  {
    path: `${AppRoute.AddBook}`,
    element: <BookAdditionPage />,
  },
  {
    path: `${AppRoute.SearchFriends}`,
    element: <SearchFriendsPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

const AppWrapper = () => {
  const [isAuthChecked, setIsAuthChecked] = React.useState(false);

  React.useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsAuthChecked(true);
    };

    initializeAuth();
  }, []);

  if (!isAuthChecked) {
    return <Loading />;
  }

  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        <AppWrapper />
      </QueryClientProvider>
    </MantineProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);