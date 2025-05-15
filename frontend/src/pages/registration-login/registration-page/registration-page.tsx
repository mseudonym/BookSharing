import { Divider, Title } from '@mantine/core';
import { Button } from '@mantine/core';
import React from 'react';

import styles from '~/pages/registration-login/styles.module.css';

import { RegistrationForm } from '~/components/forms/registration-form/registration-form';
import { Logo } from '~/components/logo/logo';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { PageWithWrapper } from '~/ui/pages';

export const RegistrationPage = () => {
  return (
    <PageWithWrapper alignWrapper="center">
      <div className={styles.header}>
        <Logo />
        <Title>Регистрация</Title>
      </div>

      <RegistrationForm />

      <Divider my="l" label="Или" />
      <Button variant="outline" fullWidth onClick={async () => await router.navigate(AppRoute.Login)}>
          Войти
      </Button>
    </PageWithWrapper>
  );
};
