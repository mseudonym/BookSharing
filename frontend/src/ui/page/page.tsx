import React, { PropsWithChildren } from 'react';

import { PageBackground } from './page-background';
import styles from './page.module.css';

export const Page = ({ children }: PropsWithChildren) => {
  return (
    <PageBackground>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </PageBackground>
  );
};
