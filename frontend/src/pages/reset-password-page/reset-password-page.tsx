import { Title } from '@mantine/core';
import React from 'react';

import { ResetPasswordForm } from '~/components/forms';
import { Header } from '~/components/header';
import { PageWithWrapper } from '~/ui/pages';

export const ResetPasswordPage = () => {
  return (
    <PageWithWrapper withoutMenu>
      <Header variant='left'>
        <Title order={5}>Обновление пароля</Title>
      </Header>

      <ResetPasswordForm/>

    </PageWithWrapper>
  );
};