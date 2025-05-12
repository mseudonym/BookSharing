import { Divider } from '@mantine/core';
import { Button } from '@mantine/core';
import React from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/registration-login/styles.module.css';

import { RegistrationForm } from '~/components/forms/registration-form/registration-form';
import { Logo } from '~/components/logo/logo';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { Page } from '~/ui/page/page';

export const RegistrationPage = () => {
  return (
    <Page>
      <div className={styles.content}>
        <div className={styles.header}>
          <Logo />
          <h1 className={_styles.title}>Регистрация</h1>
        </div>

        <RegistrationForm />

        <Divider my="l" label="Или" />
        <Button variant="outline" onClick={async () => await router.navigate(AppRoute.Login)}>
          Войти
        </Button>
      </div>
    </Page>
  );
};
