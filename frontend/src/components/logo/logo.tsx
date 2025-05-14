import React from 'react';

import styles from '~/components/logo/logo.module.css';

type LogoProps = {
  size?: 'small'  | 'big';
}

export const Logo = ({ size = 'small' }: LogoProps) => {
  const src = size === 'big' ? '/logo-big.svg' : '/logo-small.svg';
  return (
    <img loading="lazy" src={src} alt="Logo application" className={styles[size]} />
  );
};
