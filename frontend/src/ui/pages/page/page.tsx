import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { PropsWithChildren } from 'react';

import styles from '~/ui/pages/page/page.module.css';

export const Page = ({ children }: PropsWithChildren) => {
  const [opened] = useDisclosure();
  
  return (
    <AppShell
      navbar={{
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
        width: 236,
      }}
      padding="var(--mantine-spacing-lg)"
    >
      {/* <AppShell.Navbar>
      <AppShell.Navbar>
        <Logo size="big" />
      </AppShell.Navbar>
      */}

      <AppShell.Main>
        <div className={styles.page}>
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  );
};
