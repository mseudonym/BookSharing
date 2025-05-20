import React, { PropsWithChildren } from 'react';

import styles from '~/components/header/header.module.css';

interface HeaderProps extends PropsWithChildren {
  variant: 'auto' | 'left' | 'right';
  withPadding?: boolean;
  hideOnDesktop?: boolean;
}

export const Header = ({ variant, withPadding, hideOnDesktop, children }: HeaderProps) => {
  return (
    <div className={`${styles.header} ${styles[variant]} ${withPadding && styles.padding} ${hideOnDesktop && styles.hideOnDesktop}`}>
      {children}
    </div>
  );
};
