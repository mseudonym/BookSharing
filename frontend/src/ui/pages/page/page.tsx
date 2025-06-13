import React, { PropsWithChildren } from 'react';

import styles from '~/ui/pages/page/page.module.css';

import { BackgroundColor } from '~/types';

type PageProps = {
    backgroundColor?: BackgroundColor;
    withoutMenu?: boolean;
}

export const Page = ({ children, backgroundColor = 'rainbow', withoutMenu = false }: PropsWithChildren<PageProps>) => {
  return (
    <div className={`${styles.page} ${styles[backgroundColor]} ${withoutMenu && styles.pageWithoutMenu}`}>
      {children}
    </div>
  );
};
