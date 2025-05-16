import { ActionIcon, Avatar, Card, Flex, Text } from '@mantine/core';
import { CheckAIcon24Regular } from '@skbkontur/icons/icons/CheckAIcon/CheckAIcon24Regular';
import { XIcon24Regular } from '@skbkontur/icons/icons/XIcon/XIcon24Regular';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import styles from '~/components/friend-request/friend-request.module.css';
import _styles from '~/index.module.css';

import { getGetFriendsListQueryKey, getGetFriendsRequestsReceivedQueryKey, postFriendsRespondRequest } from '~/generated-api/friends/friends';
import { UserProfile } from '~/generated-api/model';


export const RequestCard = ({ id, lowQualityPhotoUrl, username, firstName, lastName }: UserProfile) => {
  const queryClient = useQueryClient();

  const { mutateAsync: sendAnswer } = useMutation({
    mutationFn: postFriendsRespondRequest,
    onSuccess: async (_, answer) => {
      await queryClient.invalidateQueries({ queryKey: getGetFriendsRequestsReceivedQueryKey() });
      if (answer?.isAccepted) {
        await queryClient.invalidateQueries({ queryKey: getGetFriendsListQueryKey() });
      }
    },
  });

  const onSubmit = async (isAccepted: boolean) => {
    sendAnswer({ isAccepted, personToRespondId: id });
  };

  return (
    <Card className={styles.friendCard}>
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
      <Flex>
        <ActionIcon variant="transparent" onClick={() => onSubmit(true)}>
          <CheckAIcon24Regular className={styles.checkButton} />
        </ActionIcon>
        <ActionIcon variant="transparent" onClick={() => onSubmit(false)}>
          <XIcon24Regular className={styles.crossButton} />
        </ActionIcon>
      </Flex>
    </Card>
  );
};
