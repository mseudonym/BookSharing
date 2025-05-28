import { Card, Flex, Image, Text } from '@mantine/core';
import React from 'react';

import styles from '~/components/storage-card/storage-card.module.css';
import _styles from '~/index.module.css';

import { FriendItemInfo } from '~/generated-api/model';

export const StorageFriendCard = ({ book }: FriendItemInfo) => {
  return (
    <Card className={styles.storageCard}>
      <Image src={book?.bookCoverUrl} alt={`Book cover for ${book?.title}`} className={styles.bookCover} />
      <Flex direction="column" gap="sm"> 
        <Text>{book?.title}</Text>
        <Text className={_styles.textGray}>Книга у вас 12 дней. После прочтения свяжитесь с @KPULU и передайте ему книгу. </Text>
      </Flex>
    </Card>
  );
};