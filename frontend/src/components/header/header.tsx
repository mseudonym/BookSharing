import React, { PropsWithChildren } from 'react';

import styles from '~/components/header/header.module.css';

interface HeaderProps extends PropsWithChildren {
  variant: 'auto' | 'left' | 'right';
  withPadding?: boolean;
}

export const Header = ({ variant, withPadding, children }: HeaderProps) => {
  return (
    <div className={`${styles.header} ${styles[variant]} ${withPadding && styles.padding}`}>
      {children}
    </div>
  );
};
