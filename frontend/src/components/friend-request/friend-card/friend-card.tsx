import { Avatar, Card, Flex, Text } from '@mantine/core';
import React from 'react';

import styles from '~/components/friend-request/friend-request.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import { UserProfile } from '~/generated-api/model';
import { router } from '~/main';

export const FriendCard = ({ lowQualityPhotoUrl, username, firstName, lastName }: UserProfile) => {
  return (
    <Card className={styles.friendCard} onClick={() => router.navigate(AppRoute.User.replace(':username', username!))}>
      <Avatar
        src={lowQualityPhotoUrl ?? '/default-profile.png'}
        className={styles.avatar}
        alt={`Avatar image for ${username}`}
      />
      <Flex direction='column' gap='xs'>
        <Text>
          {firstName}
          {' '}
          {lastName}
        </Text>
        <Text span className={_styles.textGray}>
          @
          {username}
        </Text>
      </Flex>
    </Card>
  );
};
