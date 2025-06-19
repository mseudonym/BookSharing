import React, { PropsWithChildren } from 'react';

import styles from '~/components/header/header.module.css';

interface HeaderProps extends PropsWithChildren {
  variant: 'auto' | 'left' | 'right';
  withMaxHeight?: boolean;
  withPadding?: boolean;
  hideOnDesktop?: boolean;
  className?: string;
}

export const Header = ({
  variant,
  withMaxHeight = true,
  withPadding,
  hideOnDesktop,
  className,
  children
}: HeaderProps) => {
  return (
    <div
      className={`${styles.header} ${styles[variant]} ${withMaxHeight && styles.maxHeight} 
      ${withPadding && styles.withPadding} ${hideOnDesktop && styles.hideOnDesktop} ${className}`}>
      {children}
    </div>
  );
};
