import { Title } from '@mantine/core';
import React from 'react';

import _styles from '~/index.module.css';

import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { PageWithWrapper } from '~/ui/pages';

export const ErrorPage = () => {
  return (
    <PageWithWrapper alignWrapper='center'>
      <IllustrationWrapper
        size='big'
        src='/error-illustration.svg'
        alt='Error illustration'/>
      <div className={_styles.textContainer}>
        <Title textWrap='balance' className={_styles.textCenter}>Упс! Страница не найдена</Title>
        <p className={`${_styles.textGray} ${_styles.textCenter}`}>Попробуйте вернуться назад или изменить запрос.</p>
      </div>
    </PageWithWrapper>
  );
};
