import { ActionIcon, Loader, SegmentedControl } from '@mantine/core';
import { SearchLoupeIcon24Regular } from '@skbkontur/icons/icons/SearchLoupeIcon';
import React, { useState } from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/friends-page/friends-page.module.css';

import { EmptyState } from '~/components/empty-state/empty-state';
import { FriendCard } from '~/components/friend-card/friend-card';
import { RequestCard } from '~/components/friend-card/request-card';
import { Header } from '~/components/header/header';
import { FriendsTabs } from '~/conts';
import { useGetFriendsList, useGetFriendsRequestsReceived } from '~/generated-api/friends/friends';
import { ErrorPage } from '~/pages/error-page/error-page';
import { Page } from '~/ui/pages/page/page';

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
    <Page>
      <Header variant="auto">
        <h1 className={_styles.title}>Друзья</h1>
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
                <EmptyState
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
                <EmptyState
                  src="/request-illustration.svg"
                  alt="No requests illustration"
                  text="Заявок пока нет, но можно кого-нибудь добавить самому."
                />
              )
              : requestList.map((person) => <RequestCard {...person} key={person.id} />)}
          </section>

        )}
    </Page>
  );
};
