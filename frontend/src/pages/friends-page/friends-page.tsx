import { ActionIcon, Badge, SimpleGrid, Tabs, Title } from '@mantine/core';
import { SearchLoupeIcon24Regular } from '@skbkontur/icons/icons/SearchLoupeIcon';
import React from 'react';

import { FriendCard, RequestCard } from '~/components/friend-request';
import { Header } from '~/components/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { AppRoute, FriendsTabs } from '~/conts';
import { useGetFriendsList, useGetFriendsRequestsReceived } from '~/generated-api/friends/friends';
import { router } from '~/main';
import { ErrorPage } from '~/pages/error-page/error-page';
import { LoadingPage } from '~/pages/loading-page';
import { PageWithWrapper } from '~/ui/pages';

export const FriendsPage = () => {
  const { data: friendList, isLoading: isLoadingFriends, isError: isErrorFriends } = useGetFriendsList();
  const { data: requestList, isLoading: isLoadingRequests, isError: isErrorRequests } = useGetFriendsRequestsReceived();

  if (isLoadingFriends || isLoadingRequests) {
    return <LoadingPage />;
  }

  if (isErrorFriends || isErrorRequests) {
    return <ErrorPage />;
  }

  return (
    <PageWithWrapper>
      <Header variant="auto">
        <Title>Друзья</Title>
        <ActionIcon variant="transparent" onClick={() => { router.navigate(AppRoute.SearchFriends); }}>
          <SearchLoupeIcon24Regular />
        </ActionIcon>
      </Header>

      <Tabs defaultValue={FriendsTabs.MyFriends} variant='pills'>
        <Tabs.List>
          <Tabs.Tab value={FriendsTabs.MyFriends}>Мои друзья</Tabs.Tab>
          <Tabs.Tab value={FriendsTabs.Requests} 
            rightSection={requestList  && requestList.length > 0 && <Badge>{requestList.length}</Badge>}>
                Запросы
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={FriendsTabs.MyFriends}>
          <SimpleGrid
            cols={{ base: 1, md: 2 }}
            spacing={{ base: 'md',  }}
            verticalSpacing={{ base: 'md' }}
          >
            {friendList == undefined || friendList.length == 0
              ? (
                <IllustrationWrapper
                  src="/friends-illustration.svg"
                  alt="No friends illustration"
                  text="Друзья пока не добавлены. Это можно сделать через кнопку поиска сверху."
                />
              )
              : friendList.map((friend) => <FriendCard {...friend} key={friend.id} />)}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value={FriendsTabs.Requests}>
          <SimpleGrid
            cols={{ base: 1 }}
            spacing={{ base: 'md', md: 'xl' }}
            verticalSpacing={{ base: 'md', md: 'xl' }}
          >
            {requestList == undefined || requestList.length == 0
              ? (
                <IllustrationWrapper
                  src="/request-illustration.svg"
                  alt="No requests illustration"
                  text="Заявок пока нет, но можно кого-нибудь добавить самому."
                />
              )
              : requestList.map((person) => <RequestCard {...person} key={person.id} />)}
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
    </PageWithWrapper>
  );
};
