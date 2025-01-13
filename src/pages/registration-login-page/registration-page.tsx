import { FC } from 'react';
import styles from './registration-login-page.module.css';
import { Page } from "../../ui/page/page.tsx";
import { Divider } from "@mantine/core";
import { Button } from "../../components/buttons/button.tsx";
import { RegistrationForm } from "../../components/forms/registration-form.tsx";
import { router } from "../../main.tsx";
import { AppRoute } from "../../conts.ts";
import {Logo} from "../../components/logo/Logo.tsx";


export const RegistrationPage: FC = () => {
  return (
    <Page>
      <div className={styles.content}>
        <div className={styles.header}>
          <Logo />
          <h1 className={styles.title}>Регистрация</h1>
        </div>

        <RegistrationForm />

        <Divider my="l" label="Или" />
        <Button variant='border' onClick={async () => await router.navigate(AppRoute.Login)}>
          Войти
        </Button>
      </div>
    </Page>
  );
};

