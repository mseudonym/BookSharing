import { PropsWithChildren } from 'react';
import styles from './page.module.css';

export const PageBackground = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.page}>
      {children}
    </div>
  );
}