import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/navbar/navbar';
import { AppRoute } from '../conts';

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
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
};