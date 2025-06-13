import { AppShell } from '@mantine/core';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Navbar } from '~/components/navbar';
import { Sidebar } from '~/components/sidebar';
import { AppRoute } from '~/conts';

export const Layout = () => {
  const { pathname } = useLocation();

  const showNavbarRoutes = [
    AppRoute.Shelf,
    AppRoute.Friends,
    AppRoute.Storage,
    AppRoute.Profile,
  ];

  const shouldShowNavbar = showNavbarRoutes.includes(pathname as AppRoute);

  return (
    <AppShell
      navbar={{ width: 236, breakpoint: 'sm' }}
    >

      <Sidebar/>
      {shouldShowNavbar && <Navbar/>}

      <AppShell.Main>
        <Outlet/>
      </AppShell.Main>
    </AppShell>
  );
};