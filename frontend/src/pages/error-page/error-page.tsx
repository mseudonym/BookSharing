import React from 'react';

import _styles from '~/index.module.css';

import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { PageWithWrapper } from '~/ui/pages/page-with-wrapper';

export const ErrorPage = () => {
  return (
    <PageWithWrapper>
      <div className={_styles.content}>
        <IllustrationWrapper
          src='/error-illustration.svg'
          alt='Error illustration'/>
        <div className={_styles.textContainer}>
          <h1 className={`${_styles.title} ${_styles.textCenter}`}>Упс! Страница не найдена</h1>
          <p className={`${_styles.textGray} ${_styles.textCenter}`}>Попробуйте вернуться назад или изменить запрос.</p>
        </div>
      </div>
    </PageWithWrapper>
  );
};
