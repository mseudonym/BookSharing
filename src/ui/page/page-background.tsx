import { PropsWithChildren } from 'react';
import styles from './page.module.css';

export const PageBackground = ({ children }: PropsWithChildren) => {
  return (
    <body className={styles.page}>
      {children}
    </body>
  );
}