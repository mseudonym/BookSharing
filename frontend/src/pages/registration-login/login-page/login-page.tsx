import { Divider, Button } from '@mantine/core';
import React from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/registration-login/styles.module.css';

import { LoginForm } from '~/components/forms/login-form/login-form';
import { Logo } from '~/components/logo';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { Page } from '~/ui/pages/page/page';

export const LoginPage = () => {
  return (
    <Page>
      <div className={styles.content}>
        <div className={styles.header}>
          <Logo />
          <h1 className={_styles.title}>Вход</h1>
        </div>

        <LoginForm />

        <Divider my="l" label="Или" />
        <Button fullWidth variant="outline" onClick={async () => await router.navigate(AppRoute.Register)}>
          Зарегистрироваться
        </Button>
      </div>

    </Page>
  );
};
