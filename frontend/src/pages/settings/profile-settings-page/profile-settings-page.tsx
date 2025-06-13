import { ActionIcon, Title } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons';
import React from 'react';

import { ProfileSettingsForm } from '~/components/forms';
import { Header } from '~/components/header/header';
import { PageWithWrapper } from '~/ui/pages';

export const ProfileSettingsPage = () => {
  return (
    <PageWithWrapper backgroundColor='white'>
      <Header variant='left'>
        <ActionIcon variant='transparent' onClick={() => {
          window.history.back();
        }}>
          <ArrowALeftIcon24Regular/>
        </ActionIcon>
        <Title order={6}>Личные данные</Title>
      </Header>

      <ProfileSettingsForm/>

    </PageWithWrapper>
  );
};
