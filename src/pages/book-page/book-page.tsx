import _styles from '../../index.module.css'
import styles from './book-page.module.css';
import { Navigation } from '../../components/navigation/navigation';
import { ArrowALeftIcon24Regular, UiMenuDots3HIcon24Regular } from '@skbkontur/icons';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { Page } from '../../ui/page/page';
import { Divider } from '@mantine/core';
import { getApiBooksSearchByIdBookId } from "../../generated-api/books/books.ts";
import { Queue } from '../../components/queue/queue.tsx';

export const BookPage = () => {
  getApiBooksSearchByIdBookId("book");
  const author = "Оливия Лэнг";
  const year = 2021;
  const title = "Тело каждого. Книга о свободе";
  const description = "«Тело каждого. Книга о свободе» — это художественное исследование долгой борьбы за телесную свободу, от сексуального освобождения до феминизма и движения за гражданские права.";


  return (
    <Page>
      <Navigation variant='navAuto'>
        <ButtonIcon variant='flat'>
          <ArrowALeftIcon24Regular />
        </ButtonIcon>
        <ButtonIcon variant='flat'>
          <UiMenuDots3HIcon24Regular />
        </ButtonIcon>
      </Navigation>

      <div className='wrapper'>
        <div className='book-wrapper'>
          <img className='book-image' src='src/assets/book-example.png' />
          <div className='round-rect' />
        </div>
        <div className='content'>
          <div className='book-info'>
            <div className='book-header'>
              <div className='book-extra-info'>
                <p className={_styles.textGray}>{author}</p>
                <p className={_styles.textGray}>/</p>
                <p className={_styles.textGray}>{year} г.</p>
              </div>
              <h1 className={`${_styles.title} ${_styles.textCenter}`}>{title}</h1>
            </div>
            <div className='book-block'>
              <p className={_styles.textGray}>Описание</p>
              <p>{description}</p>
            </div>
          </div>
          <section className={styles.queues}>
            <h1 className={`${_styles.title} ${_styles.titleWrapper}`}>Эта книга у ваших друзей</h1>
            <Divider my="l" />
            <Queue
              owner='Вы'
              currentHolder='Павел Ловыгин'
              queueAvatars={['src/assets/default-profile.png', 'src/assets/default-profile.png']}
            />
          </section>
        </div>
      </div>
    </Page>
  );
}