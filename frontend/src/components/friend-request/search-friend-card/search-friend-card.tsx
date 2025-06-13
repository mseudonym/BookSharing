import { Card, Avatar, ActionIcon, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { CheckAIcon24Regular, People1PlusIcon24Regular, XIcon24Regular } from '@skbkontur/icons';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

import styles from '~/components/friend-request/friend-request.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import {
  postFriendsCancelRequest,
  postFriendsRespondRequest,
  postFriendsSendRequest
} from '~/generated-api/friends/friends';
import { FriendshipStatus, UserProfile } from '~/generated-api/model';
import { router } from '~/main';

export const SearchFriendCard = ({
  id,
  lowQualityPhotoUrl,
  username,
  firstName,
  lastName,
  friendshipStatus
}: UserProfile) => {
  const [localStatus, setLocalStatus] = useState<FriendshipStatus>(friendshipStatus ?? FriendshipStatus.None);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: sendRequest } = useMutation({
    mutationFn: postFriendsSendRequest,
    onSuccess: async () => {
      setLocalStatus(FriendshipStatus.OutcomeRequest);

      notifications.show({
        title: 'Запрос в друзья отправлен',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
  });

  const { mutateAsync: removeRequest } = useMutation({
    mutationFn: postFriendsCancelRequest,
    onSuccess: async () => {
      setLocalStatus(FriendshipStatus.None);

      notifications.show({
        title: 'Запрос в друзья отменен',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
  });

  const { mutateAsync: respondRequest } = useMutation({
    mutationFn: postFriendsRespondRequest,
    onSuccess: async ({ friendshipStatus }) => {
      setLocalStatus(friendshipStatus ?? FriendshipStatus.None);

      notifications.show({
        title: friendshipStatus == FriendshipStatus.Friend ? 'Заявка принята' : 'Заявка отклонена',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
  });

  const onSentRequest = async () => {
    setIsLoading(true);
    try {
      await sendRequest({ personToSendId: id });
    } finally {
      setIsLoading(false);
    }
  };

  const onRemoveRequest = async () => {
    setIsLoading(true);
    try {
      await removeRequest({ person: id });
    } finally {
      setIsLoading(false);
    }
  };

  const onRespondRequest = async () => {
    setIsLoading(true);
    try {
      await respondRequest({ personToRespondId: id, isAccepted: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.friendCard}>
      <div className={styles.person}
        onClick={() => router.navigate(AppRoute.User.replace(':username', username!))}>
        <Avatar
          src={lowQualityPhotoUrl || '/default-profile.png'}
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

      {localStatus == FriendshipStatus.OutcomeRequest && (
        <ActionIcon variant='transparent' onClick={onRemoveRequest} loading={isLoading}>
          <XIcon24Regular/>
        </ActionIcon>
      )}

      {localStatus == FriendshipStatus.IncomeRequest && (
        <ActionIcon variant='transparent' onClick={onRespondRequest} loading={isLoading}>
          <CheckAIcon24Regular/>
        </ActionIcon>
      )}

      {localStatus == FriendshipStatus.None && (
        <ActionIcon variant='transparent' onClick={onSentRequest} loading={isLoading}>
          <People1PlusIcon24Regular/>
        </ActionIcon>
      )}
    </Card>
  );
};