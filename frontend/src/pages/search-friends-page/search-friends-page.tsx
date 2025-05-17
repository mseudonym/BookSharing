import { ActionIcon, Input } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import React from 'react';

import { Header } from '~/components/header/header';
import { PageWithWrapper } from '~/ui/pages/page-with-wrapper/page-with-wrapper';

export const SearchFriendsPage = () => {
  return (
    <PageWithWrapper>
      <Header variant="left" withPadding>
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <Input placeholder="Введите никнейм пользователя" />
      </Header>
    </PageWithWrapper>
  );
};
