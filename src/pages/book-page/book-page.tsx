import _styles from '../../index.module.css';
import styles from './book-page.module.css';
import { Header } from '../../components/header/header.tsx';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { PageBackground } from '../../ui/page/page-background.tsx';
import { Divider } from '@mantine/core';
import { Queue } from '../../components/queue/queue.tsx';
import { useParams } from 'react-router-dom';
import { useGetBooksByIdBookId } from '../../generated-api/books/books.ts';
import { ErrorPage } from '../error-page/error-page.tsx';
import { Loading } from '../../components/loading/loading.tsx';
import { useGetItemsByBookId } from '../../generated-api/items/items.ts';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { UiMenuDots3HIcon24Regular } from '@skbkontur/icons/icons/UiMenuDots3HIcon';
import { EmptyState } from '../../components/empty-state/empty-state.tsx';

export const BookPage = () => {
  const { id } = useParams();
  const { data: book, isLoading: isLoadingBook, isError: isErrorBook } = useGetBooksByIdBookId(id!);
  const { data: queueList, isLoading: isLoadingQueues, isError: isErrorQueues } = useGetItemsByBookId({ bookId: id });

  if (isLoadingBook || isLoadingQueues) {
    return <Loading />;
  }

  if (isErrorBook || isErrorQueues || !book) {
    return <ErrorPage />;
  }

  return (
    <PageBackground>
      <Header variant="auto" withPadding>
        <ButtonIcon variant="flat" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ButtonIcon>
        <ButtonIcon variant="flat">
          <UiMenuDots3HIcon24Regular />
        </ButtonIcon>
      </Header>

      <div className={styles.bookWrapper}>
        <img className={styles.bookImage} src={book.isPhotoUploaded! ? book.bookCoverUrl! : '/default-book-cover.png'} />
        <div className={_styles.roundRect} />
      </div>
      <div className={_styles.content}>
        <div className={styles.bookInfo}>
          <div className={styles.bookHeader}>
            <div className={styles.bookExtra}>
              <p className={_styles.textGray}>{book?.author}</p>
              <p className={_styles.textGray}>/</p>
              <p className={_styles.textGray}>
                {book.publicationYear}
                {' '}
                г.
              </p>
            </div>
            <h1 className={`${_styles.title} ${_styles.textCenter}`}>{book?.title}</h1>
          </div>
          <div className={styles.bookBlock}>
            <p className={_styles.textGray}>Описание</p>
            <p>{book?.description}</p>
          </div>
        </div>
        <Divider my="l" style={{ width: '90%' }} />
        <section className={styles.queues}>
          <h1 className={`${_styles.title} ${_styles.titleWrapper}`}>Эта книга у ваших друзей</h1>
          {queueList == undefined || queueList.length == 0
            ? (
                <EmptyState
                  src="/queue-illustration.svg"
                  alt="Queue is empty illustration"
                  text="Очередей нет"
                />
              )
            : queueList.map((queue) => <Queue {...queue} bookId={id!} />)}
        </section>
      </div>
    </PageBackground>
  );
};
