import React from 'react';

import styles from '~/components/logo/logo.module.css';

export const Logo = () => {
  return (
    <img loading="lazy" src="/logo.svg" alt="Logo application" className={styles.logo} />
  );
};
