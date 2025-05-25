import { AppShell, SegmentedControl, Drawer } from '@mantine/core';
import {
  BooksLibraryIcon24Regular,
  BooksLibraryIcon24Solid,
  People2Icon24Regular,
  People2Icon24Solid,
  FolderIcon24Regular,
  FolderIcon24Solid,
  People1Icon24Regular,
  People1Icon24Solid,
  SettingsGearIcon24Regular,
  SettingsGearIcon24Solid,
  NotificationBellIcon24Regular,
  NotificationBellIcon24Solid
} from '@skbkontur/icons';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '~/components/sidebar/sidebar.module.css';

import { Logo } from '~/components/logo';
import { AppRoute } from '~/conts';
import { router } from '~/main';

const allSidebarItems = [
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
  {
    value: '',
    label: 'Уведомления',
    iconRegular: <NotificationBellIcon24Regular />,
    iconSolid: <NotificationBellIcon24Solid />,
  },
  {
    value: AppRoute.Settings,
    label: 'Настройки',
    iconRegular: <SettingsGearIcon24Regular />,
    iconSolid: <SettingsGearIcon24Solid />,
  },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleNavigate = (value: string) => {
    if (value === '') {
      setIsNotificationsOpen(true);
      return;
    }
    router.navigate(value);
  };
  
  const mainItems = allSidebarItems.slice(0, 4);
  const footerItems = allSidebarItems.slice(4);

  const menuData = [
    ...mainItems.map((item) => ({
      ...item,
      label: (
        <div className={styles.menuItem}>
          {pathname === item.value ? item.iconSolid : item.iconRegular}
          {item.label}
        </div>
      )
    })),
    ...footerItems.map((item) => ({
      ...item,
      label: (
        <div className={styles.menuItem}>
          {pathname === item.value ? item.iconSolid : item.iconRegular}
          {item.label}
        </div>
      )
    }))
  ];

  return (
    <AppShell.Navbar className={styles.menu}>
      <AppShell.Section>
        <Logo size='big'/>
      </AppShell.Section>

      <AppShell.Section grow>
        <SegmentedControl
          orientation="vertical"
          size="md"
          withItemsBorders={false}
          radius="md"
          value={pathname}
          onChange={handleNavigate}
          data={menuData}
          classNames={{
            root: styles.menuRoot,
            label: styles.menuLabel,
            indicator: styles.menuIndicator,
            control: styles.menuControl
          }}
        />
      </AppShell.Section>

      <Drawer
        opened={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Уведомления"
        position="right"
        size="md"
      >
        {/* Здесь будет содержимое уведомлений */}
      </Drawer>
    </AppShell.Navbar>  
  );
};