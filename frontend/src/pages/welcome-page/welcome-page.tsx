import { Button } from '@mantine/core';
import React from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/welcome-page/welcome-page.module.css';

import { AppRoute } from '~/conts';
import { router } from '~/main';
import { Page } from '~/ui/pages/page/page';


export const WelcomePage = () => {
  return (
    <Page>
      <img
        loading="lazy"
        src="/welcome-illustration.svg"
        alt="Welcome illustration"
      />
      <div className={styles.textContainer}>
        <h1 className={_styles.title}>Добро пожаловать!</h1>
        <p className={_styles.description}>
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
    </Page>
  );
};
