import { Image, Text } from '@mantine/core';
import React from 'react';

import styles from '~/components/illustration-wrapper/illustration-wrapper.module.css';

interface IllustrationWrapperProps {
  src: string;
  alt: string;
  text?: string;
  size?: 'small' | 'big';
}

export const IllustrationWrapper = ({ src, alt, text, size = 'small' }: IllustrationWrapperProps) => {
  return (
    <div className={styles.illustrationWrapper}>
      <Image
        loading="lazy"
        src={src}
        alt={alt}
        className={`${styles.image} ${styles[size]}`}
      />
      {text && <Text ta='center' className={styles.text}>{text}</Text>}
    </div>
  );
};
