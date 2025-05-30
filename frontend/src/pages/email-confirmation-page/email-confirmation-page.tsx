import { Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import _styles from '~/index.module.css';

import { Header } from '~/components/header';
import { postAuthConfirmEmail } from '~/generated-api/auth/auth';
import { PageWithWrapper } from '~/ui/pages';


export const EmailConfirmationPage = () => {
  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId') || undefined;
  const code = searchParams.get('code') || undefined;
    
  // Если прилетел email — значит пользователь изменил почту, нужно отобразить это в интерфейсе
  const email = searchParams.get('email') || undefined;

  const { isPending, isError, mutateAsync: confirmEmailMutation } = useMutation({
    mutationFn: postAuthConfirmEmail,
    onError: (error) => {
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
  }, [userId, code, email]);

  return (
    <PageWithWrapper alignWrapper="center" withoutMenu>
      <Title ta='center'>
                Подтверждение почты
      </Title>
      <Text ta='center' className={_styles.textGray}>
                Чтобы это сделать, перейдите по ссылке, отправленной на почту.
      </Text>
      <Header variant="left">
        <Title order={2}>Подтверждение почты</Title>
      </Header>

      {isPending && <p>Подтверждение...</p>}
      {isError && <p>Не удалось подтвердить почту, ссылка устарела</p>}
      {!isPending && !isError && <p>Email успешно подтвержден!</p>}
    </PageWithWrapper>
  );
};
