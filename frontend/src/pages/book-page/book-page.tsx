import { ActionIcon, Divider, Loader } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { UiMenuDots3HIcon24Regular } from '@skbkontur/icons/icons/UiMenuDots3HIcon';
import React from 'react';
import { useParams } from 'react-router-dom';

import _styles from '~/index.module.css';
import styles from '~/pages/book-page/book-page.module.css';

import { EmptyState } from '~/components/empty-state/empty-state';
import { Header } from '~/components/header/header';
import { Queue } from '~/components/queue/queue';
import { useGetBooksByIdBookId } from '~/generated-api/books/books';
import { useGetItemsByBookId } from '~/generated-api/items/items';
import { ErrorPage } from '~/pages/error-page/error-page';
import { PageWithBackground } from '~/ui/pages/page-with-background/page-with-background';


export const BookPage = () => {
  const { id } = useParams();
  const { data: book, isLoading: isLoadingBook, isError: isErrorBook } = useGetBooksByIdBookId(id!);
  const { data: queueList, isLoading: isLoadingQueues, isError: isErrorQueues } = useGetItemsByBookId({ bookId: id });

  if (isLoadingBook || isLoadingQueues) {
    return <Loader />;
  }

  if (isErrorBook || isErrorQueues || !book) {
    return <ErrorPage />;
  }

  return (
    <PageWithBackground>
      <Header variant="auto" withPadding>
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <ActionIcon variant="transparent">
          <UiMenuDots3HIcon24Regular />
        </ActionIcon>
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
            : queueList.map((queue) => <Queue {...queue} bookId={id!} key={id!} />)}
        </section>
      </div>
    </PageWithBackground>
  );
};
