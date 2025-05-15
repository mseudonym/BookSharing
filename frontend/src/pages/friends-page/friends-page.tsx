import { ActionIcon, Loader, SegmentedControl, Title } from '@mantine/core';
import { SearchLoupeIcon24Regular } from '@skbkontur/icons/icons/SearchLoupeIcon';
import React, { useState } from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/friends-page/friends-page.module.css';

import { FriendCard } from '~/components/friend-card/friend-card';
import { RequestCard } from '~/components/friend-card/request-card';
import { Header } from '~/components/header/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { FriendsTabs } from '~/conts';
import { useGetFriendsList, useGetFriendsRequestsReceived } from '~/generated-api/friends/friends';
import { ErrorPage } from '~/pages/error-page/error-page';
import { PageWithWrapper } from '~/ui/pages';

export const FriendsPage = () => {
  const { data: friendList, isLoading: isLoadingFriends, isError: isErrorFriends } = useGetFriendsList();
  const { data: requestList, isLoading: isLoadingRequests, isError: isErrorRequests } = useGetFriendsRequestsReceived();
  const [activeTab, setActiveTab] = useState<string>(FriendsTabs.MyFriends);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoadingFriends || isLoadingRequests) {
    return <Loader />;
  }

  if (isErrorFriends || isErrorRequests) {
    return <ErrorPage />;
  }

  return (
    <PageWithWrapper>
      <Header variant="auto">
        <Title className={_styles.title}>Друзья</Title>
        <ActionIcon variant="transparent">
          <SearchLoupeIcon24Regular />
        </ActionIcon>
      </Header>

      <SegmentedControl
        data={[FriendsTabs.MyFriends, FriendsTabs.Requests]}
        value={activeTab}
        onChange={handleTabChange}
        classNames={{
          root: `${styles.tabsRoot}`,
          label: `${styles.tabsLabel}`,
          indicator: `${styles.tabsIndicator}`,
        }}
      />

      {activeTab == FriendsTabs.MyFriends
        ? (
          <section className={styles.friendList}>
            {friendList == undefined || friendList.length == 0
              ? (
                <IllustrationWrapper
                  src="/friends-illustration.svg"
                  alt="No friends illustration"
                  text="Друзья пока не добавлены. Это можно сделать через кнопку поиска сверху."
                />
              )
              : friendList.map((friend) => <FriendCard {...friend} key={friend.id} />)}
          </section>
        )
        : (
          <section className={styles.friendList}>
            {requestList == undefined || requestList.length == 0
              ? (
                <IllustrationWrapper
                  src="/request-illustration.svg"
                  alt="No requests illustration"
                  text="Заявок пока нет, но можно кого-нибудь добавить самому."
                />
              )
              : requestList.map((person) => <RequestCard {...person} key={person.id} />)}
          </section>

        )}
    </PageWithWrapper>
  );
};
