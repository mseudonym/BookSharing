import { ActionIcon, Anchor, Loader, Title, Text, Avatar } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { UiMenuDots3HIcon24Regular } from '@skbkontur/icons/icons/UiMenuDots3HIcon';
import React from 'react';
import { useParams } from 'react-router-dom';

import _styles from '~/index.module.css';
import styles from '~/pages/profile-user/profile-user.module.css';

import { BookCard } from '~/components/book-card/book-card';
import { Header } from '~/components/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { useGetBooksFriendBooks } from '~/generated-api/books/books';
import { useGetUsersUsername } from '~/generated-api/users/users';
import { ErrorPage } from '~/pages/error-page/error-page';
import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper/wrapper';


export const UserPage = () => {
  const { username } = useParams();
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useGetUsersUsername(username!);
  const { data: bookList, isLoading: isLoadingBooks, isError: isErrorBooks } = useGetBooksFriendBooks({ friendId: user?.id });

  if (isLoadingUser || isLoadingBooks) {
    return <Loader />;
  }

  if (isErrorUser || isErrorBooks || !user) {
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
      <div className={styles.userContent}>
        <Avatar
          src={user.highQualityPhotoUrl || '/default-profile.png'}
          alt="Avatar"
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <Title order={2} ta='center'>
            {user.firstName}
            {' '}
            {user.lastName}
          </Title>
          <Text span className={_styles.textGray}>
            @
            {user.username}
          </Text>
        </div>
        {user.contactUrl && (
          <Anchor href={user.contactUrl}>
            Связаться
          </Anchor>
        )}
      </div>
      <Wrapper>
        <Title order={2}>Книги для обмена</Title>
        <div className={styles.bookList}>
          {bookList == undefined || bookList.length == 0
            ? (
              <IllustrationWrapper
                src="/profile-illustration.svg"
                alt="No books illustration"
                text="У твоего друга книг пока нет."
              />
            )
            : bookList?.map((book) => <BookCard {...book} key={book.id} />)}
        </div>
      </Wrapper>
    </Page>
  );
};
