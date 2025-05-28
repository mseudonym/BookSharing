import { Title, Tabs, SimpleGrid } from '@mantine/core';
import React from 'react';

import { Header } from '~/components/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { StorageMyCard } from '~/components/storage-card';
import { StorageFriendCard } from '~/components/storage-card';
import { StorageTabs } from '~/conts';
import { useGetItemsFriends, useGetItemsMy } from '~/generated-api/items/items';
import { ErrorPage } from '~/pages/error-page';
import { LoadingPage } from '~/pages/loading-page';
import { PageWithWrapper } from '~/ui/pages';

export const StoragePage = () => {
  const { data: friendsBooks, isLoading: isLoadingFriendsBooks, isError: isErrorFriendsBooks } = useGetItemsFriends();
  const { data: myBooks, isLoading: isLoadingMy, isError: isErrorMy } = useGetItemsMy();

  if (isLoadingFriendsBooks || isLoadingMy) {
    return <LoadingPage />;
  }

  if (isErrorFriendsBooks || isErrorMy) {
    return <ErrorPage />;
  }

  return (
    <PageWithWrapper>
      <Header variant="left">
        <Title>Предметы</Title>
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
                src="/shelf-illustration.svg"
                alt="Shelf is empty illustration"
                text="Добавьте друзей, чтобы увидеть книги, которые они выложили."
              />
            ) :
            <SimpleGrid
              cols={{ base: 1, md: 2 }}
              spacing={{ base: 'md',  }}
              verticalSpacing={{ base: 'md' }}
            >
              {friendsBooks.map((item) => <StorageFriendCard {...item} key={item.itemId} />)}
            </SimpleGrid>
          }
        </Tabs.Panel>

        <Tabs.Panel value={StorageTabs.My}>
          {myBooks == undefined || myBooks.length == 0 ?
            (
              <IllustrationWrapper
                src="/request-illustration.svg"
                alt="No requests illustration"
                text="Заявок пока нет, но можно кого-нибудь добавить самому."
              />) :
            <SimpleGrid
              cols={{ base: 1 }}
              spacing={{ base: 'md', md: 'xl' }}
              verticalSpacing={{ base: 'md', md: 'xl' }}
            >
              {myBooks.map((item) => <StorageMyCard {...item} key={item.itemId} />)}
            </SimpleGrid>
          }
        </Tabs.Panel>
      </Tabs>
    </PageWithWrapper>
  );
};
