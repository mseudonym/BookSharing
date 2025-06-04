import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppRoute } from '~/conts';
import { BookAdditionManuallyPage } from '~/pages/book-addition-manually-page';
import { BookAdditionPage } from '~/pages/book-addition-page/book-addition-page';
import { BookPage } from '~/pages/book-page';
import { EmailConfirmationPage } from '~/pages/email-confirmation-page';
import { EmailConfirmationWaitingPage } from '~/pages/email-confirmation-waiting-page';
import { ErrorPage } from '~/pages/error-page';
import { ForgotPasswordPage } from '~/pages/forgot-password-page';
import { FriendsPage } from '~/pages/friends-page';
import { ISBNScanningPage } from '~/pages/isbn-scanning-page/isbn-scanning-page';
import { LandingPage } from '~/pages/landing-page';
import { ProfileFillingPage } from '~/pages/profile-filling-page';
import { ProfilePage, UserPage } from '~/pages/profile-user';
import { LoginPage, RegistrationPage } from '~/pages/registration-login';
import { SearchFriendsPage } from '~/pages/search-friends-page';
import { EmailSettingsPage, PasswordSettingsPage } from '~/pages/settings';
import { SettingsPage, SecuritySettingsPage, ProfileSettingsPage } from '~/pages/settings';
import { ShelfPage } from '~/pages/shelf-page';
import { StoragePage } from '~/pages/storage-page';
import { queryClient } from '~/services/query-client';
import { theme } from '~/theme';
import { Layout } from '~/ui/layout';
import { PrivateRoute } from '~/ui/private-route';
import { PublicRoute } from '~/ui/public-route';

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: `${AppRoute.Root}`,
        element: <LandingPage />,
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
        path: `${AppRoute.ForgotPassword}`,
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    path: `${AppRoute.EmailConfirmationWaiting}`,
    element: <EmailConfirmationWaitingPage />,
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
    element: <PrivateRoute />,
    children: [
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
          {
            path: `${AppRoute.Storage}`,
            element: <StoragePage />,
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
            path: `${AppRoute.AddBookManually}`,
            element: <BookAdditionManuallyPage />,
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
            path: `${AppRoute.EmailSettings}`,
            element: <EmailSettingsPage />,
          },
          {
            path: `${AppRoute.PasswordSettings}`,
            element: <PasswordSettingsPage />,
          },
          {
            path: `${AppRoute.ScanningCode}`,
            element: <ISBNScanningPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>
  <App />
  //</React.StrictMode>
);