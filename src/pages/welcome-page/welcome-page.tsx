import React from 'react';
import _styles from '../../index.module.css'
import { Button } from '../../components/buttons/button.tsx';
import { useNavigate } from "react-router";
import { AppRoute } from "../../conts.ts";
import { Page } from "../../ui/page/page.tsx";

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <div className={_styles.content}>
        <img
          loading="lazy"
          src="/../../src/assets/welcome-page-illustration.svg"
          alt="Welcome illustration"
        />
        <div className={_styles.textContainer}>
          <h1 className={_styles.title}>Добро пожаловать!</h1>
          <p className={`${_styles.textGray} ${_styles.textCenter}`}>
            Здесь вы можете делиться книгами со своей полки, а также бронировать книги друзей. Наслаждайтесь чтением!
          </p>
        </div>
        <Button variant='primary' onClick={() => navigate(AppRoute.Login)} >
          Войти
        </Button>
        <Button variant='border' onClick={() => navigate(AppRoute.Register)} >
          Зарегистрироваться
        </Button>
      </div>
    </Page>
  );
};
