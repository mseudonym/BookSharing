import React, { PropsWithChildren } from 'react';

import styles from '~/ui/wrapper/wrapper.module.css';

import { WrapperAlign } from '~/types';

type WrapperProps = {
  align?: WrapperAlign;
  background?: 'white' | 'none';
  noPaddingHorizontal?: boolean;
  noPaddingVertical?: boolean;
  noGap?: boolean;
  className?: string;
}

export const Wrapper = ({ children, align = 'left', background = 'white', noPaddingHorizontal = false, noPaddingVertical = false, noGap = false, className }: PropsWithChildren<WrapperProps>) => {
  return (
    <div className={`${styles.wrapper} 
      ${styles[align]} 
      ${styles[background]} 
      ${noPaddingHorizontal && styles.noPaddingHorizontal} 
      ${noPaddingVertical && styles.noPaddingVertical}
      ${noGap && styles.noGap}
      ${className || ''}`}>
      {children}
    </div>
  );
};