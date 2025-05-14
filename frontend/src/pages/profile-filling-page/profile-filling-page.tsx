import { ActionIcon, Title } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons';
import React from 'react';

import { ProfileFillingForm } from '~/components/forms/profile-filling-form/profile-filling-form';
import { Header } from '~/components/header/header';
import { PageWithWrapper } from '~/ui/pages/page-with-wrapper/page-with-wrapper';


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
