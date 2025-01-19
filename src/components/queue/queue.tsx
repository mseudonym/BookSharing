import _styles from '../../index.module.css'
import styles from './queue.module.css';
import { Avatar, Flex } from '@mantine/core';
import { Button } from '../buttons/button';
import { Link } from 'react-router';
import { FC } from 'react';
import { QueueModel } from '../../generated-api/model';

export const Queue: FC<QueueModel> = ({ owner, holder, queue }) => {
  if (queue == undefined || owner == undefined) {
    return <p>Нет очередей</p>
  }

  return (
    <article className={styles.queue}>
      <div className={styles.personWrapper}>
        <span className={_styles.textGray}>Владелец</span>
        <div className={styles.person}>
          <Avatar src={owner.lowQualityPhotoUrl ?? "/src/assets/default-profile.png"}
            radius='xl'
            size={41} />
          <div className={styles.personInfo}>
            <p className={styles.name}>{owner.username}</p>
            <Link className={_styles.link} to={`/user/${owner.id}`}>Перейти в профиль</Link>
          </div>
        </div>
      </div>

      <div className={styles.personWrapper}>
        <span className={_styles.textGray}>Текущий держатель</span>
        {holder == undefined ? <p>Пока никого</p> :
          <div className={styles.person}>
            <Avatar src={holder.lowQualityPhotoUrl ?? "/src/assets/default-profile.png"}
              radius='xl'
              size={41} />
            <div className={styles.personInfo}>
              <p className={styles.name}>{holder.username}</p>
              <Link className={_styles.link} to={`/user/${holder.id}`}>Связаться</Link>
            </div>
          </div>
        }
      </div>

      {queue == undefined || queue.length == 0 ? <p className={_styles.textGray}>Пока что никого нет в очереди, но вы можете быть первым.</p> :
        <Flex gap={4} direction="column">
          <span className={_styles.textGray}>{queue.length} человек в очереди</span>
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
      }
      <Button variant='fill'>Встать в очередь</Button>
    </article>
  );
}