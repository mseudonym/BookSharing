import _styles from '../../index.module.css';
import styles from './friend-card.module.css';
import { UserProfile } from '../../generated-api/model';
import { Link } from 'react-router-dom';

export const FriendCard = ({ id, lowQualityPhotoUrl, username, firstName, lastName }: UserProfile) => {
  return (
    <Link className={styles.friendCard} to={`/users/${id}`}>
      <img
        loading="lazy"
        src={lowQualityPhotoUrl ?? '/default-profile.png'}
        className={styles.avatar}
        alt={`Avatar image for ${username}`}
      />
      <div className={styles.userInfo}>
        <p>
          {firstName}
          {' '}
          {lastName}
        </p>
        <p className={_styles.textGray}>
          @
          {username}
        </p>
      </div>
    </Link>
  );
};
