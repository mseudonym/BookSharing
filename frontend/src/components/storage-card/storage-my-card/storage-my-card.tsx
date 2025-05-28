import { Anchor, Card, Flex, Image, Text } from '@mantine/core';
import React from 'react';

import styles from '~/components/storage-card/storage-card.module.css';
import _styles from '~/index.module.css';

import { MyItemInfo } from '~/generated-api/model';

export const StorageMyCard = ({ book, currentHolderId, currentHolderContact }: MyItemInfo) => {

  return (
    <Card className={styles.storageCard}>
      <Image src={book?.bookCoverUrl} alt={`Book cover for ${book?.title}`} className={styles.bookCover} />
      <Flex direction="column" gap="sm"> 
        <Text>{book?.title}</Text>
        <Text className={_styles.textGray}>В данный момент книга находится у 
          <Anchor href={currentHolderContact ?? ''}>{currentHolderId}</Anchor>
        </Text>
      </Flex>
    </Card>
  );
};