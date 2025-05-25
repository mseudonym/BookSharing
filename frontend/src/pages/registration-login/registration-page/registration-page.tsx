import { Divider, Flex, Title } from '@mantine/core';
import { Button } from '@mantine/core';
import React from 'react';

import styles from '~/pages/registration-login/registration-login.module.css';

import { RegistrationForm } from '~/components/forms';
import { Logo } from '~/components/logo/logo';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { PageWithWrapper } from '~/ui/pages';

export const RegistrationPage = () => {
  return (
    <PageWithWrapper alignWrapper="center" withoutMenu>
      <Flex direction='column' align='center' gap='lg' className={styles.head}>
        <Logo />
        <Title ta='center'>Регистрация</Title>
      </Flex>

      <RegistrationForm />

      <Divider my="l" label="Или" />
      <Button variant="outline" fullWidth onClick={async () => await router.navigate(AppRoute.Login)}>
          Войти
      </Button>
    </PageWithWrapper>
  );
};
