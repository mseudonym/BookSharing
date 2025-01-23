import _styles from '../../index.module.css';
import styles from '../profile-page/profile-page.module.css';
import { getGetUsersUserIdQueryKey, getUsersUserId } from '../../generated-api/users/users';
import { useParams } from 'react-router-dom';
import {
  postFriendsRespondRequest,
  postFriendsSendRequest,
} from '../../generated-api/friends/friends'; // ← импорт ваших функций
import { Loading } from '../../components/loading/loading';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../components/buttons/button';
import { PageBackground } from '../../ui/page/page-background';
import { useGetBooksFriendBooks } from '../../generated-api/books/books';
import { BookCard } from '../../components/book-card/book-card';
import { Header } from '../../components/header/header';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { ArrowALeftIcon24Regular, UiMenuDots3HIcon24Regular } from '@skbkontur/icons';

export const UserPage = () => {
  const { id } = useParams();
  const { data: user, isLoading, isError, error } = useQuery({
    queryFn: () => getUsersUserId(id!),
    queryKey: getGetUsersUserIdQueryKey(id!),
  });

  const { data: bookList } = useGetBooksFriendBooks({ friendId: id });

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return (
      <div>
        Ошибка при загрузке данных:
        {String(error)}
      </div>
    );
  }
  if (!user) {
    return <div>Нет данных пользователя</div>;
  }

  const handleButtonClick = async () => {
    try {
      if (user.friendshipStatus === 'None') {
        await postFriendsSendRequest({ personToSendId: id });
      }
      else if (user.friendshipStatus === 'IncomeRequest') {
        await postFriendsRespondRequest({
          personToRespondId: id,
          isAccepted: true,
        });
      }
      // Остальные статусы не требуют новых запросов
    }
    catch (e) {
      console.error('Ошибка при отправке запроса:', e);
    }
  };
  let buttonText = '';
  let isDisabled = false;

  switch (user.friendshipStatus) {
    case 'None':
      buttonText = 'Добавить в друзья';
      break;
    case 'IncomeRequest':
      buttonText = 'Принять заявку в друзья';
      break;
    case 'OutcomeRequest':
      buttonText = 'Заявка отправлена';
      isDisabled = true;
      break;
    case 'Friend':
      buttonText = '';
      break;
    default:
      buttonText = 'Добавить в друзья';
      break;
  }

  return (
    <PageBackground>
      <Header variant="autoPadding">
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
          {user.friendshipStatus !== 'Friend' && (
            <Button
              variant="fill"
              onClick={handleButtonClick}
              disabled={isDisabled}
            >
              {buttonText}
            </Button>
          )}
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
          : bookList?.map(book => <BookCard {...book} key={book.id} />)}
      </div>
    </PageBackground>
  );
};
