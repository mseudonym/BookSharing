import { AppShell, Flex, Indicator, SegmentedControl } from '@mantine/core';
import {
  BooksLibraryIcon24Regular,
  BooksLibraryIcon24Solid,
  FolderIcon24Regular,
  FolderIcon24Solid,
  NotificationBellIcon24Regular,
  NotificationBellIcon24Solid,
  People1Icon24Regular,
  People1Icon24Solid,
  People2Icon24Regular,
  People2Icon24Solid,
  SettingsGearIcon24Regular,
  SettingsGearIcon24Solid
} from '@skbkontur/icons';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '~/components/sidebar/sidebar.module.css';

import { Logo } from '~/components/logo';
import { AppRoute } from '~/conts';
import { useGetNotificationsUnreadCount } from '~/generated-api/notifications/notifications';
import { router } from '~/main';
import { NotificationPage } from '~/pages/notification-page';

const allSidebarItems = [
  {
    value: AppRoute.Shelf,
    label: 'Полка друзей',
    iconRegular: <BooksLibraryIcon24Regular/>,
    iconSolid: <BooksLibraryIcon24Solid/>,
    withBadge: false
  },
  {
    value: AppRoute.Friends,
    label: 'Друзья',
    iconRegular: <People2Icon24Regular/>,
    iconSolid: <People2Icon24Solid/>,
    withBadge: false
  },
  {
    value: AppRoute.Storage,
    label: 'Предметы',
    iconRegular: <FolderIcon24Regular/>,
    iconSolid: <FolderIcon24Solid/>,
    withBadge: false
  },
  {
    value: AppRoute.Profile,
    label: 'Профиль',
    iconRegular: <People1Icon24Regular/>,
    iconSolid: <People1Icon24Solid/>,
    withBadge: false
  },
  {
    value: '',
    label: 'Уведомления',
    iconRegular: <NotificationBellIcon24Regular/>,
    iconSolid: <NotificationBellIcon24Solid/>,
    withBadge: true
  },
  {
    value: AppRoute.Settings,
    label: 'Настройки',
    iconRegular: <SettingsGearIcon24Regular/>,
    iconSolid: <SettingsGearIcon24Solid/>,
    withBadge: false
  },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { data: unreadNotificationCount, isLoading, isError } = useGetNotificationsUnreadCount();

  const handleNavigate = (value: string) => {
    if (value === '') {
      setIsNotificationsOpen(true);
      return;
    }
    router.navigate(value).then();
  };

  const mainItems = allSidebarItems.slice(0, 4);
  const footerItems = allSidebarItems.slice(4);

  const menuData = [
    ...mainItems.map((item) => ({
      ...item,
      label: (
        <Flex align='center' gap='sm'>
          {pathname === item.value ? item.iconSolid : item.iconRegular}
          {item.label}
        </Flex>
      )
    })),
    ...footerItems.map((item) => ({
      ...item,
      label: (
        <Flex align='center' gap='sm'>
          <Indicator processing color='red' inline label={unreadNotificationCount} size={16} disabled={!(!isError && !isLoading && item.withBadge && unreadNotificationCount! > 0)}>
            {pathname === item.value ? item.iconSolid : item.iconRegular}
          </Indicator>
          {item.label}
        </Flex>
      )
    }))
  ];

  return (
    <AppShell.Navbar className={styles.menu}>
      <AppShell.Section>
        <Logo isBigSize onClick={() => router.navigate(AppRoute.Root)} className={styles.clickableLogo}/>
      </AppShell.Section>

      <AppShell.Section grow>
        <SegmentedControl
          orientation='vertical'
          size='md'
          withItemsBorders={false}
          radius='md'
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

      <NotificationPage isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)}/>
    </AppShell.Navbar>
  );
};