import { Avatar, Flex, Button, ActionIcon, Anchor, Text, Card } from '@mantine/core';
import { ArrowUiAuthLogoutIcon24Regular } from '@skbkontur/icons/icons/ArrowUiAuthLogoutIcon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import styles from '~/components/queue/queue.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import { getGetItemsFriendsByBookQueryKey, getGetItemsMyByBookQueryKey } from '~/generated-api/items/items';
import { ItemModel } from '~/generated-api/model';
import { postQueueItemIdBecomeHolder, postQueueItemIdEnqueue, postQueueItemIdLeaveQueue } from '~/generated-api/queue/queue';
import { useGetUsersMe } from '~/generated-api/users/users';
import { getNounForm } from '~/helpers/helpers';
import { router } from '~/main';

interface QueueProps extends ItemModel {
  bookId: string;
}

export const Queue = ({ bookId, itemId, owner, holder, queue }: QueueProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync: enqueue } = useMutation({
    mutationFn: postQueueItemIdEnqueue,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetItemsFriendsByBookQueryKey({ bookId: bookId }) });
      await queryClient.invalidateQueries({ queryKey: getGetItemsMyByBookQueryKey({ bookId: bookId }) });
    },
  });

  const { mutateAsync: leaveQueue } = useMutation({
    mutationFn: postQueueItemIdLeaveQueue,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetItemsFriendsByBookQueryKey({ bookId: bookId }) });
      await queryClient.invalidateQueries({ queryKey: getGetItemsMyByBookQueryKey({ bookId: bookId }) });
    },
  });

  const { mutateAsync: becomeHolder } = useMutation({
    mutationFn: postQueueItemIdBecomeHolder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetItemsFriendsByBookQueryKey({ bookId: bookId }) });
      await queryClient.invalidateQueries({ queryKey: getGetItemsMyByBookQueryKey({ bookId: bookId }) });
    },
  });

  const { data: userData } = useGetUsersMe();

  const isUserInQueue: boolean = queue!.find((element) => element.id == userData?.id) !== undefined;
  const isUserFirst: boolean = queue!.at(0)?.id === userData?.id;
  const isUserHolder: boolean = userData?.username === holder?.username;

  const nextUserInQueue = isUserHolder ? queue?.at(0) : undefined;

  return (
    <Card className={`${styles.queue} ${isUserInQueue && styles.backgroundBlue} ${isUserHolder && styles.backgroundPink}`}>
      <Flex direction='column' gap='sm'>
        <Text span className={_styles.textGray}>Владелец</Text>
        <Flex gap='md'>
          <Avatar
            src={owner!.lowQualityPhotoUrl ?? '/default-profile.png'}
            radius="xl"
            size={41}
          />
          <Flex direction='column' gap='xs'>
            <Text span className={styles.name}>
              {owner!.firstName}
              {' '}
              {owner!.lastName}
            </Text>
            <Anchor onClick={() => router.navigate(AppRoute.User.replace(':username', owner!.username!))}>Перейти в профиль</Anchor>
          </Flex>
        </Flex>
      </Flex>

      {!isUserHolder ? 
        <Flex direction='column' gap='sm'>
          <Text span className={_styles.textGray}>Текущий держатель</Text>
          <Flex gap='md'>
            <Avatar
              src={holder.lowQualityPhotoUrl ?? '/default-profile.png'}
              radius="xl"
              size={41}
            />
            <Flex direction='column' gap='xs'>
              <Text span className={styles.name}>
                {holder.firstName}
                {' '}
                {holder.lastName}
              </Text>
              <Anchor href={holder.contactUrl ?? undefined}>Связаться</Anchor>
            </Flex>
          </Flex>
        </Flex>
        : (nextUserInQueue
          ? <Text>Книга у вас. За вами в очереди стоит человек. После прочтения книги, свяжитесь с ним и передайте ёё.</Text>
          : <Text className={_styles.textGray}>Книга у вас. За вами в очереди никого нету. Если никто не появится — отдайте книгу владельцу после прочтения.</Text>)}

      {!isUserHolder
        ? (!queue || queue.length == 0
          ? <Text className={_styles.textGray}>Пока что никого нет в очереди, но вы можете быть первым.</Text>
          : (
            <Flex gap={4} direction="column">
              <Text span className={_styles.textGray}>
                {queue.length}
                {' '}
                {getNounForm(queue.length, 'человек', 'человека', 'человек')}
                {' '}
                    в очереди
              </Text>
              <Avatar.Group>
                {queue.map((avatar, index) => (
                  <Avatar
                    key={index}
                    src={avatar.lowQualityPhotoUrl}
                    size={41}
                    radius="xl"
                  />
                ))}
              </Avatar.Group>
            </Flex>
          ))
        : (nextUserInQueue
          ? <Flex direction='column' gap='sm'>
            <Text span className={_styles.textGray}>Следующий в очереди</Text>
            <Flex gap='md'>
              <Avatar
                src={nextUserInQueue.lowQualityPhotoUrl ?? '/default-profile.png'}
                radius="xl"
                size={41}
              />
              <Flex direction='column' gap='xs'>
                <Text span className={styles.name}>
                  {'Пусто'}
                  {'Пусто'}
                  {'Пусто'}
                </Text>
                <Anchor href={'Пусто'}>Связаться</Anchor>
              </Flex>
            </Flex>
          </Flex>
          : <Flex direction='column' gap='sm'>
            <Text span className={_styles.textGray}>Текущий держатель</Text>
            <Text>Пока никого</Text>
          </Flex>)}

      {!isUserHolder && (!isUserInQueue
        ? <Button variant="white" fullWidth onClick={() => enqueue(itemId!)}>Встать в очередь</Button>
        : (
          <Flex gap='sm' className={styles.buttonWrapper}>
            <Button variant="white" fullWidth disabled={!isUserFirst} onClick={() => becomeHolder(itemId!)}>Книга у меня</Button>
            <ActionIcon variant="white" onClick={() => leaveQueue(itemId!)}><ArrowUiAuthLogoutIcon24Regular /></ActionIcon>
          </Flex>
        ))}
    </Card>
  );
};
