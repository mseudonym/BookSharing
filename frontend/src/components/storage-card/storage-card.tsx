import { Anchor, Card, Flex, Image, Text } from '@mantine/core';
import React from 'react';

import styles from '~/components/storage-card/storage-card.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import { ItemInfo, UserData } from '~/generated-api/model';
import { router } from '~/main';

interface StorageFriendCardProps extends ItemInfo {
    user: UserData | undefined;
}

export const StorageCard = ({ user, book, owner, holder, firstInQueue, queuePosition, holderChangedDaysAgo  }: StorageFriendCardProps) => {
  const isUserInQueue = queuePosition !== null;
  const isUserHolder = user?.username === holder.username;
  const isUserFirstInQueue = user?.username === firstInQueue?.username;
  const isOwnerHolder = owner?.username === holder.username;
  const isUserOwner = owner.username === user?.username;
  const daysAgo = (holderChangedDaysAgo! + 1);

  return (
    <Card className={styles.storageCard}>
      <Image onClick={() => router.navigate(AppRoute.Book.replace(':id', book.id!))} src={book?.bookCoverUrl} alt={`Book cover for ${book?.title}`} className={styles.bookCover} />
      <Flex direction="column" gap="sm"> 
        <Text>{book?.title}</Text>
        <Text></Text>
        {
          // Книга у пользователя, и есть первый в очереди
          !isUserOwner && isUserHolder && firstInQueue && (
            <Text className={_styles.textGray}>
                      Книга у вас {daysAgo} дней. Следующий в очереди @{firstInQueue.username}. После прочтения&nbsp;
              <Anchor href={firstInQueue.contactUrl ?? ''} className={_styles.anchorGray}>свяжитесь с ним</Anchor> и передайте книгу.
            </Text>
          )
        }
        {
          // Книга у пользователя, но он последний в очереди
          !isUserOwner && isUserHolder && !firstInQueue && (
            <Text className={_styles.textGray}>
                      Книга у вас {daysAgo} дней и за вами в очереди никого нет. Если никто не появится —&nbsp;
              <Anchor href={owner.contactUrl ?? ''} className={_styles.anchorGray}>свяжитесь с владельцем</Anchor> после прочтения и отдайте книгу.
            </Text>
          )
        }
        {
          // Пользователь первый в очереди, и владелец держит книгу
          isUserFirstInQueue && isOwnerHolder && (
            <Text className={_styles.textGray}>
                    Вы первый в очереди. Книга у @{owner.username}, он владелец.&nbsp;
              <Anchor href={owner.contactUrl ?? ''} className={_styles.anchorGray}>Связаться с ним.</Anchor>
            </Text>
          )
        }
        {
          // Пользователь первый в очереди, но не владелец держит книгу
          isUserFirstInQueue && !isOwnerHolder && (
            <Text className={_styles.textGray}>
                      Вы первый в очереди. Книга у @{holder.username} {daysAgo} дней.&nbsp;
              <Anchor href={holder.contactUrl ?? ''} className={_styles.anchorGray}>Связаться с ним.</Anchor>
            </Text>
          )
        }
        {
          // Пользователь в очереди, но не первый
          isUserInQueue && !isUserFirstInQueue && (
            <Text className={_styles.textGray}>Ваш текущий номер в очереди: {queuePosition}</Text>
          )
        }
        {
          // Пользователь не в очереди, показываем текущего держателя
          !isUserInQueue && isUserOwner && (
            <Text className={_styles.textGray}>В данный момент книга находится у @{holder.username}</Text>
          )
        }
      </Flex>
    </Card>
  );
};