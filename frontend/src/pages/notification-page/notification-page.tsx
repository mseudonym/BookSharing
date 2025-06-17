import { Drawer, Flex, Loader } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

import { NotificationCard } from '~/components/notification-card';
import {
  getGetNotificationsQueryKey,
  postNotificationsMarkAsRead,
  useGetNotifications
} from '~/generated-api/notifications/notifications';
import { ErrorPage } from '~/pages/error-page';
import { queryClient } from '~/services/query-client';

interface NotificationPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPage = ({ isOpen, onClose }: NotificationPageProps) => {
  const { data, isLoading, isError } = useGetNotifications();
  const notificationIds = data?.map((notification) => notification.id!) ?? [];

  const { mutateAsync: readNotifications } = useMutation({
    mutationFn: postNotificationsMarkAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey() });
    },
  });

  if (isError) {
    return <ErrorPage/>;
  }

  const onCloseAndRead = async () => {
    onClose();
    await readNotifications(notificationIds);
  };

  return (
    <Drawer
      opened={isOpen}
      onClose={onCloseAndRead}
      title='Уведомления'
      position='left'
      size='md'
      style={{ overflowX: 'hidden' }}
    >
      {isLoading && <Loader/>}
      {!isLoading && data && (
        <Flex direction='column' gap={8}>
          {data.map((notification) => <NotificationCard key={notification.id}
            notification={notification}/>)}
        </Flex>
      )}
    </Drawer>
  );
};