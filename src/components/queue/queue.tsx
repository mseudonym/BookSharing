import { Flex, Group } from '@mantine/core';

export const Queue = () => {
  return (
    <article className='queue'>
      <Flex gap={8} direction="column">
        <span className='text-gray'>Владелец</span>
        <Flex gap={16}>
          <img src='src/assets/profile.png' className='queue-person__image' />
          <Flex gap={4} direction="column">
            <p>Александр Михайличенко</p>
            <a>Перейти в профиль</a>
          </Flex>
        </Flex>
      </Flex>

      <Flex gap={8} direction="column">
        <span className='text-gray'>Текущий держатель</span>
        <Flex gap={16}>
          <img src='src/assets/profile.png' className='queue-person__image' />
          <Flex gap={4} direction="column">
            <p>Павел Ловыгин</p>
            <a>Связаться</a>
          </Flex>
        </Flex>
      </Flex>

      <Flex gap={4} direction="column">
        <span className='text-gray'>1 человек в очереди</span>
        <Group gap={-8}>
          <img src='src/assets/profile.png' className='queue-person__image' />
          <img src='src/assets/profile.png' className='queue-person__image' />
        </Group>
      </Flex>
    </article>
  );
}