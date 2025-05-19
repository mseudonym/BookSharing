import { ActionIcon, Button, Title } from '@mantine/core';
import { ArrowALeftIcon24Regular, MailIcon24Regular, SecurityPasswordInputIcon24Regular } from '@skbkontur/icons';
import React from 'react';

import styles from '~/pages/settings/settings.module.css';

import { Header } from '~/components/header/header';
import { PageWithWrapper } from '~/ui/pages';

export const SecuritySettingsPage = () => {
  return (
    <PageWithWrapper backgroundColor='white'>
      <Header variant="left">
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <Title order={2}>Безопасность</Title>
      </Header>

      <Button variant='white' className={styles.buttonLeft} fullWidth leftSection={<MailIcon24Regular />}>
        Изменение почты
      </Button>

      <Button variant='white' className={styles.buttonLeft} fullWidth leftSection={<SecurityPasswordInputIcon24Regular />}>
        Изменение пароля
      </Button>
      
    </PageWithWrapper>
  );
};

