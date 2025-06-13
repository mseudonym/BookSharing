import { Title } from '@mantine/core';
import React from 'react';

import styles from '~/pages/shelf-page/shelf-page.module.css';

import { BookCard } from '~/components/book-card/book-card';
import { Header } from '~/components/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { useGetBooksAllFriendsBooks } from '~/generated-api/books/books';
import { ErrorPage } from '~/pages/error-page/error-page';
import { LoadingPage } from '~/pages/loading-page';
import { PageWithWrapper } from '~/ui/pages';

export const ShelfPage = () => {
  const { data: bookList, isLoading, isError } = useGetBooksAllFriendsBooks();

  if (isLoading) {
    return <LoadingPage/>;
  }

  if (isError) {
    return <ErrorPage/>;
  }

  return (
    <PageWithWrapper>
      <Header variant='left'>
        <Title order={5}>Полка друзей</Title>
      </Header>
      <section className={styles.bookList}>
        {bookList == undefined || bookList.length == 0
          ? (
            <IllustrationWrapper
              src='/shelf-illustration.svg'
              alt='Shelf is empty illustration'
              text='Добавьте друзей, чтобы увидеть книги, которые они выложили.'
            />
          )
          : bookList.map((book) => <BookCard {...book} key={book.id}/>)}
      </section>
    </PageWithWrapper>
  );
};
