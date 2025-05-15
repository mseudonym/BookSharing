import { Avatar, Flex, Button, ActionIcon, Anchor } from '@mantine/core';
import { ArrowUiAuthLogoutIcon24Regular } from '@skbkontur/icons/icons/ArrowUiAuthLogoutIcon';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import styles from '~/components/queue/queue.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import { getGetItemsByBookIdQueryKey } from '~/generated-api/items/items';
import { QueueModel } from '~/generated-api/model';
import { postQueueItemIdBecomeHolder, postQueueItemIdEnqueue, postQueueItemIdLeaveQueue } from '~/generated-api/queue/queue';
import { getGetUsersMeQueryKey, getUsersMe } from '~/generated-api/users/users';
import { getNounForm } from '~/helpers/helpers';
import { router } from '~/main';

interface QueueProps extends QueueModel {
  bookId: string;
}

export const Queue = ({ bookId, itemId, owner, holder, queue }: QueueProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync: enqueue } = useMutation({
    mutationFn: postQueueItemIdEnqueue,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetItemsByBookIdQueryKey({ bookId: bookId }) });
    },
  });

  const { mutateAsync: leaveQueue } = useMutation({
    mutationFn: postQueueItemIdLeaveQueue,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetItemsByBookIdQueryKey({ bookId: bookId }) });
    },
  });

  const { mutateAsync: becomeHolder } = useMutation({
    mutationFn: postQueueItemIdBecomeHolder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getGetItemsByBookIdQueryKey({ bookId: bookId }) });
    },
  });

  const { data: userData } = useQuery({
    queryFn: () => getUsersMe(),
    queryKey: getGetUsersMeQueryKey(),
  });

  if (queue == undefined || owner == undefined) {
    return <p>Нет очередей</p>;
  }

  const isUserInQueue: boolean = queue.find((element) => element.id == userData?.id) !== undefined;
  const isUserFirst: boolean = queue.at(0)?.id === userData?.id;
  const isUserHolder: boolean = userData?.username === holder?.username;

  return (
    <article className={`${styles.queue} ${isUserInQueue && styles.backgroundBlue} ${isUserHolder && styles.backgroundPink}`}>
      <div className={styles.personWrapper}>
        <span className={_styles.textGray}>Владелец</span>
        <div className={styles.person}>
          <Avatar
            src={owner.lowQualityPhotoUrl ?? '/default-profile.png'}
            radius="xl"
            size={41}
          />
          <div className={styles.personInfo}>
            <span className={styles.name}>
              {owner.firstName}
              {' '}
              {owner.lastName}
            </span>
            <Anchor onClick={() => router.navigate(AppRoute.User.replace(':username', owner.username!))}>Перейти в профиль</Anchor>
          </div>
        </div>
      </div>

      <div className={styles.personWrapper}>
        <span className={_styles.textGray}>Текущий держатель</span>
        {holder == undefined
          ? <span className={_styles.textGray}>Пока никого</span>
          : (
            <div className={styles.person}>
              <Avatar
                src={holder.lowQualityPhotoUrl ?? '/default-profile.png'}
                radius="xl"
                size={41}
              />
              <div className={styles.personInfo}>
                <span className={styles.name}>
                  {holder.firstName}
                  {' '}
                  {holder.lastName}
                </span>
                <Anchor href={AppRoute.User.replace(':username', holder.username!)}>Связаться</Anchor>
              </div>
            </div>
          )}
      </div>

      {!isUserHolder
        ? (queue == undefined || queue.length == 0
          ? <p className={_styles.textGray}>Пока что никого нет в очереди, но вы можете быть первым.</p>
          : (
            <Flex gap={4} direction="column">
              <span className={_styles.textGray}>
                {queue.length}
                {' '}
                {getNounForm(queue.length, 'человек', 'человека', 'человек')}
                {' '}
                    в очереди
              </span>
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
        : <p className={_styles.textGray}>В данный момент вы читаете книгу.</p>}

      {!isUserHolder && (!isUserInQueue
        ? <Button variant="white" fullWidth onClick={() => enqueue(itemId!)}>Встать в очередь</Button>
        : (
          <div className={styles.buttonWrapper}>
            <Button variant="white" fullWidth disabled={!isUserFirst} onClick={() => becomeHolder(itemId!)}>Книга у меня</Button>
            <ActionIcon variant="white" onClick={() => leaveQueue(itemId!)}><ArrowUiAuthLogoutIcon24Regular /></ActionIcon>
          </div>
        ))}
    </article>
  );
};
