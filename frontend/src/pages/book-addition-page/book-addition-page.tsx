import { ActionIcon, Button, Flex, Input, Loader, SimpleGrid, Tabs, Text, Title, Transition } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { ArrowALeftIcon24Regular, ScanFrameBarcodeClassicIcon20Regular } from '@skbkontur/icons';
import React, { useEffect, useState } from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/book-addition-page/book-addition-page.module.css';

import { BookAdditionCard } from '~/components/book-addition-card';
import { IsbnInput } from '~/components/custom-mantine';
import { Header } from '~/components/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { AppRoute, BookAdditionTabs } from '~/conts';
import { useGetBooksByIsbnIsbn, useGetBooksByTitleTitle, useGetBooksMyBooks } from '~/generated-api/books/books';
import { router } from '~/main';
import { ErrorPage } from '~/pages/error-page';
import { PageWithWrapper } from '~/ui/pages';

export const BookAdditionPage = () => {
  const [isbnQuery, setIsbnQuery] = useState('');
  const [titleQuery, setTitleQuery] = useState('');
  const [debouncedTitle] = useDebouncedValue(titleQuery, 500);
  const {
    data: bookIsbn,
    isLoading: isLoadingIsbn
  } = useGetBooksByIsbnIsbn(isbnQuery, { query: { enabled: isbnQuery.length === 17 } });
  const {
    data: bookTitleList,
    isLoading: isLoadingTitleList
  } = useGetBooksByTitleTitle(debouncedTitle, { query: { enabled: debouncedTitle.length > 2 } });
  const { data: myBooks, isLoading: isLoadingMyBooks, isError: isErrorMyBooks } = useGetBooksMyBooks();
  const myBooksSet: Set<string | undefined> = new Set(myBooks?.map((item) => item.id));
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(!!(isbnQuery || titleQuery));
  }, [isbnQuery, titleQuery]);

  if (isErrorMyBooks) {
    return <ErrorPage/>;
  }

  return (
    <PageWithWrapper>
      <Header variant='left'>
        <ActionIcon variant='transparent' onClick={() => {
          window.history.back();
        }}>
          <ArrowALeftIcon24Regular/>
        </ActionIcon>
        <Title order={5}>Добавление книги</Title>
      </Header>

      <Tabs defaultValue={BookAdditionTabs.Isbn}>
        <Tabs.List>
          <Tabs.Tab value={BookAdditionTabs.Isbn}>{BookAdditionTabs.Isbn}</Tabs.Tab>
          <Tabs.Tab value={BookAdditionTabs.Title}>{BookAdditionTabs.Title}</Tabs.Tab>
        </Tabs.List>

        {(isLoadingIsbn || isLoadingTitleList || isLoadingMyBooks) && <Loader/>}

        <Tabs.Panel value={BookAdditionTabs.Isbn}>
          <IsbnInput
            value={isbnQuery}
            placeholder='Введите ISBN книги'
            onChange={(e) => setIsbnQuery(e.target.value)}
            rightSection={
              <ActionIcon variant='transparent' onClick={() => router.navigate(AppRoute.ScanningCode)}>
                <ScanFrameBarcodeClassicIcon20Regular/>
              </ActionIcon>}
          />
          {!isLoadingIsbn && (!bookIsbn
            ? <IllustrationWrapper
                src='/search-illustration.svg'
                alt='No books illustration'
                text='Тут пусто. Введите ISBN полностью или добавьте книгу вручную.'
            />
            : <BookAdditionCard {...bookIsbn} isUserAlreadyHaveBook={myBooksSet.has(bookIsbn.id)}/>
          )}
        </Tabs.Panel>

        <Tabs.Panel value={BookAdditionTabs.Title}>
          <Input placeholder='Введите название книги' onChange={(e) => setTitleQuery(e.target.value)}/>
          <SimpleGrid
            cols={{ base: 1 }}
            spacing={{ base: 'md', md: 'xl' }}
            verticalSpacing={{ base: 'md' }}
          >
            {!isLoadingTitleList && ((!bookTitleList || bookTitleList.length == 0)
              ? <IllustrationWrapper
                  src='/search-illustration.svg'
                  alt='No books illustration'
                  text='Тут пусто. Начните вводить название или добавьте книгу вручную.'
                />
              : bookTitleList?.map((item) => (<BookAdditionCard key={item.id} {...item}
                  isUserAlreadyHaveBook={myBooksSet.has(item.id)}/>
              )))}
          </SimpleGrid>
        </Tabs.Panel>

        <Transition mounted={opened} transition='fade-up' enterDelay={200} exitDelay={200}>
          {(transitionStyle) => (
            <Flex direction='column' gap='sm' align='center' className={styles.buttonWithDescription} style={{
              ...transitionStyle,
              zIndex: 1
            }}>
              <Text className={_styles.textGray}>Не нашли что искали?</Text>
              <Button
                onClick={() => router.navigate(AppRoute.AddBookManually)}
                variant='outline'>Добавить книгу вручную</Button>
            </Flex>
          )}
        </Transition>
      </Tabs>
    </PageWithWrapper>
  );
};
