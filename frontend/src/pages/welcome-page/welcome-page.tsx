import styles from './welcome-page.module.css';
import _styles from '../../index.module.css';
import { Button } from '@mantine/core';
import { AppRoute } from '../../conts.ts';
import { Page } from '../../ui/page/page.tsx';
import { router } from '../../main.tsx';

export const WelcomePage = () => {
  return (
    <Page>
      <div className={styles.content}>
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
      </div>
    </Page>
  );
};
