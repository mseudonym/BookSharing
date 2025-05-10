import styles from './registration-login-page.module.css';
import _styles from '../../index.module.css';
import { Divider } from '@mantine/core';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../conts.ts';
import { LoginForm } from '../../components/forms/login-form.tsx';
import { Logo } from '../../components/logo/logo.tsx';
import { Page } from '../../ui/page/page.tsx';

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <div className={styles.content}>
        <div className={styles.header}>
          <Logo />
          <h1 className={_styles.title}>Вход</h1>
        </div>

        <LoginForm />

        <Divider my="l" label="Или" />
        <Button variant="border" onClick={async () => await navigate(AppRoute.Register)}>
          Зарегистрироваться
        </Button>
      </div>

    </Page>
  );
};
