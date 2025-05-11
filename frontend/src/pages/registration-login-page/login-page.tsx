import styles from './registration-login-page.module.css';
import _styles from '../../index.module.css';
import { Divider } from '@mantine/core';
import { Button } from '@mantine/core';
import { AppRoute } from '../../conts.ts';
import { LoginForm } from '../../components/forms/login-form.tsx';
import { Logo } from '../../components/logo/logo.tsx';
import { Page } from '../../ui/page/page.tsx';
import { router } from '../../main.tsx';
export const LoginPage = () => {
  return (
    <Page>
      <div className={styles.content}>
        <div className={styles.header}>
          <Logo />
          <h1 className={_styles.title}>Вход</h1>
        </div>

        <LoginForm />

        <Divider my="l" label="Или" />
        <Button variant="outline" onClick={async () => await router.navigate(AppRoute.Register)}>
          Зарегистрироваться
        </Button>
      </div>

    </Page>
  );
};
