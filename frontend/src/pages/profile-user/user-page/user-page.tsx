import { ActionIcon, Anchor, Title, Text, Avatar, Button, Flex, Modal, Menu } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { CheckAIcon24Regular, People1PlusIcon24Regular, TrashCanIcon24Regular, XIcon24Regular } from '@skbkontur/icons';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { UiMenuDots3HIcon24Regular } from '@skbkontur/icons/icons/UiMenuDots3HIcon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import _styles from '~/index.module.css';
import styles from '~/pages/profile-user/profile-user.module.css';

import { BookCard } from '~/components/book-card/book-card';
import { Header } from '~/components/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { AppRoute } from '~/conts';
import { useGetBooksFriendBooks } from '~/generated-api/books/books';
import {  deleteFriendsDelete, getGetFriendsListQueryKey, postFriendsCancelRequest, postFriendsRespondRequest } from '~/generated-api/friends/friends';
import { postFriendsSendRequest } from '~/generated-api/friends/friends';
import { FriendshipStatus } from '~/generated-api/model';
import { getGetUsersUsernameQueryKey, useGetUsersMe, useGetUsersUsername } from '~/generated-api/users/users';
import { router } from '~/main';
import { ErrorPage } from '~/pages/error-page/error-page';
import { LoadingPage } from '~/pages/loading-page';
import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper/wrapper';

export const UserPage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useGetUsersUsername(username!);
  const { data: userMe, isLoading: isLoadingUserMe, isError: isErrorUserMe } = useGetUsersMe();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: bookList, isLoading: isLoadingBooks, isError: isErrorBooks } = useGetBooksFriendBooks(
    { friendId: user?.id },
    { query: { enabled: user?.friendshipStatus === FriendshipStatus.Friend } }
  );
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useViewportSize();

  const { mutateAsync: sendRequest } = useMutation({
    mutationFn: postFriendsSendRequest,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: getGetUsersUsernameQueryKey(username!) });
      notifications.show({
        title: 'Запрос в друзья отправлен',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
  });

  const { mutateAsync: respondRequest } = useMutation({
    mutationFn: postFriendsRespondRequest,
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetUsersUsernameQueryKey(username!) });
      notifications.show({
        title: variables?.isAccepted ? 'Заявка принята' : 'Заявка отклонена',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
  });

  const { mutateAsync: deleteFriend } = useMutation({
    mutationFn: deleteFriendsDelete,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: getGetFriendsListQueryKey() });
      router.navigate(AppRoute.Friends);

      notifications.show({
        title: 'Друг удален',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
  });

  const { mutateAsync: removeRequest } = useMutation({
    mutationFn: postFriendsCancelRequest,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: getGetUsersUsernameQueryKey(username!) });
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

  const onRespondRequest = async ({ isAccepted }: { isAccepted: boolean }) => {
    setIsLoading(true);
    await respondRequest({ personToRespondId: user?.id, isAccepted });
    setIsLoading(false);
  };

  const onRemoveRequest = async () => {
    setIsLoading(true);
    await removeRequest({ person: user?.id });
    setIsLoading(false);
  };

  if (isLoadingUser || isLoadingBooks || isLoadingUserMe || isErrorUserMe) {
    return <LoadingPage />;
  }

  if (isErrorUser || isErrorBooks || isErrorUserMe || !user ) {
    return <ErrorPage />;
  }

  if (userMe?.id === user?.id) {
    router.navigate(AppRoute.Profile);
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title="Удалить из друзей?" centered>
        <Text className={_styles.textGray}>Человек удалится из всех ваших очередей, а вы будете удалены из всех очередей человека.</Text>
        <Flex
          justify="flex-start"
          align="center"
          direction="row"
          gap="var(--mantine-spacing-sm)"
        >
          <Button variant="filled" onClick={onDeleteFriend} loading={isLoading}>
          Да, удалить
          </Button>
          <Button  color="outline" onClick={close}>
          Нет, оставить
          </Button>
        </Flex>
      </Modal>

      <Page>
        <Header variant="auto" withPadding hideOnDesktop>
          <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
            <ArrowALeftIcon24Regular />
          </ActionIcon>

          {user.friendshipStatus == FriendshipStatus.Friend && (
            <Menu position='bottom-end' offset={-50}>
              <Menu.Target>
                <ActionIcon variant="transparent">
                  <UiMenuDots3HIcon24Regular />
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
            alt="Avatar"
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
              <Button fullWidth loading={isLoading} variant={width < 768 ? 'white' : 'outline'} leftSection={<People1PlusIcon24Regular />} onClick={onSentRequest}>
            Добавить в друзья
              </Button>
            )}

            {user.friendshipStatus == FriendshipStatus.OutcomeRequest && (
              <Button fullWidth loading={isLoading} variant={width < 768 ? 'white' : 'outline'} leftSection={<XIcon24Regular/>} onClick={onRemoveRequest}>
            Отменить заявку
              </Button>
            )}

            {user.friendshipStatus == FriendshipStatus.IncomeRequest && (
              <Flex gap='sm' className={styles.userRespondActions}>
                <Button fullWidth variant={width < 768 ? 'white' : 'outline'} leftSection={<CheckAIcon24Regular color='var(--green-color)' />} onClick={() => onRespondRequest({ isAccepted: true })}>
              Принять заявку
                </Button>
                <ActionIcon variant={width < 768 ? 'white' : 'outline'} onClick={() => onRespondRequest({ isAccepted: false })}>
                  <XIcon24Regular color='var(--red-color)' />
                </ActionIcon>
              </Flex>
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
                <ActionIcon variant="transparent" className={styles.menuDesktopButton}>
                  <UiMenuDots3HIcon24Regular />
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
                    src="/profile-illustration.svg"
                    alt="No books illustration"
                    text="У твоего друга книг пока нет."
                  />
                )
                : bookList?.map((book) => <BookCard {...book} key={book.id} />)
            ) : (
              <IllustrationWrapper
                src="/profile-illustration.svg"
                alt="No available books illustration"
                text="Книги скрыты. Добавьте человека в друзья, чтобы их увидеть."
              />
            )}
          </div>
        </Wrapper>
      </Page>
    </>
  );
};
