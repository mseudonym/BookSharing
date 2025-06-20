import {
  Anchor,
  Avatar,
  Burger,
  Button,
  Divider,
  Drawer,
  Flex,
  Image,
  SimpleGrid,
  Text,
  Title,
  TitleOrder,
} from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/landing-page/landing-page.module.css';

import { Logo } from '~/components/logo';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { FadeInSection } from '~/ui/fade-in-section/fade-in-section';

export const LandingPage = () => {
  const { width } = useViewportSize();
  const [opened, { open, close }] = useDisclosure(false);
  const [textSize, setTextSize] = useState<string>();
  const [buttonSize, setButtonSize] = useState<string>();
  const [mainTitleOrder, setMainTitleOrder] = useState<TitleOrder>(1);
  const [secondTitleOrder, setSecondTitleOrder] = useState<TitleOrder>(3);
  const [creatorTitleOrder, setCreatorTitleOrder] = useState<TitleOrder>(5);
  const [isBigSizeLogo, setIsBigSizeLogo] = useState<boolean>(true);

  useEffect(() => {
    document.body.style.backgroundColor = 'var(--white-color)';

    return () => {
      document.body.style.backgroundColor = 'var(--light-background-color)';
    };
  }, []);

  useLayoutEffect(() => {
    const getTextSize = (): string => {
      if (width > 600) {
        return 'xl';
      }
      return 'md';
    };

    setTextSize(getTextSize());
    setButtonSize(getTextSize());

    const getMainTitleOrder = (): TitleOrder => {
      if (width <= 600) {
        return 4;
      }
      if (width <= 1024) {
        return 2;
      }
      return 1;
    };

    setMainTitleOrder(getMainTitleOrder());

    const getSecondTitleOrder = (): TitleOrder => {
      if (width <= 600) {
        return 5;
      }
      return 3;
    };

    setSecondTitleOrder(getSecondTitleOrder());

    const getCreatorTitleOrder = (): TitleOrder => {
      if (width <= 600) {
        return 6;
      }
      return 5;
    };

    setCreatorTitleOrder(getCreatorTitleOrder());

    const needRenderBigSizeLogo = (): boolean => {
      return width > 1024;
    };

    setIsBigSizeLogo(needRenderBigSizeLogo);
  }, [width]);

  const featureBlocks = [
    {
      title: 'Добавляйте книги при помощи сканирования по ISBN',
      description: 'Экономьте деньги и заботьтесь об окружающей среде. Открывайте для себя новые книги в полках\n' +
        '                ваших друзей, вместо покупки новых и шарьте общий контекст.',
      imageSrc: '/landing-2-1.png',
      imageAlt: 'Add book preview'
    },
    {
      title: 'Узнавайте, какие книги можно взять почитать у друзей',
      description:
        'Экономьте деньги и заботьтесь об окружающей среде. Открывайте для себя новые книги в полках ваших друзей, вместо покупки новых.',
      imageSrc: '/landing-2-2.png',
      alt: 'Friends books preview',
    },
    {
      title: 'Вставайте в очередь за интересующими книгами',
      description:
        'Ищите интересные книги на полках и вставайте в очереди за ними. Связывайтесь с текущим держателем, чтобы начать чтение.',
      imageSrc: '/landing-2-3.png',
      alt: 'Enqueue preview',
    },
    {
      title: 'Добавляйте друзей и отслеживайте заявки',
      description:
        'Разширьте возможности вашего книжного обмена. Добавляйте друзей, чтобы видеть их библиотеку и обмениваться еще проще.',
      imageSrc: '/landing-2-4.png',
      alt: 'Add friends preview',
    },
    {
      title: 'Получайте уведомления о действиях с книгами',
      description:
        'Будьте в курсе всего, что происходит с вашими книгами и очередями. Получайте мгновенные уведомления обо всех изменениях.',
      imageSrc: '/landing-2-5.png',
      alt: 'Get notifications preview',
    },
  ];

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        position='right'
        size='sm'
      >
        <Flex direction='column' gap='md' >
          <Button size={buttonSize} variant='outline' onClick={() => router.navigate(AppRoute.Login)}>
            Войти
          </Button>
          <Button size={buttonSize} variant='filled' onClick={() => router.navigate(AppRoute.Register)}>
            Зарегистрироваться
          </Button>
        </Flex>
      </Drawer>

      <Flex className={styles.root} align='center' direction='column'>
        <FadeInSection>
          <Flex className={styles.hero} direction='column' align='center'>
            <Flex className={styles.heroBlock} direction='column' gap={80}>
              <Flex className={styles.header} justify='space-between' align='center'>
                <Logo isBigSize={isBigSizeLogo} className={styles.logo}/>
                <Flex gap='md' className={styles.actions}>
                  <Button size={buttonSize} variant='outline'
                    onClick={() => router.navigate(AppRoute.Login)}>
                    Войти
                  </Button>
                  <Button size={buttonSize} variant='filled'
                    onClick={() => router.navigate(AppRoute.Register)}>
                    Зарегистрироваться
                  </Button>
                </Flex>
                <Burger opened={opened} onClick={open} className={styles.burger}/>
              </Flex>
              <Flex direction='column' align='center' className={styles.heroContent}>
                <Title textWrap='balance' ta='center' order={mainTitleOrder}>Объедените книжные полки с друзьями</Title>
                <Text size={textSize} ta='center'>Читайте их книги, делитесь своими — это экологично,
                  выгодно и объединяет. Узнайте, что можно взять почитать, вместо покупки. Шерите
                  контекст, экономьте ресурсы!</Text>
                <Button size={buttonSize} variant='filled'
                  onClick={() => router.navigate(AppRoute.Register)}>Начать шарить</Button>
              </Flex>
            </Flex>
          </Flex>
        </FadeInSection>

        {featureBlocks.map((block, index) => (
          <FadeInSection key={index}>
            <SimpleGrid cols={{ base: 1, lg: 2 }}
              spacing={{ base: 'xl', sm: 'xxl' }}
              verticalSpacing={{ base: 'md', sm: 'xl' }}
              className={styles.block}>
              <Flex direction='column' gap='md'>
                <Title order={secondTitleOrder} textWrap='balance'>
                  {block.title}
                </Title>
                <Text size={textSize} className={_styles.textGray}>
                  {block.description}
                </Text>
              </Flex>
              <div className={styles.featureBlockImageWrapper}>
                <Image src={block.imageSrc} alt={block.imageAlt} className={styles.featureBlockImage}/>
              </div>
            </SimpleGrid>
          </FadeInSection>
        ))}

        <FadeInSection>
          <Flex align='center' direction='column' className={styles.block} gap='md'>
            <Title ta='center' order={secondTitleOrder} textWrap='balance'>
              Пользуйтесь без границ с любого устройства
            </Title>
            <Text size={textSize} ta='center' className={_styles.textGray}>Наше приложение адаптировано для всех
              устройств, чтобы вы могли комфортно пользоваться сервисом в любом месте и в любое время.</Text>
            <Image src='/landing-3.png' alt='Adaptive interface preview'/>
          </Flex>
        </FadeInSection>

        <FadeInSection>
          <Flex className={styles.block} direction='column' gap='md'>
            <Title order={secondTitleOrder}>Создатели</Title>
            <div className={styles.creators}>
              <div className={styles.firstCreator}>
                <Avatar src='/pawel.png' className={styles.avatar}/>
                <Flex direction='column' gap={8} align='center'>
                  <Title ta='center' order={creatorTitleOrder}>Павел Ловыгин</Title>
                  <Text ta='center' size={textSize} className={_styles.textGray}>Идейный вдохновитель,
                    backend-разработчик, DevOps</Text>
                  <Anchor ta='center' style={{ alignSelf: 'center' }}
                    href='https://t.me/pavel_lov_work'>Связаться</Anchor>
                </Flex>
              </div>
              <div className={styles.secondCreator}>
                <Avatar src='/alexander.png' className={styles.avatar}/>
                <Flex direction='column' gap={8} align='center'>
                  <Title ta='center' order={creatorTitleOrder}>Александр Михайличенко</Title>
                  <Text ta='center' size={textSize} className={_styles.textGray}>Дизайнер,
                    frontend-разработчик</Text>
                  <Anchor ta='center' style={{ alignSelf: 'center' }}
                    href='https://t.me/mseudonym'>Связаться</Anchor>
                </Flex>
              </div>
            </div>
          </Flex>
          <Flex className={styles.block}>
            <Divider/>
            <Text size={textSize}>© 2025 Шарю</Text>
          </Flex>
        </FadeInSection>
      </Flex>
    </>
  );
};