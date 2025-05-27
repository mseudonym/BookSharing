import { ActionIcon, Title } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons';
import React, { useEffect } from 'react';

import { redirectIfAuth } from '~/actions/user-actions';
import { ForgotPasswordForm } from '~/components/forms';
import { Header } from '~/components/header';
import { PageWithWrapper } from '~/ui/pages';

export const ForgotPasswordPage = () => {
  useEffect(() => {
    redirectIfAuth();
  }, []);

  return (
    <PageWithWrapper withoutMenu>
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
