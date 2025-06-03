import { ActionIcon, Card, Flex, Image, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { XIcon24Regular } from '@skbkontur/icons';
import { PlusIcon24Regular } from '@skbkontur/icons/icons/PlusIcon';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

import styles from '~/components/book-addition-card/book-addition-card.module.css';
import _styles from '~/index.module.css';

import { postItemsAddToMyShelf } from '~/generated-api/items/items';
import { BookModel } from '~/generated-api/model';

interface BookAdditionCardProps extends BookModel {
  isUserAlreadyHaveBook: boolean;
}

export const BookAdditionCard = ({ isUserAlreadyHaveBook, title, bookCoverUrl, author, id }: BookAdditionCardProps) => {
  const { mutateAsync: addBookToShelf } = useMutation({
    mutationFn: postItemsAddToMyShelf,
    onSuccess: async () => {
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

  const onAddBook = () => {
    addBookToShelf({ bookId: id });
  };

  return (
    <Card className={styles.bookCard}>
      <Image src={bookCoverUrl} alt={`Book cover for ${title}`} className={styles.bookImage}/>
      <Flex style={{ width: '100%' }}>
        <Flex direction="column" gap="xs" style={{ width: '100%' }}>
          <Text>{title}</Text>
          <Text className={_styles.textGray}>{author}</Text>
        </Flex>
        {!isUserAlreadyHaveBook
          ? <ActionIcon variant="transparent" onClick={onAddBook}>
            <PlusIcon24Regular/>
          </ActionIcon>
          : <ActionIcon variant="transparent">
            <XIcon24Regular/>
          </ActionIcon>}
      </Flex>
    </Card>
  );
};