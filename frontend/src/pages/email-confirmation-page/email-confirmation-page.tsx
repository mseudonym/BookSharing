import { ActionIcon, Anchor } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import _styles from '~/index.module.css';

import { checkProfileFilling } from '~/actions/user-actions';
import { Header } from '~/components/header/header';
import { postAuthResendConfirmationEmail } from '~/generated-api/auth/auth';
import { getGetUsersMeQueryKey, getUsersMe } from '~/generated-api/users/users';
import { Page } from '~/ui/pages/page/page';

const RESEND_CONFIRMATION_EMAIL_SECONDS = 30;

export const EmailConfirmationPage = () => {
  const [seconds, setSeconds] = useState<number>(RESEND_CONFIRMATION_EMAIL_SECONDS);

  const { mutateAsync: resendConfirmationEmail } = useMutation({
    mutationFn: postAuthResendConfirmationEmail,
    onMutate: async () => {
      setSeconds(RESEND_CONFIRMATION_EMAIL_SECONDS);
    },
  });

  useEffect(() => {
    const timeInterval = setTimeout(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  });

  const { data: userData } = useQuery({
    queryFn: () => getUsersMe(),
    queryKey: getGetUsersMeQueryKey(),
    refetchInterval: 6000,
  });

  useEffect(() => {
    if (userData?.isEmailConfirm) {
      checkProfileFilling(userData).then();
    }
  }, [userData]);

  return (
    <Page>
      <Header variant="left">
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
      </Header>
      <h1 className={`${_styles.title} ${_styles.textCenter}`}>
          Ожидаем подтверждение почты
      </h1>
      <p className={_styles.description}>
          Чтобы это сделать, перейдите по ссылке, отправленной на почту.
          Если письма не видно — проверьте Спам, оно могло попасть туда.
      </p>
      <div>
        <img
          src="/mail.svg"
          alt="Email confirmation illustration"
        />
      </div>
      {seconds === 0
        ? (
          <Anchor onClick={() => resendConfirmationEmail({ email: userData?.email ?? '' })}>
            Отправить письмо ещё раз
          </Anchor>
        )
        : (
          <p className={_styles.description}>
            {`Отправить письмо повторно можно через ${seconds} секунд.`}
          </p>
        )}
    </Page>
  );
};
