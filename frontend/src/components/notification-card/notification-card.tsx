import { Flex, Avatar, Text, Image, Anchor, ActionIcon } from '@mantine/core';
import { CheckAIcon24Regular, XIcon24Regular } from '@skbkontur/icons';
import React from 'react';

import styles from '~/components/notification-card/notification-card.module.css';
import _styles from '~/index.module.css';

import { AppRoute } from '~/conts';
import {
  FriendshipStatus,
  NotificationBase,
  type NotificationBaseFriendshipStatusChangedNotification,
  NotificationBaseFriendTakeBookToReadNotification,
  NotificationBaseNewBooksInFriendShelfNotification,
  NotificationBaseSomeoneBecameHolderOfYourItemNotification,
  NotificationBaseSomeoneQueueToItemNotification,
  NotificationBaseYourQueuePositionChangedNotification,
} from '~/generated-api/model';

interface NotificationCardProps {
  notification: NotificationBase;
}

interface NotificationContent {
  avatar: string | null | undefined;
  text: string;
  date: string | undefined;
  isRead: boolean | undefined;
  bookImage?: string | null | undefined;
  newStatus?: FriendshipStatus;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const formatNotificationText = (text: string) => {
    const parts = text.split(/(@\w+)/g);

    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const username = part.substring(1);
        return (
          <Anchor
            key={index}
            href={AppRoute.User.replace(':username', username)}
            className={styles.anchorGray}
          >
            {part}
          </Anchor>
        );
      }
      return <Text span key={index}>{part}</Text>;
    });
  };

  const renderContent = (): NotificationContent => {
    switch (notification.$type) {
      case 'SomeoneBecameHolderOfYourItemNotification': {
        const {
          newHolder,
          createdAt,
          isRead,
          book
        } = notification as NotificationBaseSomeoneBecameHolderOfYourItemNotification;
        return {
          avatar: newHolder.lowQualityPhotoUrl,
          text: `@${newHolder.username} стал держателем вашей книги`,
          date: createdAt,
          bookImage: book.bookCoverUrl,
          isRead: isRead,
        };
      }

      case 'SomeoneQueueToItemNotification': {
        const {
          newQueueMember,
          createdAt,
          isRead,
          book
        } = notification as NotificationBaseSomeoneQueueToItemNotification;
        return {
          avatar: newQueueMember.lowQualityPhotoUrl,
          text: `@${newQueueMember.username} добавился в очередь за вашей книгой`,
          date: createdAt,
          bookImage: book.bookCoverUrl,
          isRead: isRead,
        };
      }

      case 'FriendTakeBookToReadNotification': {
        const { friend, createdAt, isRead, book } = notification as NotificationBaseFriendTakeBookToReadNotification;
        return {
          avatar: friend.lowQualityPhotoUrl,
          text: `@${friend.username} взял почитать новую книгу`,
          date: createdAt,
          bookImage: book.bookCoverUrl,
          isRead: isRead,
        };
      }

      case 'NewBooksInFriendShelfNotification': {
        const {
          friend,
          createdAt,
          isRead,
          newBooksCoverUrls
        } = notification as NotificationBaseNewBooksInFriendShelfNotification;
        return {
          avatar: friend.lowQualityPhotoUrl,
          text: `@${friend.username} добавил к себе на полку новую книгу`,
          date: createdAt,
          bookImage: newBooksCoverUrls[0], // Поправить
          isRead: isRead,
        };
      }

      case 'YourQueuePositionChangedNotification': {
        const {
          newPosition,
          createdAt,
          isRead,
          book
        } = notification as NotificationBaseYourQueuePositionChangedNotification;
        return {
          avatar: '/notification-base.png',
          text: `Ваша новая позиция в очереди: ${newPosition}`,
          date: createdAt,
          bookImage: book.bookCoverUrl,
          isRead: isRead,
        };
      }

      case 'FriendshipStatusChangedNotification': {
        const {
          person,
          newStatus,
          createdAt,
          isRead,
        } = notification as NotificationBaseFriendshipStatusChangedNotification;

        const messages: Partial<Record<FriendshipStatus, string>> = {
          [FriendshipStatus.Friend]: `@${person.username} принял вашу заявку в друзья`,
          [FriendshipStatus.IncomeRequest]: `@${person.username} хочет добавиться к вам в друзья`,
        };
        
        return {
          avatar: person.lowQualityPhotoUrl,
          text: messages[newStatus || FriendshipStatus.None]!,
          date: createdAt,
          isRead: isRead,
        };
      }

      default:
        return {
          avatar: null,
          text: 'Новое уведомление',
          date: '',
          isRead: false,
        };
    }
  };

  const { avatar, text, date, bookImage, isRead, newStatus } = renderContent();
  const dateFormated = new Date(date || '').toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  return (
    <Flex gap={8} className={`${styles.root} ${!isRead && styles.unRead}`}>
      <Avatar size={41} src={avatar || '/default-profile.png'}/>
      <Flex direction='column' gap={4} className={styles.content}>
        <Text>{formatNotificationText(text)}</Text>
        <Text className={_styles.textGray}>{dateFormated}</Text>
      </Flex>
      {bookImage && <Image className={styles.image} src={bookImage}/>}
      {newStatus && newStatus === FriendshipStatus.IncomeRequest 
        && <Flex>
          <ActionIcon variant='transparent'>
            <CheckAIcon24Regular className={styles.checkButton}/>
          </ActionIcon>
          <ActionIcon variant='transparent'>
            <XIcon24Regular className={styles.crossButton}/>
          </ActionIcon>
        </Flex>}
    </Flex>
  );
};