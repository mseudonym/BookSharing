import React, { PropsWithChildren } from 'react';

import styles from '~/ui/wrapper/wrapper.module.css';

import { WrapperAlign, WrapperBackground } from '~/types';

type WrapperProps = {
  align?: WrapperAlign;
  background?: WrapperBackground;
  noPaddingHorizontal?: boolean;
  noPaddingVertical?: boolean;
  noGap?: boolean;
}

export const Wrapper = ({ children, align = 'left', background = 'white', noPaddingHorizontal = false, noPaddingVertical = false, noGap = false }: PropsWithChildren<WrapperProps>) => {
  return (
    <div className={`${styles.wrapper} 
      ${styles[align]} 
      ${styles[background]} 
      ${noPaddingHorizontal && styles.noPaddingHorizontal} 
      ${noPaddingVertical && styles.noPaddingVertical}
      ${noGap && styles.noGap}`}>
      {children}
    </div>
  );
};