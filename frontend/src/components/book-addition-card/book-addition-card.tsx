import { ActionIcon, Button, Card, Flex, Image, Modal, SimpleGrid, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { XIcon24Regular } from '@skbkontur/icons';
import { PlusIcon24Regular } from '@skbkontur/icons/icons/PlusIcon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import styles from '~/components/book-addition-card/book-addition-card.module.css';
import _styles from '~/index.module.css';

import { getGetBooksMyBooksQueryKey } from '~/generated-api/books/books';
import { deleteItemsRemoveFromMyShelf, postItemsAddToMyShelf } from '~/generated-api/items/items';
import { BookModel } from '~/generated-api/model';

interface BookAdditionCardProps extends BookModel {
    isUserAlreadyHaveBook: boolean;
}

export const BookAdditionCard = ({ isUserAlreadyHaveBook, title, bookCoverUrl, author, id }: BookAdditionCardProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const { mutateAsync: addBookToShelf } = useMutation({
    mutationFn: postItemsAddToMyShelf,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: getGetBooksMyBooksQueryKey() });
      notifications.show({
        title: 'Книга добавлена на полку',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка при добавлении книги',
        message: undefined,
        color: 'var(--red-color)',
      });
    },
  });

  const { mutateAsync: deleteBook } = useMutation({
    mutationFn: deleteItemsRemoveFromMyShelf,
    onSuccess: async () => {
      notifications.show({
        title: 'Книга успешно удалена',
        message: undefined,
        color: 'var(--green-color)',
      });
      close();
    },
  });

  const onAddBook = () => {
    setIsLoading(true);
    addBookToShelf({ bookId: id });
    setIsLoading(false);
  };

  const onDeleteBook = () => {
    setIsLoading(true);
    deleteBook({ bookId: id });
    setIsLoading(false);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title='Удалить книгу с полки?' centered>
        <Text className={_styles.textGray}>Это также удалит все очереди за ней.</Text>
        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing={{ base: 'md' }}
          verticalSpacing={{ base: 'md' }}
          style={{ width: '100%' }}
        >
          <Button variant='filled' onClick={onDeleteBook}>
            Да, удалить
          </Button>
          <Button color='outline' onClick={close}>
            Нет, оставить
          </Button>
        </SimpleGrid>
      </Modal>
      <Card className={styles.bookCard}>
        <Image src={bookCoverUrl} alt={`Book cover for ${title}`} className={styles.bookImage}/>
        <Flex style={{ width: '100%' }}>
          <Flex direction='column' gap='xs' style={{ width: '100%' }}>
            <Text>{title}</Text>
            <Text className={_styles.textGray}>{author}</Text>
          </Flex>
          {!isUserAlreadyHaveBook
            ? <ActionIcon variant='transparent' onClick={onAddBook} loading={isLoading}>
              <PlusIcon24Regular/>
            </ActionIcon>
            : <ActionIcon variant='transparent' onClick={open} loading={isLoading}>
              <XIcon24Regular/>
            </ActionIcon>}
        </Flex>
      </Card>
    </>
  );
};