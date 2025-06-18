import { ActionIcon, Button, Flex } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { CheckAIcon24Regular } from '@skbkontur/icons/icons/CheckAIcon/CheckAIcon24Regular';
import { XIcon24Regular } from '@skbkontur/icons/icons/XIcon/XIcon24Regular';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

import styles from '~/components/friend-request-actions/friend-request-actions.module.css';

import {
  getGetFriendsListQueryKey,
  getGetFriendsRequestsReceivedQueryKey,
  postFriendsRespondRequest
} from '~/generated-api/friends/friends';
import { getGetNotificationsQueryKey } from '~/generated-api/notifications/notifications';
import { getGetUsersUsernameQueryKey } from '~/generated-api/users/users';
import { queryClient } from '~/services/query-client';

interface FriendRequestActionsProps {
  id: string | undefined;
  isBigSize?: boolean;
  username?: string | undefined;
}

export const FriendRequestActions = ({ id, isBigSize = false, username }: FriendRequestActionsProps) => {
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const { width } = useViewportSize();
  const isRenderedOnDesktop = width >= 768;

  const { mutateAsync: sendAnswer } = useMutation({
    mutationFn: postFriendsRespondRequest,
    onSuccess: async (_, answer) => {
      await queryClient.invalidateQueries({ queryKey: getGetFriendsRequestsReceivedQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey() });

      if (username){
        await queryClient.invalidateQueries({ queryKey: getGetUsersUsernameQueryKey(username!) });
      }

      if (answer?.isAccepted) {
        await queryClient.invalidateQueries({ queryKey: getGetFriendsListQueryKey() });
      }

      notifications.show({
        title: answer?.isAccepted ? 'Запрос в друзья принят' : 'Запрос в друзья отклонен',
        message: undefined,
        color: answer?.isAccepted ? 'var(--green-color)' : 'var(--red-color)',
      });
    },
  });

  const onSubmit = async (isAccepted: boolean) => {
    await sendAnswer({ isAccepted, personToRespondId: id });
  };

  const onAccept = async () => {
    setIsLoadingAccept(true);
    await onSubmit(true);
    setIsLoadingAccept(false);
  };

  const onReject = async () => {
    setIsLoadingReject(true);
    await onSubmit(false);
    setIsLoadingReject(false);
  };

  return (
    <Flex gap={isBigSize ? 'sm' : 'xs'} className={isBigSize && !isRenderedOnDesktop ? styles.root : ''}>
      {isBigSize
        ? <Button fullWidth={!isRenderedOnDesktop} variant={isRenderedOnDesktop ? 'outline' : 'white'}
          leftSection={<CheckAIcon24Regular color='var(--green-color)'/>}
          onClick={onAccept}>
          Принять заявку
        </Button>
        : <ActionIcon loading={isLoadingAccept}
            variant={isBigSize && isRenderedOnDesktop ? 'outline' : 'white'}
            onClick={onAccept}>
          <CheckAIcon24Regular className={styles.checkButton}/>
        </ActionIcon>}
      <ActionIcon loading={isLoadingReject} variant={isBigSize && isRenderedOnDesktop ? 'outline' : 'white'} onClick={onReject}>
        <XIcon24Regular className={styles.crossButton}/>
      </ActionIcon>
    </Flex>
  );
};