import _styles from '../../index.module.css'
import styles from './shelf-page.module.css';
import { FC } from 'react';
import { Page } from '../../ui/page/page';
import { BookCard } from '../../components/book-card/book-card';
import { Header } from '../../components/header/header';
import { useQuery } from '@tanstack/react-query';
import { getBooksAllFriendsBooks, getGetBooksAllFriendsBooksQueryKey } from '../../generated-api/books/books';

export const ShelfPage: FC = () => {
  const { data: bookList } = useQuery({
    queryFn: () => getBooksAllFriendsBooks(),
    queryKey: getGetBooksAllFriendsBooksQueryKey(),
  })

  return (
    <Page>
      <Header variant='left'>
        <h1 className={_styles.title}>Полка друзей</h1>
      </Header>
      <section className={styles.bookList}>
        {bookList?.map((book) => <BookCard {...book} />)}
      </section>
    </Page>
  );
}