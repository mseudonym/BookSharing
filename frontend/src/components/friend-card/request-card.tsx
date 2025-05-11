import _styles from '../../index.module.css';
import styles from './friend-card.module.css';
import { UserProfile } from '../../generated-api/model';
import { getGetFriendsListQueryKey, getGetFriendsRequestsReceivedQueryKey, postFriendsRespondRequest } from '../../generated-api/friends/friends';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckAIcon24Regular } from '@skbkontur/icons/icons/CheckAIcon/CheckAIcon24Regular';
import { XIcon24Regular } from '@skbkontur/icons/icons/XIcon/XIcon24Regular';
import { ActionIcon } from '@mantine/core';

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
    <div className={styles.friendCard}>
      <img
        loading="lazy"
        src={lowQualityPhotoUrl ?? '/default-profile.png'}
        className={styles.avatar}
        alt={`Avatar image for ${username}`}
      />
      <div className={styles.userInfo}>
        <p>
          {firstName}
          {' '}
          {lastName}
        </p>
        <p className={_styles.textGray}>
          @
          {username}
        </p>
      </div>
      <div style={{ display: 'flex' }}>
        <ActionIcon variant="transparent" onClick={() => onSubmit(true)}>
          <CheckAIcon24Regular className={styles.checkButton} />
        </ActionIcon>
        <ActionIcon variant="transparent" onClick={() => onSubmit(false)}>
          <XIcon24Regular className={styles.crossButton} />
        </ActionIcon>
      </div>
    </div>
  );
};
