import { Title } from '@mantine/core';
import React from 'react';

import { ResetPasswordForm } from '~/components/forms';
import { Header } from '~/components/header';
import { PageWithWrapper } from '~/ui/pages';

export const ResetPasswordPage = () => {
  return (
    <PageWithWrapper backgroundColor='white'>
      <Header variant='left'>
        <Title order={6}>Обновление пароля</Title>
      </Header>

      <ResetPasswordForm/>

    </PageWithWrapper>
  );
};