import { Divider, Button, Title, Flex } from '@mantine/core';
import React from 'react';

import styles from '~/pages/registration-login/registration-login.module.css';

import { LoginForm } from '~/components/forms';
import { Logo } from '~/components/logo';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { PageWithWrapper } from '~/ui/pages';

export const LoginPage = () => {
  return (
    <PageWithWrapper alignWrapper="center" withoutMenu>
      <Flex direction='column' align='center' gap='lg' className={styles.head}>
        <Logo />
        <Title order={5} ta='center'>Вход</Title>
      </Flex>

      <LoginForm />

      <Divider my="l" label="Или" />
      <Button fullWidth variant="outline" onClick={async () => await router.navigate(AppRoute.Register)}>
          Зарегистрироваться
      </Button>
    </PageWithWrapper>
  );
};
