import { ActionIcon, Button, Title } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import {
  ArrowALeftIcon24Regular,
  ArrowUiAuthLogoutIcon24Regular,
  People1EditIcon24Regular,
  SecurityShieldCheckIcon24Regular
} from '@skbkontur/icons';
import React from 'react';

import styles from '~/pages/settings/settings.module.css';

import { Modal } from '~/components/custom-mantine/modal/modal';
import { Header } from '~/components/header/header';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { dropToken } from '~/services/token';
import { PageWithWrapper } from '~/ui/pages';

export const SettingsPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { width } = useViewportSize();
  const isRenderedOnDesktop = width >= 768;

  const logout = () => {
    dropToken();
    router.navigate(AppRoute.Root).then();
    return {};
  };

  return (
    <>
      <Modal opened={opened} onClose={close} onSubmit={logout}
        title='Выйти из аккаунта?' submitButtonText='Да, выйти' closeButtonText='Нет, остаться'/>

      <PageWithWrapper backgroundColor='white'>
        <Header variant='left'>
          {!isRenderedOnDesktop &&
            <ActionIcon variant='transparent' onClick={() => {
              window.history.back();
            }}>
              <ArrowALeftIcon24Regular/>
            </ActionIcon>
          }
          <Title order={isRenderedOnDesktop ? 5 : 6}>Настройки</Title>
        </Header>

        <Button className={styles.buttonLeft}
          variant='white'
          fullWidth
          leftSection={<People1EditIcon24Regular/>}
          onClick={() => router.navigate(AppRoute.ProfileSettings)}>
          Личные данные
        </Button>

        <Button className={styles.buttonLeft}
          variant='white'
          fullWidth
          leftSection={<SecurityShieldCheckIcon24Regular/>}
          onClick={() => router.navigate(AppRoute.SecuritySettings)}>
          Безопасность
        </Button>

        <Button fullWidth leftSection={<ArrowUiAuthLogoutIcon24Regular/>} onClick={open}>
          Выйти из аккаунта
        </Button>

      </PageWithWrapper>
    </>
  );
};

