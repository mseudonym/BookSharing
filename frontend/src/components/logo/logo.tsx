import { Image } from '@mantine/core';
import React from 'react';

import styles from '~/components/logo/logo.module.css';

import { LOGO_LARGE_SRC, LOGO_SMALL_SRC } from '~/conts';

type LogoProps = {
  isBigSize?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo = ({ isBigSize = false, className, onClick }: LogoProps) => {
  const src = isBigSize
    ? LOGO_LARGE_SRC
    : LOGO_SMALL_SRC;

  return (
    <Image loading='lazy' src={src} alt='Logo application'
      onClick={onClick} className={`${styles[isBigSize ? 'big' : 'small']} ${className}`}/>
  );
};
