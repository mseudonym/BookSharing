import _styles from '../../index.module.css';
import styles from './profile-page.module.css';
import { useGetUsersMe } from '../../generated-api/users/users.ts';
import { Loading } from '../../components/loading/loading.tsx';
import { PageBackground } from '../../ui/page/page-background.tsx';
import { useGetBooksMyBooks } from '../../generated-api/books/books.ts';
import { BookCard } from '../../components/book-card/book-card.tsx';
import { Header } from '../../components/header/header.tsx';
import { ErrorPage } from '../error-page/error-page.tsx';
import { SettingsGearIcon24Regular } from '@skbkontur/icons/icons/SettingsGearIcon';
import { PlusIcon24Regular } from '@skbkontur/icons/icons/PlusIcon';
import { router } from '../../main.tsx';
import { ActionIcon } from '@mantine/core';

export const ProfilePage = () => {
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useGetUsersMe();
  const { data: bookList, isLoading: isLoadingBooks, isError: isErrorBooks } = useGetBooksMyBooks();

  if (isLoadingUser || isLoadingBooks) {
    return <Loading />;
  }

  if (isErrorUser || isErrorBooks || !user) {
    return <ErrorPage />;
  }

  return (
    <PageBackground>
      <Header variant="right" withPadding>
        <ActionIcon variant="transparent">
          <SettingsGearIcon24Regular />
        </ActionIcon>
      </Header>
      <div className={styles.userContent}>
        <img
          src={user.photoUrl || '/default-profile.png'}
          alt="Avatar"
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <h1 className={`${_styles.title} ${_styles.textCenter}`}>
            {user.firstName}
            {' '}
            {user.lastName}
          </h1>
          <p className={_styles.textGray}>
            @
            {user.username}
          </p>
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
        <button className={styles.addButton} onClick={() => router.navigate('/add-book')}><PlusIcon24Regular /></button>
        {bookList?.map((book) => <BookCard {...book} key={book.id} />)}
      </div>
    </PageBackground>
  );
};
