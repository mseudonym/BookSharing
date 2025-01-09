import {FC} from 'react';
import styles from './registration.module.css';
import {Page} from "../../ui/page/page.tsx";
import {Divider} from "@mantine/core";
import {Button} from "../../components/buttons/button.tsx";
import {RegistrationForm} from "../../components/forms/registration-form.tsx";


export const RegistrationPage: FC = () => {
    return (
        <Page>
            <div className={styles.content}>
                <div className={styles.header}>
                    <img loading="lazy" src="/../../src/assets/logo.svg" className={styles.logo} alt="Company logo"/>
                    <h1 className={styles.title}>Регистрация</h1>
                </div>

                <RegistrationForm/>

                <Divider my="l" label="Или"/>
                <Button variant={'secondary'} >
                    Войти
                </Button>
            </div>
        </Page>
    );
};

