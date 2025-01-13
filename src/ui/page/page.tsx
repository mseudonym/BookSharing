import { PropsWithChildren } from 'react';
import styles from './page.module.css';

export const Page = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.page}>
      {children}
    </div>
  );
}