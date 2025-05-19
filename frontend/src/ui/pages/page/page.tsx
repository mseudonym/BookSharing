import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { PropsWithChildren } from 'react';

import styles from '~/ui/pages/page/page.module.css';

import { BackgroundColor } from '~/types';

//import { Logo } from '~/components/logo';

type PageProps = {
  backgroundColor?: BackgroundColor;
}

export const Page = ({ children, backgroundColor = 'rainbow' }: PropsWithChildren<PageProps>) => {
  const [opened] = useDisclosure();
  
  return (
    <AppShell
      navbar={{
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
        width: 236,
      }}
      padding="var(--mantine-spacing-lg)">

      {/* <AppShell.Navbar>
        <Logo size="big" />
      </AppShell.Navbar> */}

      <AppShell.Main>
        <div className={`${styles.page} ${styles[backgroundColor]}`}>
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  );
};
