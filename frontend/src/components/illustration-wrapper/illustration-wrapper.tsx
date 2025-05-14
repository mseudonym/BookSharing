import React from 'react';

import styles from '~/components/illustration-wrapper/illustration-wrapper.module.css';
import _styles from '~/index.module.css';

interface IllustrationWrapperProps {
  src: string;
  alt: string;
  text?: string;
  size?: 'small' | 'big';
}

export const IllustrationWrapper = ({ src, alt, text, size = 'small' }: IllustrationWrapperProps) => {
  return (
    <div className={styles.illustrationWrapper}>
      <img
        loading="lazy"
        src={src}
        alt={alt}
        className={`${styles.image} ${styles[size]}`}
      />
      {text && <p className={_styles.textCenter}>{text}</p>}
    </div>
  );
};
