import _styles from '../../index.module.css';
import styles from './profile-page.module.css';
import { useGetUsersMe } from '../../generated-api/users/users.ts';
import { Loading } from '../../components/loading/loading.tsx';
import { Navbar } from '../../components/navbar/navbar.tsx';
import { PageBackground } from '../../ui/page/page-background.tsx';
import { useGetBooksMyBooks } from '../../generated-api/books/books.ts';
import { BookCard } from '../../components/book-card/book-card.tsx';
import { PlusIcon24Regular } from '@skbkontur/icons';
import { useNavigate } from 'react-router';

export const ProfilePage = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useGetUsersMe();

  const { data: bookList } = useGetBooksMyBooks();

  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Ошибка при загрузке данных: {String(error)}</div>;
  }

  if (!user) {
    return <div>Нет данных пользователя</div>;
  }

  return (
    <PageBackground>
      <div className={styles.userContent}>
        <img
          src={user.photoUrl || '/src/assets/default-profile.png'}
          alt="Avatar"
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <h1 className={`${_styles.title} ${_styles.textCenter}`}>{user.firstName} {user.lastName}</h1>
          <p className={_styles.textGray}>@{user.username}</p>
        </div>
        {user.contactUrl && (
          <a
            href={user.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={_styles.link}
          >
            Связаться
          </a>
        )}
      </div>
      <div className={styles.bookList}>
        <button className={styles.addButton} onClick={() => navigate('/add-book')}><PlusIcon24Regular /></button>
        {bookList?.map((book) => <BookCard {...book} key={book.id} />)}
      </div>
      <Navbar />
    </PageBackground>
  );
};
