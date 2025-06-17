import React, { PropsWithChildren } from 'react';

import styles from '~/ui/wrapper/wrapper.module.css';

import { WrapperAlign } from '~/types';

type WrapperProps = {
  align?: WrapperAlign;
  backgroundColor?: 'white' | 'none';
  noPaddingHorizontal?: boolean;
  noPaddingVertical?: boolean;
  noGap?: boolean;
  className?: string;
}

export const Wrapper = ({
  children,
  align = 'left',
  backgroundColor = 'white',
  noPaddingHorizontal = false,
  noPaddingVertical = false,
  noGap = false,
  className
}: PropsWithChildren<WrapperProps>) => {
  return (
    <div className={`${styles.wrapper} 
      ${styles[align]} 
      ${styles[backgroundColor]} 
      ${noPaddingHorizontal && styles.noPaddingHorizontal} 
      ${noPaddingVertical && styles.noPaddingVertical}
      ${noGap && styles.noGap}
      ${className || ''}`}>
      {children}
    </div>
  );
};