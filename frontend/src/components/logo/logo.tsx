import { Image } from '@mantine/core';
import React from 'react';

import styles from '~/components/logo/logo.module.css';

type LogoProps = {
  size?: 'small' | 'big';
  className?: string;
}

export const Logo = ({ size = 'small', className }: LogoProps) => {
  const src = size === 'big' ? '/logo-big.svg' : '/logo-small.svg';
  return (
    <Image loading='lazy' src={src} alt='Logo application' className={`${styles[size]} ${className}`}/>
  );
};
