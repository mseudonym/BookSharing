import _styles from '../../index.module.css';
import styles from '../profile-page/profile-page.module.css';
import { useGetUsersUsername } from '../../generated-api/users/users';
import { useParams } from 'react-router-dom';
import { Loading } from '../../components/loading/loading';
import { PageBackground } from '../../ui/page/page-background';
import { useGetBooksFriendBooks } from '../../generated-api/books/books';
import { BookCard } from '../../components/book-card/book-card';
import { Header } from '../../components/header/header';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { ErrorPage } from '../error-page/error-page';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { UiMenuDots3HIcon24Regular } from '@skbkontur/icons/icons/UiMenuDots3HIcon';

export const UserPage = () => {
  const { username } = useParams();
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useGetUsersUsername(username!);
  const { data: bookList, isLoading: isLoadingBooks, isError: isErrorBooks } = useGetBooksFriendBooks({ friendId: user?.id });

  if (isLoadingUser || isLoadingBooks) {
    return <Loading />;
  }

  if (isErrorUser || isErrorBooks || !user) {
    return <ErrorPage />;
  }

  return (
    <PageBackground>
      <Header variant="auto" withPadding>
        <ButtonIcon variant="flat" onClick={() => { window.history.back(); }}>
          <ArrowALeftIcon24Regular />
        </ButtonIcon>
        <ButtonIcon variant="flat">
          <UiMenuDots3HIcon24Regular />
        </ButtonIcon>
      </Header>
      <div className={styles.userContent}>
        <img
          src={user.highQualityPhotoUrl || '/default-profile.png'}
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
        {bookList == undefined || bookList.length == 0
          ? (
              <div className={_styles.illustrationWrapper}>
                <img
                  loading="lazy"
                  src="/profile-illustration.svg"
                  alt="ProfileEmpty illustration"
                />
                <p className={_styles.textCenter}>У твоего друга книг пока нет.</p>
              </div>
            )
          : bookList?.map((book) => <BookCard {...book} key={book.id} />)}
      </div>
    </PageBackground>
  );
};
