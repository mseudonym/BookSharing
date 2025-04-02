import _styles from '../../index.module.css';
import styles from './friends-page.module.css';
import { useState } from 'react';
import { PageWithNavbar } from '../../ui/page/page-with-navbar';
import { Header } from '../../components/header/header';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { useGetFriendsList } from '../../generated-api/friends/friends';
import { FriendCard } from '../../components/friend-card/friend-card';
import { Loading } from '../../components/loading/loading';
import { SegmentedControl } from '@mantine/core';
import { ErrorPage } from '../error-page/error-page';
import { SearchLoupeIcon24Regular } from '@skbkontur/icons/icons/SearchLoupeIcon';
import { FriendsTabs } from '../../conts';
import { EmptyState } from '../../components/empty-state/empty-state';

export const FriendsPage = () => {
  const { data: friendList, isLoading, isError } = useGetFriendsList();
  const [activeTab, setActiveTab] = useState<string>(FriendsTabs.MyFriends);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <PageWithNavbar>
      <Header variant="auto">
        <h1 className={_styles.title}>Друзья</h1>
        <ButtonIcon variant="flat">
          <SearchLoupeIcon24Regular />
        </ButtonIcon>
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
            <EmptyState
              src="/request-illustration.svg"
              alt="No requests illustration"
              text="Заявок пока нет, но можно кого-нибудь добавить самому."
            />
          )}
    </PageWithNavbar>
  );
};
