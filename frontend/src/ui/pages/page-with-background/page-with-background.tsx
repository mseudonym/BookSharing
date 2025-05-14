import React, { PropsWithChildren } from 'react';

import styles from '~/ui/pages/pages.module.css';

export const PageWithBackground = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.page}>
      {children}
    </div>
  );
};
