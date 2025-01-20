import { PageWithNavbar } from '../../ui/page/page-with-navbar';
import { useGetUsersUserId } from '../../generated-api/users/users';
import { useParams } from 'react-router-dom';
import {
  postFriendsRespondRequest,
  postFriendsSendRequest,
} from '../../generated-api/friends/friends'; // ← импорт ваших функций
import './user-page.css';


export const UserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading, isError, error } = useGetUsersUserId(userId!);

  if (isLoading) {
    return <div>Загрузка профиля...</div>;
  }
  if (isError) {
    return <div>Ошибка при загрузке данных: {String(error)}</div>;
  }
  if (!user) {
    return <div>Нет данных пользователя</div>;
  }

  const handleButtonClick = async () => {
    try {
      if (user.friendshipStatus === 'None') {
        await postFriendsSendRequest({personToSendId: userId});
      } else if (user.friendshipStatus === 'IncomeRequest') {
        await postFriendsRespondRequest({
          personToRespondId: userId,
          isAccepted: true,
        });
      }
      // Остальные статусы не требуют новых запросов
    } catch (e) {
      console.error('Ошибка при отправке запроса:', e);
    }
  }
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
    <PageWithNavbar>
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={user.highQualityPhotoUrl || '/src/assets/default-profile.png'}
            alt="Avatar"
            className="avatar-image"
          />
        </div>

        <div className="profile-info">
          <p className="profile-name">{user.firstName}</p>
          <p className="profile-surname">{user.lastName}</p>

          {user.friendshipStatus !== 'Friend' && (
            <button
              className={`profile-add-friend-button ${
                isDisabled ? 'profile-add-friend-button-disabled' : ''
              }`}
              onClick={handleButtonClick}
              disabled={isDisabled}
            >
              {buttonText}
            </button>
          )}

          <p className="profile-username">@{user.username}</p>
          {user.contactUrl && (
            <p className="profile-contact">
              <a
                href={user.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Связаться
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="content-space"></div>
    </PageWithNavbar>
  );
};
