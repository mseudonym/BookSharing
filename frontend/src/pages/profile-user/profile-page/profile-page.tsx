import { ActionIcon, Anchor, Avatar, Button, Text, Title } from '@mantine/core';
import { PlusIcon24Regular } from '@skbkontur/icons/icons/PlusIcon';
import { SettingsGearIcon24Regular } from '@skbkontur/icons/icons/SettingsGearIcon';
import React from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/profile-user/profile-user.module.css';

import { BookCard } from '~/components/book-card/book-card';
import { Header } from '~/components/header';
import { AppRoute } from '~/conts';
import { useGetBooksMyBooks } from '~/generated-api/books/books';
import { useGetUsersMe } from '~/generated-api/users/users';
import { router } from '~/main';
import { ErrorPage } from '~/pages/error-page/error-page';
import { LoadingPage } from '~/pages/loading-page';
import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper';

export const ProfilePage = () => {
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useGetUsersMe();
  const { data: bookList, isLoading: isLoadingBooks, isError: isErrorBooks } = useGetBooksMyBooks();

  if (isLoadingUser || isLoadingBooks) {
    return <LoadingPage/>;
  }

  if (isErrorUser || isErrorBooks || !user) {
    return <ErrorPage/>;
  }

  return (
    <Page>
      <Header variant='right' withPadding hideOnDesktop>
        <ActionIcon variant='transparent' onClick={() => router.navigate(AppRoute.Settings)}>
          <SettingsGearIcon24Regular/>
        </ActionIcon>
      </Header>
      <div className={styles.userContent}>
        <Avatar
          src={user.photoUrl || '/default-profile.png'}
          alt='Avatar'
          className={styles.avatar}
        />
        <div className={styles.userInfoAction}>
          <div className={styles.userInfo}>
            <Title className={styles.userTitle} order={5}>
              {user.firstName}
              {' '}
              {user.lastName}
            </Title>
            <Text span className={`${_styles.textGray} ${styles.userName}`}>
              @
              {user.username}
            </Text>
          </div>
          {user.contactUrl && (
            <Anchor href={user.contactUrl} className={styles.userLink}>
              Связаться
            </Anchor>
          )}
        </div>
      </div>
      <Wrapper>
        <Title order={6}>Книги для обмена</Title>
        <div className={styles.bookList}>
          <Button variant='outline' className={styles.addBookButton}
            onClick={() => router.navigate(AppRoute.AddBook)}>
            <PlusIcon24Regular/>
          </Button>
          {bookList?.map((book) => <BookCard {...book} key={book.id}/>)}
        </div>
      </Wrapper>
    </Page>
  );
};
