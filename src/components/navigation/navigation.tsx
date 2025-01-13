import type { FC, PropsWithChildren } from "react";
import styles from './navigation.module.css';

interface NavigationProps extends PropsWithChildren {
  variant: 'navAuto' | 'navLeft';
}

export const Navigation: FC<NavigationProps> = (props) => {
  return (
    <div className={styles[props.variant]}>
      {props.children}
    </div >
  );
}