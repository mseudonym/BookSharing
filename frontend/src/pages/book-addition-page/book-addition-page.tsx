import { ActionIcon } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import React from 'react';

import { BookAdditionForm } from '~/components/forms/book-addition-form/book-addition-form';
import { Header } from '~/components/header/header';
import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper';

export const BookAdditionPage = () => {
  return (
    <Page>
      <Header variant="left" withPadding>
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
      </Header>

      <Wrapper background="none" noPaddingHorizontal>
        <BookAdditionForm />
      </Wrapper>

    </Page>
  );
};
