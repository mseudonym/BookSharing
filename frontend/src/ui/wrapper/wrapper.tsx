import React, { PropsWithChildren } from 'react';

import styles from '~/ui/wrapper/wrapper.module.css';

export const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
};