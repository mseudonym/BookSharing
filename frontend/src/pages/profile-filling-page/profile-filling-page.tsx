import { ActionIcon, Title } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons';
import React from 'react';

import { ProfileFillingForm } from '~/components/forms';
import { Header } from '~/components/header';
import { PageWithWrapper } from '~/ui/pages';


export const ProfileFillingPage = () => {
  return (
    <PageWithWrapper>
      <Header variant="left">
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <Title order={2}>Создание профиля</Title>
      </Header>

      <ProfileFillingForm />

    </PageWithWrapper>
  );
};
