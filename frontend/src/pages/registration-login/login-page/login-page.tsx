import { Divider, Button, Title } from '@mantine/core';
import React from 'react';

import styles from '~/pages/registration-login/styles.module.css';

import { LoginForm } from '~/components/forms/login-form/login-form';
import { Logo } from '~/components/logo';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { PageWithWrapper } from '~/ui/pages/page-with-wrapper/page-with-wrapper';

export const LoginPage = () => {
  return (
    <PageWithWrapper alignWrapper="center">
      <div className={styles.header}>
        <Logo />
        <Title>Вход</Title>
      </div>

      <LoginForm />

      <Divider my="l" label="Или" />
      <Button fullWidth variant="outline" onClick={async () => await router.navigate(AppRoute.Register)}>
          Зарегистрироваться
      </Button>
    </PageWithWrapper>
  );
};
