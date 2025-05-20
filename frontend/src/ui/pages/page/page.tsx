import { AppShell } from '@mantine/core';
import React, { PropsWithChildren, memo } from 'react';

import styles from '~/ui/pages/page/page.module.css';

import { Logo } from '~/components/logo';
import { Menu } from '~/components/menu/menu';
import { BackgroundColor } from '~/types';

const Navbar = memo(() => (
  <AppShell.Navbar className={styles.menu}>
    <Logo size="big" />
    <Menu />
  </AppShell.Navbar>
));

Navbar.displayName = 'Navbar';

type PageProps = {
  backgroundColor?: BackgroundColor;
  showMenu?: boolean;
}

export const Page = ({ children, backgroundColor = 'rainbow', showMenu = true}: PropsWithChildren<PageProps>) => {  
  return (
    <AppShell
      padding="var(--mantine-spacing-lg)"
      navbar={showMenu ? { width: { base: 236 }, breakpoint: 'sm' } : undefined}>

      {showMenu && <Navbar />}

      <AppShell.Main className={`${!showMenu && styles.mainWithoutMenu}`}>
        <div className={`${styles.page} ${styles[backgroundColor]} ${!showMenu && styles.pageWithoutMenu}`}>
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  );
};
