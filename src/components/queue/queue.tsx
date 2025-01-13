import _styles from '../../index.module.css'
import styles from './queue.module.css';
import { Avatar, Flex } from '@mantine/core';
import { Button } from '../buttons/button';

export interface QueueProps {
  owner: string;
  currentHolder: string;
  queueAvatars: string[]
}

export const Queue: React.FC<QueueProps> = ({
  owner,
  currentHolder,
  queueAvatars
}) => {
  return (
    <article className={styles.queue}>
      <Flex gap={8} direction="column">
        <span className={_styles.textGray}>Владелец</span>
        <Flex gap={16}>
          <Avatar src='src/assets/default-profile.png'
            radius='xl'
            size={41} />
          <Flex gap={4} direction="column">
            <p>{owner}</p>
            <a>Перейти в профиль</a>
          </Flex>
        </Flex>
      </Flex>

      <Flex gap={8} direction="column">
        <span className={_styles.textGray}>Текущий держатель</span>
        <Flex gap={16}>
          <Avatar src='src/assets/default-profile.png'
            radius='xl'
            size={41} />
          <Flex gap={4} direction="column">
            <p>{currentHolder}</p>
            <a>Связаться</a>
          </Flex>
        </Flex>
      </Flex>

      <Flex gap={4} direction="column">
        <span className={_styles.textGray}>{queueAvatars.length} человек в очереди</span>
        <div className={styles.avatarStack}>
          {queueAvatars.map((avatar, index) => (
            <Avatar
              key={index}
              src={avatar}
              size={41}
              radius="xl"
              className={styles.avatar}
              style={{zIndex: index}}
            />
          ))}
        </div>
      </Flex>

      <Button variant='fill'>Встать в очередь</Button>
    </article>
  );
}