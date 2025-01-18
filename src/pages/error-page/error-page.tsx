import _styles from '../../index.module.css';
import { FC } from 'react'
import { Page } from '../../ui/page/page';


export const ErrorPage: FC = () => {
  return (
    <Page>
      <div className={_styles.content}>
        <img
          loading="lazy"
          src="/../../src/assets/error-illustration.svg"
          alt="Error illustration" />
        <div className={_styles.textContainer}>
          <h1 className={`${_styles.title} ${_styles.textCenter}`}>Упс! Страница не найдена</h1>
          <p className={`${_styles.textGray} ${_styles.textCenter}`}>Попробуйте вернуться назад или изменить запрос.</p>
        </div>
      </div>
    </Page>
  )
}