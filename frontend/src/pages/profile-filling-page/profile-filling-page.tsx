import styles from './profile-filling-page.module.css';
import { Page } from '../../ui/page/page.tsx';
import { Header } from '../../components/header/header.tsx';
import _styles from '../../index.module.css';
import { ProfileFillingForm } from '../../components/forms/profile-filling-form.tsx';

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
