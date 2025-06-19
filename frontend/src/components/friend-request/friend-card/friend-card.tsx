import { Avatar, Card, Text } from '@mantine/core';
import React from 'react';

import styles from '~/components/friend-request/friend-request.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import { UserProfile } from '~/generated-api/model';
import { router } from '~/main';

export const FriendCard = ({ highQualityPhotoUrl, username, firstName, lastName }: UserProfile) => {
  return (
    <Card className={styles.friendCard}>
      <div className={styles.person}
        onClick={() => router.navigate(AppRoute.User.replace(':username', username!))}>
        <Avatar
          src={highQualityPhotoUrl || '/default-profile.png'}
          className={styles.avatar}
          alt={`Avatar image for ${username}`}
        />
        <div className={styles.personInfo}>
          <Text>
            {firstName}
            {' '}
            {lastName}
          </Text>
          <Text span className={_styles.textGray}>
            @
            {username}
          </Text>
        </div>
      </div>
    </Card>
  );
};
