import { ActionIcon, Title } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons';
import React from 'react';

import { ForgotPasswordForm } from '~/components/forms/forgot-password-form/forgot-password-form';
import { Header } from '~/components/header/header';
import { PageWithWrapper } from '~/ui/pages';

export const ForgotPasswordPage = () => {
  return (
    <PageWithWrapper>
      <Header variant='left'>
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <Title order={2}>Восстановление пароля</Title>
      </Header>

      <ForgotPasswordForm/>

    </PageWithWrapper>
  );
};
