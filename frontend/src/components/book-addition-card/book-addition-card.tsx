import { ActionIcon, Card, Flex, Image, Text } from '@mantine/core';
import { PlusIcon24Regular } from '@skbkontur/icons/icons/PlusIcon';
import React from 'react';

import styles from '~/components/book-addition-card/book-addition-card.module.css';
import _styles from '~/index.module.css';

import { BookModel } from '~/generated-api/model';

export const BookAdditionCard = ({ title, bookCoverUrl, author }: BookModel) => {
  return (
    <Card className={styles.bookCard}>
      <Image src={bookCoverUrl} alt={`Book cover for ${title}`} className={styles.bookImage}/>
      <Flex justify="space-between">
        <Flex direction="column" gap="xs">
          <Text>{title}</Text>
          <Text className={_styles.textGray}>{author}</Text>
        </Flex>
        <ActionIcon variant="transparent">
          <PlusIcon24Regular/>
        </ActionIcon>
      </Flex>
    </Card>
  );
};