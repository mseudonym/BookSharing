import { Button, Title } from '@mantine/core';
import React from 'react';

import _styles from '~/index.module.css';

import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { PageWithWrapper } from '~/ui/pages';

export const WelcomePage = () => {
  return (
    <PageWithWrapper alignWrapper="center">
      <IllustrationWrapper
        src="/welcome-illustration.svg"
        alt="Welcome illustration"
        size="big"
      />
      <div className={_styles.textContainer}>
        <Title>Добро пожаловать!</Title>
        <p className={`${_styles.textCenter} ${_styles.textGray}`}>
            Здесь вы можете делиться книгами со своей полки, а также бронировать книги друзей. Наслаждайтесь
            чтением!
        </p>
      </div>
      <Button variant="filled" fullWidth onClick={() => router.navigate(AppRoute.Login)}>
          Войти
      </Button>
      <Button variant="outline" fullWidth onClick={() => router.navigate(AppRoute.Register)}>
          Зарегистрироваться
      </Button>
    </PageWithWrapper>
  );
};
