import { Anchor, Card, Flex, Image, Text } from '@mantine/core';
import React from 'react';

import styles from '~/components/storage-card/storage-card.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import { ItemInfo, UserData } from '~/generated-api/model';
import { getNounForm } from '~/helpers/helpers';
import { router } from '~/main';

interface StorageFriendCardProps extends ItemInfo {
  user: UserData | undefined;
}

const getCardText = (props: StorageFriendCardProps): string | null => {
  const { user, owner, holder, firstInQueue, queuePosition, holderChangedDaysAgo } = props;

  const isUserInQueue = queuePosition !== null;
  const isUserHolder = user?.username === holder.username;
  const isUserFirstInQueue = user?.username === firstInQueue?.username;
  const isOwnerHolder = owner?.username === holder.username;
  const isUserOwner = owner?.username === user?.username;
  const daysAgo = (holderChangedDaysAgo! + 1);

  if (!isUserFirstInQueue && isUserInQueue) {
    return `Ваш текущий номер в очереди: ${queuePosition}`;
  }

  if (isUserFirstInQueue && isOwnerHolder) {
    return `Вы первый в очереди. Книга у @${owner.username}, он владелец. [${owner.contactUrl} Связаться с ним].`;
  }

  if (isUserFirstInQueue && !isOwnerHolder) {
    return `Вы первый в очереди. Книга у @${holder.username} ${daysAgo} дней. [${holder.contactUrl} Связаться с ним].`;
  }

  if (!isUserOwner && isUserHolder && firstInQueue) {
    return `Книга у вас ${daysAgo} ${getNounForm(daysAgo, 'день', 'дня', 'дней')}. Следующий в очереди @${firstInQueue.username}. После прочтения [${firstInQueue.contactUrl} свяжитесь с ним]`;
  }

  if (!isUserOwner && isUserHolder && !firstInQueue) {
    return `Книга у вас ${daysAgo} ${getNounForm(daysAgo, 'день', 'дня', 'дней')} и за вами в очереди никого нет. Если никто не появится — [${owner.contactUrl} свяжитесь с владельцем] после прочтения и отдайте книгу.`;
  }

  if (isUserOwner && isUserHolder && !firstInQueue) {
    return 'Книга у вас. В очереди за ней пока никого нет.';
  }

  if (isUserOwner && isUserHolder && firstInQueue) {
    return `Книга у вас. Отдайте её [${AppRoute.User.replace(':username', firstInQueue.username!)} @${firstInQueue.username}], он следующий в очереди.`;
  }

  if (isUserOwner) {
    return `В данный момент книга находится у [${AppRoute.User.replace(':username', holder.username!)} @${holder.username}].`;
  }

  return null;
};

export const StorageCard = (props: StorageFriendCardProps) => {
  const cardText = getCardText(props);

  return (
    <Card className={styles.storageCard}>
      <Image onClick={() => router.navigate(AppRoute.Book.replace(':id', props.book.id!))}
        src={props.book?.bookCoverUrl} alt={`Book cover for ${props.book?.title}`}
        className={styles.bookCover}/>
      <Flex direction='column' gap='sm'>
        <Text>{props.book?.title}</Text>
        {cardText && (
          <Text className={_styles.textGray}>
            {cardText.split('[').flatMap((part, index) => {
              if (index === 0) return part;

              const [urlAndText, ...rest] = part.split(']');
              const [url, ...linkTextParts] = urlAndText.split(' ');
              const linkText = linkTextParts.join(' ');
              const remainingText = rest.join(']');

              if (!url) return [part];

              return [
                <Anchor key={`link-${index}`} href={url} className={_styles.anchorGray}>
                  {linkText}
                </Anchor>,
                remainingText,
              ];
            })}
          </Text>
        )}
      </Flex>
    </Card>
  );
};