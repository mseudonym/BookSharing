import { Title, Text } from '@mantine/core';
import React from 'react';

import _styles from '~/index.module.css';

import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { PageWithWrapper } from '~/ui/pages';

interface ErrorPageProps {
  withoutMenu?: boolean;
}

export const ErrorPage = ({ withoutMenu = true }: ErrorPageProps) => {
  return (
    <PageWithWrapper alignWrapper='center' withoutMenu={withoutMenu}>
      <IllustrationWrapper
        size='big'
        src='/error-illustration.svg'
        alt='Error illustration'/>
      <div className={_styles.textContainer}>
        <Title order={5} ta='center'>Упс! Страница не найдена</Title>
        <Text ta='center' className={_styles.textGray}>Попробуйте вернуться назад или изменить запрос.</Text>
      </div>
    </PageWithWrapper>
  );
};
