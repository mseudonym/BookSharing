import type { FC, PropsWithChildren } from "react";
import styles from './header.module.css';

interface HeaderProps extends PropsWithChildren {
  variant: 'auto' | 'left' | 'right' | 'autoPadding' | 'leftPadding' | 'rightPadding';
}

export const Header: FC<HeaderProps> = (props) => {
  return (
    <div className={`${styles.header} ${styles[props.variant]}`}>
      {props.children}
    </div >
  );
}