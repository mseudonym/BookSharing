import styles from './page.module.css';
import { PropsWithChildren } from 'react';
import { PageBackground } from './page-background';
import { Navbar } from '../../components/navbar/navbar';

export const PageWithNavbar = ({ children }: PropsWithChildren) => {
  return (
    <>
      <PageBackground>
        <div className={styles.content}>
          {children}
        </div>
      </PageBackground>
      <Navbar />
    </>
  );
};
