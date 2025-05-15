import { SegmentedControl } from '@mantine/core';
import {
  BooksLibraryIcon24Regular,
  BooksLibraryIcon24Solid,
  People2Icon24Regular,
  People2Icon24Solid,
  FolderIcon24Regular,
  FolderIcon24Solid,
  People1Icon24Regular,
  People1Icon24Solid
} from '@skbkontur/icons';
import React from 'react';
import { useLocation } from 'react-router-dom';

import styles from '~/components/navbar/navbar.module.css';

import { AppRoute } from '~/conts';
import { router } from '~/main';

export const Navbar = () => {
  const { pathname } = useLocation();

  const navItems = [
    {
      value: AppRoute.Shelf,
      iconRegular: <BooksLibraryIcon24Regular />,
      iconSolid: <BooksLibraryIcon24Solid />,
    },
    {
      value: AppRoute.Friends,
      iconRegular: <People2Icon24Regular />,
      iconSolid: <People2Icon24Solid />,
    },
    {
      value: AppRoute.Storage,
      iconRegular: <FolderIcon24Regular />,
      iconSolid: <FolderIcon24Solid />,
    },
    {
      value: AppRoute.Profile,
      iconRegular: <People1Icon24Regular />,
      iconSolid: <People1Icon24Solid />,
    },
  ];

  const handleNavigate = (value: string) => {
    router.navigate(value);
  };

  return (
    <SegmentedControl
      size="md"
      withItemsBorders={false}
      radius="xl"
      value={pathname}
      onChange={handleNavigate}
      data={navItems.map((item) => ({
        value: item.value,
        label: pathname === item.value ? item.iconSolid : item.iconRegular,
      }))}
      classNames={{
        root: styles.navbarRoot,
        label: styles.navbarLabel,
        indicator: styles.navbarIndicator,
      }}
    />
  );
};