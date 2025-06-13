import { ActionIcon, Avatar, Card, Flex, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { CheckAIcon24Regular } from '@skbkontur/icons/icons/CheckAIcon/CheckAIcon24Regular';
import { XIcon24Regular } from '@skbkontur/icons/icons/XIcon/XIcon24Regular';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import styles from '~/components/friend-request/friend-request.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import {
  getGetFriendsListQueryKey,
  getGetFriendsRequestsReceivedQueryKey,
  postFriendsRespondRequest
} from '~/generated-api/friends/friends';
import { UserProfile } from '~/generated-api/model';
import { router } from '~/main';

export const RequestCard = ({ id, lowQualityPhotoUrl, username, firstName, lastName }: UserProfile) => {
  const queryClient = useQueryClient();
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  const { mutateAsync: sendAnswer } = useMutation({
    mutationFn: postFriendsRespondRequest,
    onSuccess: async (_, answer) => {
      await queryClient.invalidateQueries({ queryKey: getGetFriendsRequestsReceivedQueryKey() });
      if (answer?.isAccepted) {
        await queryClient.invalidateQueries({ queryKey: getGetFriendsListQueryKey() });
      }

      notifications.show({
        title: answer?.isAccepted ? 'Запрос в друзья принят' : 'Запрос в друзья отклонен',
        message: undefined,
        color: 'var(--red-color)',
      });
    },
  });

  const onSubmit = async (isAccepted: boolean) => {
    sendAnswer({ isAccepted, personToRespondId: id });
  };

  const onAccept = async () => {
    setIsLoadingAccept(true);
    onSubmit(true);
    setIsLoadingAccept(false);
  };

  const onReject = async () => {
    setIsLoadingReject(true);
    onSubmit(false);
    setIsLoadingReject(false);
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
      <Flex>
        <ActionIcon loading={isLoadingAccept} variant='transparent' onClick={onAccept}>
          <CheckAIcon24Regular className={styles.checkButton}/>
        </ActionIcon>
        <ActionIcon loading={isLoadingReject} variant='transparent' onClick={onReject}>
          <XIcon24Regular className={styles.crossButton}/>
        </ActionIcon>
      </Flex>
    </Card>
  );
};
