import { ActionIcon, Button, Title } from '@mantine/core';
import { ArrowALeftIcon24Regular, MailIcon24Regular, SecurityPasswordInputIcon24Regular } from '@skbkontur/icons';
import React from 'react';

import styles from '~/pages/settings/settings.module.css';

import { Header } from '~/components/header/header';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { PageWithWrapper } from '~/ui/pages';

export const SecuritySettingsPage = () => {
  return (
    <PageWithWrapper backgroundColor='white'>
      <Header variant='left'>
        <ActionIcon variant='transparent' onClick={() => {
          window.history.back();
        }}>
          <ArrowALeftIcon24Regular/>
        </ActionIcon>
        <Title order={6}>Безопасность</Title>
      </Header>

      <Button variant='white'
        className={styles.buttonLeft}
        fullWidth
        leftSection={<MailIcon24Regular/>}
        onClick={() => {
          router.navigate(AppRoute.EmailSettings);
        }}>
        Изменение почты
      </Button>

      <Button
        variant='white'
        className={styles.buttonLeft}
        fullWidth
        leftSection={<SecurityPasswordInputIcon24Regular/>}
        onClick={() => {
          router.navigate(AppRoute.PasswordSettings);
        }}>
        Изменение пароля
      </Button>

    </PageWithWrapper>
  );
};

