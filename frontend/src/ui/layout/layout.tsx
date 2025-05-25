import { AppShell } from '@mantine/core';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Menu } from '~/components/menu/menu';
import { Navbar } from '~/components/navbar';
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
      navbar={{ width: 236, breakpoint: 'sm'}}
    >
      
      <Menu />
      {shouldShowNavbar && <Navbar />}

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};