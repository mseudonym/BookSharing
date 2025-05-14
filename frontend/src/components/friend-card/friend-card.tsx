import React from 'react';
import { Link } from 'react-router-dom';

import styles from '~/components/friend-card/friend-card.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import { UserProfile } from '~/generated-api/model';

export const FriendCard = ({ lowQualityPhotoUrl, username, firstName, lastName }: UserProfile) => {
  return (
    <Link className={styles.friendCard} to={AppRoute.User.replace(':username', username!)}>
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
