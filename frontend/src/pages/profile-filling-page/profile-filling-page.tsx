import React from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/profile-filling-page/profile-filling-page.module.css';

import { ProfileFillingForm } from '~/components/forms/profile-filling-form/profile-filling-form';
import { Header } from '~/components/header/header';
import { Page } from '~/ui/pages/page/page';


export const ProfileFillingPage = () => {
  return (
    <Page>
      <div className={styles.content}>
        <Header variant="left">
          <h1 className={_styles.title}>Создание профиля</h1>
        </Header>

        <ProfileFillingForm />

      </div>
    </Page>
  );
};
