import { ActionIcon, Divider, Loader, Title } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { UiMenuDots3HIcon24Regular } from '@skbkontur/icons/icons/UiMenuDots3HIcon';
import React from 'react';
import { useParams } from 'react-router-dom';

import _styles from '~/index.module.css';
import styles from '~/pages/book-page/book-page.module.css';

import { Header } from '~/components/header/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { Queue } from '~/components/queue/queue';
import { useGetBooksByIdBookId } from '~/generated-api/books/books';
import { useGetItemsByBookId } from '~/generated-api/items/items';
import { ErrorPage } from '~/pages/error-page/error-page';
import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper';


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
    <Page>
      <Header variant="auto" withPadding>
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <ActionIcon variant="transparent">
          <UiMenuDots3HIcon24Regular />
        </ActionIcon>
      </Header>

      <Wrapper background='none' noPaddingHorizontal noGap>
        <div className={styles.bookCover}>
          <img className={styles.bookImage} src={book.isPhotoUploaded! ? book.bookCoverUrl! : '/default-book-cover.png'} />
          <div className={_styles.roundRect} />
        </div>
        <div className={styles.bookContent}>
          <div className={styles.bookInfo}>
            <div className={styles.bookHeader}>
              <div className={styles.bookExtra}>
                <span className={_styles.textGray}>{book?.author}</span>
                <span className={_styles.textGray}>/</span>
                <span className={_styles.textGray}>
                  {book.publicationYear}
                  {' '}
                г.
                </span>
              </div>
              <Title className={`${_styles.title} ${_styles.textCenter}`}>{book?.title}</Title>
            </div>
            <div className={styles.bookBlock}>
              <span className={_styles.textGray}>Описание</span>
              <p>{book?.description}</p>
            </div>
            <Divider my="l" />
          </div>
          
          <section className={styles.queues}>
            <Header variant="left" withPadding>
              <Title>Эта книга у ваших друзей</Title>
            </Header>
            {queueList == undefined || queueList.length == 0
              ? (
                <IllustrationWrapper
                  src="/queue-illustration.svg"
                  alt="Queue is empty illustration"
                  text="Очередей нет"
                />
              )
              : queueList.map((queue) => <Queue {...queue} bookId={id!} key={id!} />)}
          </section>
        </div>
      </Wrapper>
    </Page>
  );
};
