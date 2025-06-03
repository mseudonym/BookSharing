import { ActionIcon, Title } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons';
import React from 'react';

import { Header } from '~/components/header';
import { ISBNScanner } from '~/components/isbn-scanner';
import { PageWithWrapper } from '~/ui/pages';

export const ISBNScanningPage = () => {
  return (
    <PageWithWrapper>
      <Header variant="left">
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <Title order={5}>Сканирование ISBN</Title>
      </Header>
      
      <ISBNScanner/>
    </PageWithWrapper>
  );
};