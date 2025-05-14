import React, { PropsWithChildren } from 'react';

import styles from '~/ui/pages/pages.module.css';

import { PageWithBackground } from '~/ui/pages/page-with-background/page-with-background';


export const Page = ({ children }: PropsWithChildren) => {
  return (
    <PageWithBackground>
      <div className={styles.wrapper}>
        {children}
      </div>
    </PageWithBackground>
  );
};
