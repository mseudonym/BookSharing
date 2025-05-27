import { ActionIcon, Anchor, Text, Title }  from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/email-confirmation-page/email-confirmation.module.css';

import { checkProfileFilling, checkAuth } from '~/actions/user-actions';
import { Header } from '~/components/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { RESEND_CONFIRMATION_EMAIL_SECONDS } from '~/conts';
import { postAuthResendConfirmationEmail } from '~/generated-api/auth/auth';
import { getGetUsersMeQueryKey, getUsersMe } from '~/generated-api/users/users';
import { PageWithWrapper } from '~/ui/pages';

export const EmailConfirmationPage = () => {
  useEffect(() => {
    checkAuth(true);
  }, []);

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
      checkProfileFilling(userData, true);
    }
  }, [userData]);

  return (
    <PageWithWrapper alignWrapper="center" withoutMenu>
      <Header variant="left">
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
      </Header>
      <Title ta='center'>
          Ожидаем подтверждение почты
      </Title>
      <Text ta='center' className={_styles.textGray}>
          Чтобы это сделать, перейдите по ссылке, отправленной на почту.
      </Text>
      <IllustrationWrapper
        src="/mail.svg"
        alt="Email confirmation illustration"
      />
      {seconds === 0
        ? (
          <Anchor className={`${_styles.anchorGray} ${styles.link}`} onClick={() => resendConfirmationEmail({ email: userData?.email ?? '' })}>
            Отправить письмо ещё раз
          </Anchor>
        )
        : (
          <Text ta='center' className={_styles.textGray}>
            {`Отправить письмо повторно можно через ${seconds} секунд.`}
          </Text>
        )}
    </PageWithWrapper>
  );
};
