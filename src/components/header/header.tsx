import type { PropsWithChildren } from 'react';
import styles from './header.module.css';

interface HeaderProps extends PropsWithChildren {
  variant: 'auto' | 'left' | 'right' | 'autoPadding' | 'leftPadding' | 'rightPadding';
}

export const Header = ({ variant, children }: HeaderProps) => {
  return (
    <div className={`${styles.header} ${styles[variant]}`}>
      {children}
    </div>
  );
};
