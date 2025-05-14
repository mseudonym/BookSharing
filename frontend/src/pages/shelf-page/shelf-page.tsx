import { Loader } from '@mantine/core';
import React from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/shelf-page/shelf-page.module.css';

import { BookCard } from '~/components/book-card/book-card';
import { EmptyState } from '~/components/empty-state/empty-state';
import { Header } from '~/components/header/header';
import { useGetBooksAllFriendsBooks } from '~/generated-api/books/books';
import { ErrorPage } from '~/pages/error-page/error-page';
import { Page } from '~/ui/pages/page/page';

export const ShelfPage = () => {
  const { data: bookList, isLoading, isError } = useGetBooksAllFriendsBooks();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <Page>
      <Header variant="left">
        <h1 className={_styles.title}>Полка друзей</h1>
      </Header>
      <section className={styles.bookList}>
        {bookList == undefined || bookList.length == 0
          ? (
            <EmptyState
              src="/shelf-illustration.svg"
              alt="Shelf is empty illustration"
              text="Добавьте друзей, чтобы увидеть книги, которые они выложили."
            />
          )
          : bookList.map((book) => <BookCard {...book} key={book.id} />)}
      </section>
    </Page>
  );
};
