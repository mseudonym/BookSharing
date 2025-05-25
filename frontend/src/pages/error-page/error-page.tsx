import { Title, Text } from '@mantine/core';
import React from 'react';

import _styles from '~/index.module.css';

import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { PageWithWrapper } from '~/ui/pages';

export const ErrorPage = () => {
  return (
    <PageWithWrapper alignWrapper='center' withoutMenu>
      <IllustrationWrapper
        size='big'
        src='/error-illustration.svg'
        alt='Error illustration'/>
      <div className={_styles.textContainer}>
        <Title textWrap='balance' ta='center'>Упс! Страница не найдена</Title>
        <Text ta='center' className={_styles.textGray}>Попробуйте вернуться назад или изменить запрос.</Text>
      </div>
    </PageWithWrapper>
  );
};
