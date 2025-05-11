import _styles from '../../index.module.css';
import styles from './queue.module.css';
import { Avatar, Flex, Button, ActionIcon } from '@mantine/core';
import { Link } from 'react-router';
import { QueueModel } from '../../generated-api/model';
import { getGetUsersMeQueryKey, getUsersMe } from '../../generated-api/users/users';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGetItemsByBookIdQueryKey } from '../../generated-api/items/items';
import { postQueueItemIdBecomeHolder, postQueueItemIdEnqueue, postQueueItemIdLeaveQueue } from '../../generated-api/queue/queue.ts';
import { AppRoute } from '../../conts.ts';
import { ArrowUiAuthLogoutIcon24Regular } from '@skbkontur/icons/icons/ArrowUiAuthLogoutIcon';
import { getNounForm } from '../../helpers/helpers.ts';

interface QueueProps extends QueueModel {
  bookId: string;
};

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
            <p className={styles.name}>
              {owner.firstName}
              {' '}
              {owner.lastName}
            </p>
            <Link className={_styles.link} to={AppRoute.User.replace(':username', owner.username!)}>Перейти в профиль</Link>
          </div>
        </div>
      </div>

      <div className={styles.personWrapper}>
        <span className={_styles.textGray}>Текущий держатель</span>
        {holder == undefined
          ? <p>Пока никого</p>
          : (
              <div className={styles.person}>
                <Avatar
                  src={holder.lowQualityPhotoUrl ?? '/default-profile.png'}
                  radius="xl"
                  size={41}
                />
                <div className={styles.personInfo}>
                  <p className={styles.name}>
                    {holder.firstName}
                    {' '}
                    {holder.lastName}
                  </p>
                  <Link className={_styles.link} to={AppRoute.User.replace(':username', holder.username!)}>Связаться</Link>
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
        ? <Button variant="fill" onClick={() => enqueue(itemId!)}>Встать в очередь</Button>
        : (
            <div className={styles.buttonWrapper}>
              <Button variant="fill" disabled={!isUserFirst} onClick={() => becomeHolder(itemId!)}>Книга у меня</Button>
              <ActionIcon variant="white" onClick={() => leaveQueue(itemId!)}><ArrowUiAuthLogoutIcon24Regular /></ActionIcon>
            </div>
          ))}
    </article>
  );
};
