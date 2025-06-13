import { Card, Image, Text } from '@mantine/core';
import React from 'react';

import styles from '~/components/book-card/book-card.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import { BookModel } from '~/generated-api/model';
import { router } from '~/main';

export const BookCard = ({ id, title, bookCoverUrl, author }: BookModel) => {
  return (
    <Card className={styles.bookCard} onClick={() => router.navigate(AppRoute.Book.replace(':id', id!))}>
      <Image
        loading='lazy'
        src={bookCoverUrl ?? '/default-book-cover.png'}
        className={styles.bookCover}
        alt={`Book cover for ${title}`}
      />
      <div>
        <Text lineClamp={3}>{title}</Text>
        <Text lineClamp={3} className={_styles.textGray}>{author}</Text>
      </div>
    </Card>
  );
};
