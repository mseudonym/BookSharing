import React from 'react';
import { Link } from 'react-router-dom';

import styles from '~/components/book-card/book-card.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import { BookModel } from '~/generated-api/model';

export const BookCard = ({ id, title, bookCoverUrl, author }: BookModel) => {
  return (
    <Link className={styles.bookCard} to={AppRoute.Book.replace(':id', id!)}>
      <img
        loading="lazy"
        src={bookCoverUrl ?? '/default-book-cover.png'}
        className={styles.bookCover}
        alt={`Book cover for ${title}`}
      />
      <div className={styles.bookInfo}>
        <p className={styles.bookText}>{title}</p>
        <p className={`${styles.bookText} ${_styles.textGray}`}>{author}</p>
      </div>
    </Link>
  );
};
