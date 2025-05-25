import { ActionIcon, Title } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import React from 'react';

import styles from '~/pages/book-addition-page/book-addition-page.module.css';

import { BookAdditionForm } from '~/components/forms';
import { Header } from '~/components/header';
import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper';

export const BookAdditionPage = () => {
  return (
    <Page>
      <Header variant="left" withPadding>
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <Title order={2}>Добавление книги вручную</Title>
      </Header>

      <Wrapper background="none" noPaddingHorizontal className={styles.bookAddWrapper}>
        <BookAdditionForm />
      </Wrapper>

    </Page>
  );
};
