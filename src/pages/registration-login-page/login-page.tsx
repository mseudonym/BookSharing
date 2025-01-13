import { FC } from "react";
import { Page } from "../../ui/page/page.tsx";
import styles from "./registration-login-page.module.css";
import { Divider } from "@mantine/core";
import { Button } from "../../components/buttons/button.tsx";
import { router } from "../../main.tsx";
import { AppRoute } from "../../conts.ts";
import { LoginForm } from "../../components/forms/login-form.tsx";
import {Logo} from "../../components/logo/Logo.tsx";


export const LoginPage: FC = () => {
  return (
    <Page>
      <div className={styles.content}>
        <div className={styles.header}>
          <Logo />
          <h1 className={styles.title}>Вход</h1>
        </div>

        <LoginForm />

        <Divider my="l" label="Или" />
        <Button variant={'secondary'} onClick={async () => await router.navigate(AppRoute.Register)}>
          Зарегистрироваться
        </Button>
      </div>

    </Page>
  );
}