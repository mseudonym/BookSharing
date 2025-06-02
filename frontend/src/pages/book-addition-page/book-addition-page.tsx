import { Title, Tabs, SimpleGrid, ActionIcon, Input, Loader, TextInput, Flex, Text, Button } from '@mantine/core';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons';
import React, { useState, useCallback } from 'react';
import { z as zod } from 'zod';

import _styles from '~/index.module.css';
import styles from '~/pages/book-addition-page/book-addition-page.module.css';

import { BookAdditionCard } from '~/components/book-addition-card';
import { Header } from '~/components/header';
import { AppRoute, BookAdditionTabs } from '~/conts';
import {  useGetBooksByIsbnIsbn } from '~/generated-api/books/books';
import { router } from '~/main';
import { PageWithWrapper } from '~/ui/pages';

const isbnSchema = zod.string()
  .regex(/^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1}$/, 'Неверный формат ISBN');

export const BookAdditionPage = () => {
  const [isbnValue, setIsbnValue] = useState('');
  //const [debouncedIsbn] = useDebouncedValue(isbnValue, 10500);
  const [searchIsbnQuery, setSearchIsbnQuery] = useState('');
  const [isbnError, setIsbnError] = useState('');
  const { data: bookIsbn, isLoading: isLoadingIsbn, isError: isErrorIsbn } = useGetBooksByIsbnIsbn(searchIsbnQuery, { query: { retry: false } });

  const validateIsbn  = useCallback((value: string) => {
    setIsbnValue(value);

    try {
      const validatedValue = isbnSchema.parse(value);
      setSearchIsbnQuery(validatedValue);
      setIsbnError('');
    }
    catch (error) {
      if (error instanceof zod.ZodError) {
        setIsbnError(error.errors[0].message);
      }
      else {
        setIsbnError('Произошла ошибка при валидации ISBN');
      }
      setSearchIsbnQuery('');
    }
  }, []);

  return (
    <PageWithWrapper>
      <Header variant="left">
        <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ActionIcon>
        <Title order={5}>Добавление книги</Title>
      </Header>

      <Tabs defaultValue={BookAdditionTabs.Isbn}>
        <Tabs.List>
          <Tabs.Tab value={BookAdditionTabs.Isbn}>{BookAdditionTabs.Isbn}</Tabs.Tab>
          <Tabs.Tab value={BookAdditionTabs.Title}>{BookAdditionTabs.Title}</Tabs.Tab>
        </Tabs.List>

        {isLoadingIsbn && <Loader />}

        <Tabs.Panel value={BookAdditionTabs.Isbn}>
          <TextInput placeholder="Введите ISBN книги" 
            value={isbnValue}
            onChange={(e) => validateIsbn(e.target.value)}
            error={isbnError}/>
          {!isErrorIsbn && bookIsbn && <BookAdditionCard {...bookIsbn} />}
          {searchIsbnQuery && <Flex direction="column" gap="sm" align="center" className={styles.buttonWithDescription}>
            <Text className={_styles.textGray}>Не нашли что искали?</Text>
            <Button 
              onClick={() => router.navigate(AppRoute.AddBookManually)} 
              variant="outline">Добавить книгу вручную</Button>
          </Flex>}
        </Tabs.Panel>

        <Tabs.Panel value={BookAdditionTabs.Title}>
          <Input placeholder="Введите название книги" />
          <SimpleGrid
            cols={{ base: 1 }}
            spacing={{ base: 'md', md: 'xl' }}
            verticalSpacing={{ base: 'md', md: 'xl' }}
          >
                        fgdfg
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
    </PageWithWrapper>
  );
};
