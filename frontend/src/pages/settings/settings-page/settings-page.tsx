import { ActionIcon, Button, Modal, Title, SimpleGrid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ArrowALeftIcon24Regular,
  ArrowUiAuthLogoutIcon24Regular,
  People1EditIcon24Regular,
  SecurityShieldCheckIcon24Regular
} from '@skbkontur/icons';
import React from 'react';

import styles from '~/pages/settings/settings.module.css';

import { Header } from '~/components/header/header';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { PageWithWrapper } from '~/ui/pages';

export const SettingsPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const logout = () => {
    localStorage.removeItem('bs-token');
    router.navigate(AppRoute.Root);
    return {};
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title='Выйти из аккаунта?' centered>
        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing={{ base: 'md' }}
          verticalSpacing={{ base: 'md' }}
          style={{ width: '100%' }}
        >
          <Button variant='filled' onClick={logout}>
            Да, выйти
          </Button>
          <Button color='outline' onClick={close}>
            Нет, остаться
          </Button>
        </SimpleGrid>
      </Modal>

      <PageWithWrapper backgroundColor='white'>
        <Header variant='left'>
          <ActionIcon variant='transparent' onClick={() => {
            window.history.back();
          }}>
            <ArrowALeftIcon24Regular/>
          </ActionIcon>
          <Title order={6}>Настройки</Title>
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

        {/* <Button leftSection={<SettingsIcon24Regular />}>
        Уведомления
      </Button> */}

        <Button fullWidth leftSection={<ArrowUiAuthLogoutIcon24Regular/>} onClick={open}>
          Выйти из аккаунта
        </Button>

      </PageWithWrapper>
    </>
  );
};

