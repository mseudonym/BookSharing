import _styles from '../../index.module.css'
import styles from './friends-page.module.css';
import { FC, useState } from 'react';
import { PageWithNavbar } from '../../ui/page/page-with-navbar';
import { Header } from '../../components/header/header';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { SearchLoupeIcon24Regular } from '@skbkontur/icons';
import { getFriendsList, getGetFriendsListQueryKey } from '../../generated-api/friends/friends';
import { useQuery } from '@tanstack/react-query';
import { FriendCard } from '../../components/friend-card/friend-card';
import { Loading } from '../../components/loading/loading';
import { SegmentedControl } from '@mantine/core';

export const FriendsPage: FC = () => {
  const { data: friendList, isLoading } = useQuery({
    queryFn: () => getFriendsList(),
    queryKey: getGetFriendsListQueryKey(),
  })

  const [activeTab, setActiveTab] = useState('Мои друзья');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <PageWithNavbar>
      <Header variant='auto'>
        <h1 className={_styles.title}>Друзья</h1>
        <ButtonIcon variant='flat'>
          <SearchLoupeIcon24Regular />
        </ButtonIcon>
      </Header>

      <SegmentedControl
        data={['Мои друзья', 'Заявки']}
        value={activeTab}
        onChange={handleTabChange}
        classNames={{
          root: `${styles.tabsRoot}`,
          label: `${styles.tabsLabel}`,
          indicator: `${styles.tabsIndicator}`,
        }} />

      {activeTab == 'Мои друзья' ?
        <section className={styles.friendList}>
          {friendList == undefined || friendList.length == 0
            ? <div className={_styles.illustrationWrapper}>
              <img loading='lazy'
                src='/friends-illustration.svg'
                alt='FriendsEmpty illustration' />
              <p className={_styles.textCenter}>Друзья пока не добавлены. Это можно сделать через кнопку поиска сверху.</p>
            </div>
            : friendList.map((friend) => <FriendCard {...friend} key={friend.id} />)}
        </section>
        : <div className={_styles.illustrationWrapper}>
          <img loading='lazy'
            src='/request-illustration.svg'
            alt='RequestEmpty illustration' />
          <p className={_styles.textCenter}>Заявок пока нет, но можно добавить кого-нибудь самому. </p>
        </div>}
    </PageWithNavbar>
  );
}