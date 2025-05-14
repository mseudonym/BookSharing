import React, { PropsWithChildren } from 'react';

import styles from '~/ui/wrapper/wrapper.module.css';

type WrapperProps = {
  align?: 'left' | 'center';
  background?: 'white' | 'none';
  withPadding?: boolean;
}

export const Wrapper = ({ children, align = 'left', background = 'white', withPadding = true }: PropsWithChildren<WrapperProps>) => {
  return (
    <div className={`${styles.wrapper} ${styles[align]} ${styles[background]} ${withPadding && styles.withPadding}`}>
      {children}
    </div>
  );
};