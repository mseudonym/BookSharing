import { Title, Tabs, SimpleGrid } from '@mantine/core';
import React from 'react';

import { Header } from '~/components/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { StorageCard } from '~/components/storage-card';
import { StorageTabs } from '~/conts';
import { useGetItemsFriends, useGetItemsMy } from '~/generated-api/items/items';
import { useGetUsersMe } from '~/generated-api/users/users';
import { ErrorPage } from '~/pages/error-page';
import { LoadingPage } from '~/pages/loading-page';
import { PageWithWrapper } from '~/ui/pages';

export const StoragePage = () => {
  const { data: friendsBooks, isLoading: isLoadingFriendsBooks, isError: isErrorFriendsBooks } = useGetItemsFriends();
  const { data: myBooks, isLoading: isLoadingMy, isError: isErrorMy } = useGetItemsMy();
  const { data: user, isLoading: isLoadingUser, isError: IsErrorUser } = useGetUsersMe();

  if (isLoadingFriendsBooks || isLoadingMy || isLoadingUser) {
    return <LoadingPage/>;
  }

  if (isErrorFriendsBooks || isErrorMy || IsErrorUser) {
    return <ErrorPage/>;
  }

  return (
    <PageWithWrapper>
      <Header variant='left'>
        <Title order={5}>Предметы</Title>
      </Header>

      <Tabs defaultValue={StorageTabs.Friends}>
        <Tabs.List>
          <Tabs.Tab value={StorageTabs.Friends}>Друзей</Tabs.Tab>
          <Tabs.Tab value={StorageTabs.My}>Мои</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={StorageTabs.Friends}>
          {friendsBooks == undefined || friendsBooks.length == 0 ?
            (
              <IllustrationWrapper
                src='/storage-illustration.svg'
                alt='Storage is empty illustration'
                text='Тут пока ничего нет. Чтобы появилось, встаньте в очередь за книгой друга.'
              />
            ) :
              <SimpleGrid
                cols={{ base: 1, md: 2 }}
                spacing={{ base: 'md', }}
                verticalSpacing={{ base: 'md' }}
            >
                {friendsBooks.map((item) => <StorageCard user={user} {...item} key={item.itemId}/>)}
              </SimpleGrid>
          }
        </Tabs.Panel>

        <Tabs.Panel value={StorageTabs.My}>
          {myBooks == undefined || myBooks.length == 0 ?
            (
              <IllustrationWrapper
                src='/storage-illustration.svg'
                alt='Storage is empty illustration'
                text='Тут пока ничего нет. Появится, когда друзья встанут в очередь за вашей книгой.'
              />) :
              <SimpleGrid
                cols={{ base: 1 }}
                spacing={{ base: 'md', md: 'xl' }}
                verticalSpacing={{ base: 'md', md: 'xl' }}
            >
                {myBooks.map((item) => <StorageCard user={user} {...item} key={item.itemId}/>)}
              </SimpleGrid>
          }
        </Tabs.Panel>
      </Tabs>
    </PageWithWrapper>
  );
};
