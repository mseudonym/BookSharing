import { ActionIcon, Anchor, Loader, Title } from '@mantine/core';
import { PlusIcon24Regular } from '@skbkontur/icons/icons/PlusIcon';
import { SettingsGearIcon24Regular } from '@skbkontur/icons/icons/SettingsGearIcon';
import React from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/profile-page/profile-page.module.css';

import { BookCard } from '~/components/book-card/book-card';
import { Header } from '~/components/header/header';
import { useGetBooksMyBooks } from '~/generated-api/books/books';
import { useGetUsersMe } from '~/generated-api/users/users';
import { router } from '~/main';
import { ErrorPage } from '~/pages/error-page/error-page';
import { Page } from '~/ui/pages/page';

export const ProfilePage = () => {
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useGetUsersMe();
  const { data: bookList, isLoading: isLoadingBooks, isError: isErrorBooks } = useGetBooksMyBooks();

  if (isLoadingUser || isLoadingBooks) {
    return <Loader />;
  }

  if (isErrorUser || isErrorBooks || !user) {
    return <ErrorPage />;
  }

  return (
    <Page>
      <Header variant="right" withPadding>
        <ActionIcon variant="transparent">
          <SettingsGearIcon24Regular />
        </ActionIcon>
      </Header>
      <div className={styles.userContent}>
        <img
          src={user.photoUrl || '/default-profile.png'}
          alt="Avatar"
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <Title className={`${_styles.title} ${_styles.textCenter}`}>
            {user.firstName}
            {' '}
            {user.lastName}
          </Title>
          <p className={_styles.textGray}>
            @
            {user.username}
          </p>
        </div>
        {user.contactUrl && (
          <Anchor href={user.contactUrl}>
            Связаться
          </Anchor>
        )}
      </div>
      <div className={styles.bookList}>
        <button className={styles.addButton} onClick={() => router.navigate('/add-book')}><PlusIcon24Regular /></button>
        {bookList?.map((book) => <BookCard {...book} key={book.id} />)}
      </div>
    </Page>
  );
};
