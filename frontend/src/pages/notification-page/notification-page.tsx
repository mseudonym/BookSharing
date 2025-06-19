import { Drawer, Flex, ScrollArea } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';

import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { NotificationCard } from '~/components/notification-card';
import { NotificationBase } from '~/generated-api/model';
import {
  getGetNotificationsQueryKey,
  postNotificationsMarkAsRead,
  useGetNotifications,
} from '~/generated-api/notifications/notifications';
import { ErrorPage } from '~/pages/error-page';
import { queryClient } from '~/services/query-client';

interface NotificationPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPage = ({ isOpen, onClose }: NotificationPageProps) => {
  const [page, setPage] = useState(0);
  const [allNotifications, setAllNotifications] = useState<NotificationBase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data, isFetching, isError } = useGetNotifications({ page });
  const notificationIds = allNotifications?.map((notification) => notification.id) ?? [];

  const { mutateAsync: readNotifications } = useMutation({
    mutationFn: postNotificationsMarkAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey() });
    },
  });

  const onCloseAndRead = async () => {
    onClose();
    await readNotifications(notificationIds);
    setPage(0);
    setAllNotifications([]);
  };

  const handleScrollPositionChange = useCallback(() => {
    if (isLoading) {
      return;
    }

    const scrollArea = document.querySelector('.mantine-ScrollArea-viewport');
    if (!scrollArea) return;

    const { scrollHeight, clientHeight, scrollTop } = scrollArea;
    const threshold = 100;

    if (scrollHeight - (clientHeight + scrollTop) <= threshold) {
      setIsLoading(true);
      setPage((prev) => prev + 1);
    }},
  [isLoading]
  );

  useEffect(() => {
    if (data && !isFetching) {
      setAllNotifications((prev) => [...prev, ...data]);
      setIsLoading(false);
    }
  }, [data, isFetching]);

  if (!isFetching && isError) {
    return <ErrorPage/>;
  }

  return (
    <Drawer
      opened={isOpen}
      onClose={onCloseAndRead}
      title='Уведомления'
      position='left'
      size='lg'
    >
      <ScrollArea
        style={{
          height: 'calc(100vh - 80px)',
        }}
        onScrollPositionChange={handleScrollPositionChange}
        scrollbarSize={8}
      >
        {!isFetching && allNotifications.length === 0
          ? <IllustrationWrapper
              src='/notifications-illustration.svg'
              alt='No notifications illustration'
              text='Уведомлений пока нет.'
          />
          : <Flex direction='column' gap='sm'>
            {allNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </Flex>
        }
      </ScrollArea>
    </Drawer>
  );
};