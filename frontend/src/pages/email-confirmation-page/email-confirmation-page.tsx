import { Button, Loader, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import _styles from '~/index.module.css';

import { Header } from '~/components/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { AppRoute } from '~/conts';
import { postAuthConfirmEmail } from '~/generated-api/auth/auth';
import { router } from '~/main';
import { PageWithWrapper } from '~/ui/pages';

export const EmailConfirmationPage = () => {
  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId') || undefined;
  const code = searchParams.get('code') || undefined;
  const email = searchParams.get('email') || undefined;

  const { isPending, isError, mutateAsync: confirmEmailMutation } = useMutation({
    mutationFn: postAuthConfirmEmail,
    onError: () => {
      notifications.show({
        title: 'Ошибка подтверждения',
        message: 'Не удалось подтвердить email',
        color: 'red',
      });
    },
  });

  useEffect(() => {
    if (userId && code) {
      confirmEmailMutation({ userId, code, changedEmail: email }).then();
    }
  }, [userId, code, email, confirmEmailMutation]);

  return (
    <PageWithWrapper alignWrapper='center' withoutMenu>
      <Header variant='left'>
      </Header>

      {isPending ?
        <Loader/>
        : (isError
          ? <>
            <Title order={5} ta='center'>Ошибка при подтверждении почты</Title>
            <Text className={_styles.textGray}>Ссылка устарела.</Text>
            <IllustrationWrapper
              src='/email-error.svg'
              alt='Email error illustration'
              />
          </>
          : (email
            ? <>
              <Title order={5} ta='center'>Почта успешно изменена</Title>
              <Text className={_styles.textGray}>Можно продолжить использование приложения.</Text>
              <IllustrationWrapper
                src='/email-confirmed.svg'
                alt='Email confirmed illustration'
                  />
              <Button variant='filled' onClick={() => router.navigate(AppRoute.Storage)}>Вернуться
                на главную</Button>
            </>
            : <>
              <Title order={5} ta='center'>Почта успешно подтверждена</Title>
              <Text className={_styles.textGray}>Можно переходить к следующему шагу.</Text>
              <IllustrationWrapper
                src='/email-confirmed.svg'
                alt='Email confirmed illustration'
                  />
              <Button variant='filled' onClick={() => router.navigate(AppRoute.ProfileFilling)}>Перейти
                к заполнению профиля</Button>
            </>
          )
        )
      }
    </PageWithWrapper>
  );
};
