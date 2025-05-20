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
import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '~/components/menu/menu.module.css';

import { AppRoute } from '~/conts';
import { router } from '~/main';

const navItems = [
  {
    value: AppRoute.Shelf,
    label: 'Полка друзей',
    iconRegular: <BooksLibraryIcon24Regular />,
    iconSolid: <BooksLibraryIcon24Solid />,
  },
  {
    value: AppRoute.Friends,
    label: 'Друзья',
    iconRegular: <People2Icon24Regular />,
    iconSolid: <People2Icon24Solid />,
  },
  {
    value: AppRoute.Storage,
    label: 'Предметы',
    iconRegular: <FolderIcon24Regular />,
    iconSolid: <FolderIcon24Solid />,
  },
  {
    value: AppRoute.Profile,
    label: 'Профиль',
    iconRegular: <People1Icon24Regular />,
    iconSolid: <People1Icon24Solid />,
  },
];

export const Menu = memo(() => {
  const { pathname } = useLocation();

  const handleNavigate = (value: string) => {
    router.navigate(value);
  };

  return (
    <SegmentedControl
      orientation="vertical"
      size="md"
      withItemsBorders={false}
      radius="md"
      value={pathname}
      onChange={handleNavigate}
      data={navItems.map((item) => ({
        value: item.value,
        label: (
          <div className={styles.menuItem}>
            {pathname === item.value ? item.iconSolid : item.iconRegular}
            {item.label}
          </div>
        ),
      }))}
      classNames={{
        root: styles.menuRoot,
        label: styles.menuLabel,
        indicator: styles.menuIndicator,
      }}
    />
  );
});

Menu.displayName = 'Menu';