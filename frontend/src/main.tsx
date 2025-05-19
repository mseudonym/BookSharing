import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import { Loader, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { checkAuth } from '~/actions/user-actions';
import { AppRoute } from '~/conts';
import { BookAdditionPage } from '~/pages/book-addition-page';
import { BookPage } from '~/pages/book-page';
import { EmailConfirmationPage } from '~/pages/email-confirmation-page';
import { ErrorPage } from '~/pages/error-page';
import { ForgotPasswordPage } from '~/pages/forgot-password-page';
import { FriendsPage } from '~/pages/friends-page';
import { ProfileFillingPage } from '~/pages/profile-filling-page';
import { ProfilePage, UserPage } from '~/pages/profile-user';
import { LoginPage, RegistrationPage } from '~/pages/registration-login';
import { SearchFriendsPage } from '~/pages/search-friends-page/search-friends-page';
import { SettingsPage, SecuritySettingsPage, ProfileSettingsPage } from '~/pages/settings';
import { ShelfPage } from '~/pages/shelf-page';
import { WelcomePage } from '~/pages/welcome-page';
import { queryClient } from '~/services/query-client';
import { theme } from '~/theme';
import { Layout } from '~/ui/layout';

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
    path: `${AppRoute.ForgotPassword}`,
    element: <ForgotPasswordPage />,
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
    path: `${AppRoute.Settings}`,
    element: <SettingsPage />,
  },
  {
    path: `${AppRoute.SecuritySettings}`,
    element: <SecuritySettingsPage />,
  },
  {
    path: `${AppRoute.ProfileSettings}`,
    element: <ProfileSettingsPage />,
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
    return <Loader />;
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