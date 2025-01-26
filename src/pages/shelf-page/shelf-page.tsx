import _styles from '../../index.module.css';
import styles from './shelf-page.module.css';
import { BookCard } from '../../components/book-card/book-card';
import { Header } from '../../components/header/header';
import { useGetBooksAllFriendsBooks } from '../../generated-api/books/books';
import { PageWithNavbar } from '../../ui/page/page-with-navbar';
import { Loading } from '../../components/loading/loading';
import { ErrorPage } from '../error-page/error-page';

export const ShelfPage = () => {
  const { data: bookList, isLoading, isError } = useGetBooksAllFriendsBooks();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <PageWithNavbar>
      <Header variant="left">
        <h1 className={_styles.title}>Полка друзей</h1>
      </Header>
      <section className={styles.bookList}>
        {bookList == undefined || bookList.length == 0
          ? (
              <div className={_styles.illustrationWrapper}>
                <img
                  loading="lazy"
                  src="/shelf-illustration.svg"
                  alt="ShelfEmpty illustration"
                />
                <p className={_styles.textCenter}>Добавьте друзей, чтобы увидеть книги, которые они выложили.</p>
              </div>
            )
          : bookList.map((book) => <BookCard {...book} key={book.id} />)}
      </section>
    </PageWithNavbar>
  );
};
