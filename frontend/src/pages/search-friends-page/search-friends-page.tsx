import { ActionIcon, Input, Loader } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import React, { useMemo, useState } from 'react';

import { SearchFriendCard } from '~/components/friend-request/search-friend-card/search-friend-card';
import { Header } from '~/components/header/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { useGetFriendsList } from '~/generated-api/friends/friends';
import { useGetUsersMe, useGetUsersSearchUsernamePrefix } from '~/generated-api/users/users';
import { PageWithWrapper } from '~/ui/pages/page-with-wrapper/page-with-wrapper';

export const SearchFriendsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ debouncedSearchQuery ] = useDebouncedValue(searchQuery, 500);
  const { data: friendList } = useGetFriendsList();
  const { data: me } = useGetUsersMe();
  const {
    data: userList,
    isLoading: isLoadingUserList
  } = useGetUsersSearchUsernamePrefix(debouncedSearchQuery, { query: { enabled: debouncedSearchQuery.length > 2 } });

  const filteredUserList = useMemo(() => {
    if (!userList || !friendList)
      return userList;

    return userList.filter((user) => user.id !== me?.id);
  }, [userList, friendList, me?.id]);

  return (
    <PageWithWrapper>
      <Header variant='left'>
        <ActionIcon variant='transparent' onClick={() => {
          window.history.back();
        }}>
          <ArrowALeftIcon24Regular/>
        </ActionIcon>
        <Input placeholder='Введите никнейм пользователя' value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}/>
      </Header>

      {isLoadingUserList && <Loader/>}

      {!isLoadingUserList && (filteredUserList == undefined || filteredUserList.length == 0)
        ? (
          <IllustrationWrapper
            src='/search-illustration.svg'
            alt='No users illustration'
            text='Тут ничего нет. Введите никнейм пользователя или проверьте его на правильность.'
          />
        ) : filteredUserList?.map((user) => <SearchFriendCard {...user} key={user.id}/>)}
    </PageWithWrapper>
  );
};
