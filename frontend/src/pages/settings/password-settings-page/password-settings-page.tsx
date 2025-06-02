import { ActionIcon, Title } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons';
import React from 'react';

import { PasswordSettingsForm } from '~/components/forms';
import { Header } from '~/components/header/header';
import { PageWithWrapper } from '~/ui/pages';

export const PasswordSettingsPage = () => {
  return (
    <PageWithWrapper backgroundColor='white'>
      <Header variant="left">
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <Title order={6}>Изменение пароля</Title>
      </Header>

      <PasswordSettingsForm />
      
    </PageWithWrapper>
  );
};
