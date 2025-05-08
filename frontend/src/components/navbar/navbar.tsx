import styles from './navbar.module.css';
import { Tabs } from '@mantine/core';
import { AppRoute } from '../../conts';
import {
  BooksLibraryIcon24Regular,
  BooksLibraryIcon24Solid,
  People2Icon24Regular,
  People2Icon24Solid,
  FolderIcon24Regular,
  FolderIcon24Solid,
  People1Icon24Regular,
  People1Icon24Solid,
} from '@skbkontur/icons';
import { useLocation, useNavigate } from 'react-router';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (value: string | null) => {
    if (value) {
      navigate(value);
    }
  };

  return (
    <Tabs
      value={location.pathname}
      onChange={handleChange}
      classNames={{
        root: styles.navbarRoot,
        list: styles.navbarList,
        tab: styles.navbarTab,
      }}
    >
      <Tabs.List>
        <Tabs.Tab value={AppRoute.Shelf}>
          {location.pathname === AppRoute.Shelf ? <BooksLibraryIcon24Solid /> : <BooksLibraryIcon24Regular />}
        </Tabs.Tab>
        <Tabs.Tab value={AppRoute.Friends}>
          {location.pathname === AppRoute.Friends ? <People2Icon24Solid /> : <People2Icon24Regular />}
        </Tabs.Tab>
        <Tabs.Tab value={AppRoute.Storage}>
          {location.pathname === AppRoute.Storage ? <FolderIcon24Solid /> : <FolderIcon24Regular />}
        </Tabs.Tab>
        <Tabs.Tab value={AppRoute.Profile}>
          {location.pathname === AppRoute.Profile ? <People1Icon24Solid /> : <People1Icon24Regular />}
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};
