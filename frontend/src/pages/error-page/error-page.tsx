import _styles from '../../index.module.css';
import { Page } from '../../ui/pages/page/page';

export const ErrorPage = () => {
  return (
    <Page>
      <div className={_styles.content}>
        <img
          loading="lazy"
          src="/error-illustration.svg"
          alt="Error illustration"
        />
        <div className={_styles.textContainer}>
          <h1 className={`${_styles.title} ${_styles.textCenter}`}>Упс! Страница не найдена</h1>
          <p className={`${_styles.textGray} ${_styles.textCenter}`}>Попробуйте вернуться назад или изменить запрос.</p>
        </div>
      </div>
    </Page>
  );
};
