import { PageWithNavbar } from '../../ui/page/page-with-navbar.tsx';
import './profile-page.css';
import { useGetUsersMe } from '../../generated-api/users/users.ts';

export const ProfilePage = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useGetUsersMe();

  if (isLoading) {
    return <div>Загрузка профиля...</div>;
  }

  if (isError) {
    return <div>Ошибка при загрузке данных: {String(error)}</div>;
  }

  if (!user) {
    return <div>Нет данных пользователя</div>;
  }

  return (
    <PageWithNavbar>
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={user.photoUrl || '/src/assets/default-profile.png'}
            alt="Avatar"
            className="avatar-image"
          />
        </div>
        <div className="profile-info">
          <p className="profile-name">{user.firstName}</p>
          <p className="profile-surname">{user.lastName}</p>
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
