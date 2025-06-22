import { ActionIcon, Anchor, Avatar, Button, Menu, Text, Title } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { People1PlusIcon24Regular, TrashCanIcon24Regular, XIcon24Regular } from '@skbkontur/icons';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { UiMenuDots3HIcon24Regular } from '@skbkontur/icons/icons/UiMenuDots3HIcon';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import _styles from '~/index.module.css';
import styles from '~/pages/profile-user/profile-user.module.css';

import { BookCard } from '~/components/book-card/book-card';
import { Modal } from '~/components/custom-mantine/modal/modal';
import { FriendRequestActions } from '~/components/friend-request-actions';
import { Header } from '~/components/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { AppRoute } from '~/conts';
import { useGetBooksFriendBooks } from '~/generated-api/books/books';
import {
  deleteFriendsDelete,
  getGetFriendsListQueryKey,
  postFriendsCancelRequest,
  postFriendsSendRequest,
} from '~/generated-api/friends/friends';
import { FriendshipStatus } from '~/generated-api/model';
import { getGetUsersUsernameQueryKey, useGetUsersMe, useGetUsersUsername } from '~/generated-api/users/users';
import { router } from '~/main';
import { ErrorPage } from '~/pages/error-page/error-page';
import { LoadingPage } from '~/pages/loading-page';
import { queryClient } from '~/services/query-client';
import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper/wrapper';

export const UserPage = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useViewportSize();
  const isRenderedOnDesktop = width >= 768;

  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useGetUsersUsername(username!);
  const { data: userMe, isLoading: isLoadingUserMe, isError: isErrorUserMe } = useGetUsersMe();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: bookList, isLoading: isLoadingBooks, isError: isErrorBooks } = useGetBooksFriendBooks(
    { friendId: user?.id },
    { query: { enabled: user?.friendshipStatus === FriendshipStatus.Friend } }
  );

  const { mutateAsync: sendRequest } = useMutation({
    mutationFn: postFriendsSendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetUsersUsernameQueryKey(username!) });
      notifications.show({
        title: 'Запрос в друзья отправлен',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
  });

  const { mutateAsync: deleteFriend } = useMutation({
    mutationFn: deleteFriendsDelete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetFriendsListQueryKey() });
      await router.navigate(AppRoute.Friends);

      notifications.show({
        title: 'Пользователь удален из друзей',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
  });

  const { mutateAsync: removeRequest } = useMutation({
    mutationFn: postFriendsCancelRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetUsersUsernameQueryKey(username!) });
      notifications.show({
        title: 'Запрос в друзья отменен',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
  });

  const onDeleteFriend = async () => {
    setIsLoading(true);
    await deleteFriend({ personToDeleteId: user?.id });
    setIsLoading(false);
  };

  const onSentRequest = async () => {
    setIsLoading(true);
    await sendRequest({ personToSendId: user?.id });
    setIsLoading(false);
  };

  const onRemoveRequest = async () => {
    setIsLoading(true);
    await removeRequest({ person: user?.id });
    setIsLoading(false);
  };

  if (isLoadingUser || isLoadingBooks || isLoadingUserMe || isErrorUserMe) {
    return <LoadingPage/>;
  }

  if (isErrorUser || isErrorBooks || isErrorUserMe || !user) {
    return <ErrorPage withoutMenu={false}/>;
  }

  if (userMe?.id === user?.id) {
    router.navigate(AppRoute.Profile).then();
  }

  return (
    <>
      <Modal opened={opened} onClose={close} onSubmit={onDeleteFriend} loadingSubmit={isLoading}
        title='Удалить из друзей?'
        description='Человек удалится из всех ваших очередей, а вы будете удалены из всех очередей человека.'
        submitButtonText='Да, удалить' closeButtonText='Нет, оставить'/>

      <Page>
        <Header variant='auto' withPadding hideOnDesktop>
          <ActionIcon variant='transparent' onClick={() => {
            window.history.back();
          }}>
            <ArrowALeftIcon24Regular/>
          </ActionIcon>

          {user.friendshipStatus == FriendshipStatus.Friend && (
            <Menu position='bottom-end' offset={-50}>
              <Menu.Target>
                <ActionIcon variant='transparent'>
                  <UiMenuDots3HIcon24Regular/>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={open} leftSection={<TrashCanIcon24Regular/>}>
                  Удалить из друзей
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Header>

        <div className={styles.userContent}>
          <Avatar
            src={user.highQualityPhotoUrl || '/default-profile.png'}
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

            {user.friendshipStatus == FriendshipStatus.None && (
              <Button fullWidth={!isRenderedOnDesktop} loading={isLoading} variant={isRenderedOnDesktop ? 'outline' : 'white'}
                leftSection={<People1PlusIcon24Regular/>} onClick={onSentRequest}>
                Добавить в друзья
              </Button>
            )}

            {user.friendshipStatus == FriendshipStatus.OutcomeRequest && (
              <Button fullWidth={!isRenderedOnDesktop} loading={isLoading} variant={isRenderedOnDesktop ? 'outline' : 'white'}
                leftSection={<XIcon24Regular/>} onClick={onRemoveRequest}>
                Отменить заявку
              </Button>
            )}

            {user.friendshipStatus == FriendshipStatus.IncomeRequest && (
              <FriendRequestActions id={user.id} isBigSize username={user.username}/>
            )}

            {user.friendshipStatus == FriendshipStatus.Friend && user.contactUrl && (
              <Anchor href={user.contactUrl} className={styles.userLink}>
                Связаться
              </Anchor>
            )}
          </div>
          {user.friendshipStatus == FriendshipStatus.Friend && (
            <Menu position='bottom-end' offset={-50}>
              <Menu.Target>
                <ActionIcon variant='transparent' className={styles.menuDesktopButton}>
                  <UiMenuDots3HIcon24Regular/>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={open} leftSection={<TrashCanIcon24Regular/>}>
                  Удалить из друзей
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
        <Wrapper>
          <Title order={6}>Книги для обмена</Title>

          <div className={styles.bookList}>
            {user.friendshipStatus == FriendshipStatus.Friend ? (
              bookList == undefined || bookList.length == 0
                ? (
                  <IllustrationWrapper
                    src='/profile-illustration.svg'
                    alt='No books illustration'
                    text='У твоего друга книг пока нет.'
                  />
                )
                : bookList?.map((book) => <BookCard {...book} key={book.id}/>)
            ) : (
              <IllustrationWrapper
                src='/profile-illustration.svg'
                alt='No available books illustration'
                text='Книги скрыты. Добавьте человека в друзья, чтобы их увидеть.'
              />
            )}
          </div>
        </Wrapper>
      </Page>
    </>
  );
};
