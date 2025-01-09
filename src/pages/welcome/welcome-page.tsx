import React from 'react';
import styles from './welcome-screen.module.css';
import _styles from '../../index.module.css'
import { Button } from '../../components/buttons/button.tsx';
import { Page } from '../../ui/page/page';
import {useNavigate} from "react-router";
import {AppRoute} from "../../conts.ts";

export const WelcomePage : React.FC = () => {
    const navigate = useNavigate();

    return (
        <Page>
            <div className={styles.content}>
                <img
                    loading="lazy"
                    src="/../../src/assets/welcome-page-illustration.svg"
                    className={styles.welcomeImage}
                    alt="Welcome illustration"
                />
                <div className={styles.textContainer}>
                    <h1 className={_styles.title}>Добро пожаловать!</h1>
                    <p className={styles.description}>
                        Здесь вы можете делиться книгами со своей полки, а также бронировать книги друзей. Наслаждайтесь чтением!
                    </p>
                </div>
                <Button variant={'primary'} onClick={() => navigate(AppRoute.Login)} >
                    Войти
                </Button>
                <Button variant={'secondary'} onClick={() => navigate(AppRoute.Register)} >
                    Зарегистрироваться
                </Button>
            </div>
        </Page>
    );
};