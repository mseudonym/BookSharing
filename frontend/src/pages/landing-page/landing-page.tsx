import {
  Button,
  Flex,
  Title,
  Text,
  Image,
  SimpleGrid,
  Anchor,
  Avatar,
  Divider,
  TitleOrder,
  Burger,
  Drawer
} from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import React, { useLayoutEffect, useEffect, useState } from 'react';

import _styles from '~/index.module.css';
import styles from '~/pages/landing-page/landing-page.module.css';

import { Logo } from '~/components/logo';
import { AppRoute } from '~/conts';
import { router } from '~/main';
import { FadeInSection } from '~/ui/fade-in-section/fade-in-section';

export const LandingPage = () => {
  useEffect(() => {
    document.body.style.backgroundColor = 'var(--white-color)';

    return () => {
      document.body.style.backgroundColor = 'var(--light-background-color)';
    };
  }, []);

  const { width } = useViewportSize();
  const [opened, { open, close }] = useDisclosure(false);
  const [textSize, setTextSize] = useState<string>();
  const [buttonSize, setButtonSize] = useState<string>();
  const [mainTitleOrder, setMainTitleOrder] = useState<TitleOrder>(1);
  const [secondTitleOrder, setSecondTitleOrder] = useState<TitleOrder>(3);
  const [creatorTitleOrder, setCreatorTitleOrder] = useState<TitleOrder>(5);
  const [logoSize, setLogoSize] = useState<'big' | 'small'>('big');

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

    const getLogoSize = (): 'big' | 'small' => {
      if (width <= 1024) {
        return 'small';
      }
      return 'big';
    };

    setLogoSize(getLogoSize());
  }, [width]);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        position='right'
        className={styles.drawer}
      >
        <Flex gap='16' direction='column'>
          <Button size={buttonSize} variant='outline' onClick={() => router.navigate(AppRoute.Login)}>
            Войти
          </Button>
          <Button size={buttonSize} variant='filled' onClick={() => router.navigate(AppRoute.Register)}>
            Зарегистрироваться
          </Button>
        </Flex>
      </Drawer>

      <Flex className={styles.landingRoot} align='center' direction='column'>
        <FadeInSection>
          <Flex className={styles.hero} direction='column' align='center'>
            <Flex className={styles.firstBlock} direction='column' gap='80px'>
              <Flex className={styles.landingHeader} justify='space-between'>
                <Logo size={logoSize} className={styles.logo}/>
                <Flex gap='16' className={styles.actions}>
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
                <Title ta='center' order={mainTitleOrder}>Объедените книжные полки с друзьями</Title>
                <Text size={textSize} ta='center'>Читайте их книги, делитесь своими — это экологично,
                  выгодно и объединяет. Узнайте, что можно взять почитать, вместо покупки. Шерите
                  контекст, экономьте ресурсы!</Text>
                <Button size={buttonSize} variant='filled'
                  onClick={() => router.navigate(AppRoute.Register)}>Начать шарить</Button>
              </Flex>
            </Flex>
          </Flex>
        </FadeInSection>

        <FadeInSection>
          <SimpleGrid cols={{ base: 1, lg: 2 }}
            spacing={{ base: 'xl', sm: 'xxl' }}
            verticalSpacing={{ base: 'xl', sm: 'xxl' }}
            className={styles.secondaryBlock}>
            <Flex direction='column' className={styles.secondaryBlockInfo}>
              <Title order={secondTitleOrder}>
                Добавляйте книги при помощи сканирования по ISBN
              </Title>
              <Text size={textSize} className={_styles.textGray}>
                Пополняйте свою полку быстро и удобно: отсканируйте ISBN штрих-код, найдите книгу по
                названию или добавьте информацию вручную.
              </Text>
            </Flex>
            <div className={styles.secondaryBlockImage}>
              <Image src='/landing-2-1.png' alt='Add book preview'/>
            </div>
          </SimpleGrid>
        </FadeInSection>

        <FadeInSection>
          <SimpleGrid cols={{ base: 1, lg: 2 }}
            spacing={{ base: 'xl', sm: 'xxl' }}
            verticalSpacing={{ base: 'xl', sm: 'xxl' }}
            className={styles.secondaryBlock}>
            <Flex direction='column' className={styles.secondaryBlockInfo}>
              <Title order={secondTitleOrder}>
                Узнавайте, какие книги можно взять почитать у друзей
              </Title>
              <Text size={textSize} className={_styles.textGray}>
                Экономьте деньги и заботьтесь об окружающей среде. Открывайте для себя новые книги в полках
                ваших друзей, вместо покупки новых и шарьте общий контекст.
              </Text>
            </Flex>
            <div className={styles.secondaryBlockImage}>
              <Image src='/landing-2-2.png' alt='Friends books preview'/>
            </div>
          </SimpleGrid>
        </FadeInSection>

        <FadeInSection>
          <SimpleGrid cols={{ base: 1, lg: 2 }}
            spacing={{ base: 'xl', sm: 'xxl' }}
            verticalSpacing={{ base: 'xl', sm: 'xxl' }}
            className={styles.secondaryBlock}>
            <Flex direction='column' className={styles.secondaryBlockInfo}>
              <Title order={secondTitleOrder}>
                Вставайте в очередь за интересующими книгами
              </Title>
              <Text size={textSize} className={_styles.textGray}>
                Ищите интересные книги на полках друзей и вставайте в очереди за ними. И связывайтесь к
                текущим держателем, чтобы начать чтение.
              </Text>
            </Flex>
            <div className={styles.secondaryBlockImage}>
              <Image src='/landing-2-3.png' alt='Enqueue preview'/>
            </div>
          </SimpleGrid>
        </FadeInSection>

        <FadeInSection>
          <SimpleGrid cols={{ base: 1, lg: 2 }}
            spacing={{ base: 'xl', sm: 'xxl' }}
            verticalSpacing={{ base: 'xl', sm: 'xxl' }}
            className={styles.secondaryBlock}>
            <Flex direction='column' className={styles.secondaryBlockInfo}>
              <Title order={secondTitleOrder}>
                Добавляйте друзей и отслеживайте заявки
              </Title>
              <Text size={textSize} className={_styles.textGray}>
                Расширьте возможности вашего книжного обмена. Добавляйте друзей, чтобы видеть их библиотеку,
                узнавать о новых книгах и обмениваться еще проще и быстрее.
              </Text>
            </Flex>
            <div className={styles.secondaryBlockImage}>
              <Image src='/landing-2-4.png' alt='Add friends preview'/>
            </div>
          </SimpleGrid>
        </FadeInSection>

        <FadeInSection>
          <SimpleGrid cols={{ base: 1, lg: 2 }}
            spacing={{ base: 'xl', sm: 'xxl' }}
            verticalSpacing={{ base: 'xl', sm: 'xxl' }}
            className={styles.secondaryBlock}>
            <Flex direction='column' className={styles.secondaryBlockInfo}>
              <Title order={secondTitleOrder}>
                Получайте уведомления о действиях с книгами
              </Title>
              <Text size={textSize} className={_styles.textGray}>
                Будьте в курсе всего, что происходит с вашими книгами и очередями. Получайте мгновенные
                уведомления обо всех изменениях.
              </Text>
            </Flex>
            <div className={styles.secondaryBlockImage}>
              <Image src='/landing-2-5.png' alt='Get notifications preview'/>
            </div>
          </SimpleGrid>
        </FadeInSection>

        <FadeInSection>
          <Flex className={styles.blockWrapper} align='center'>
            <Title ta='center' order={secondTitleOrder}>
              Пользуйтесь без границ с любого устройства
            </Title>
            <Text size={textSize} ta='center' className={_styles.textGray}>Наше приложение адаптировано для всех
              устройств, чтобы вы могли комфортно пользоваться сервисом в любом месте и в любое время.</Text>
            <Image src='/landing-3.png' alt='Adaptive interface preview'/>
          </Flex>
        </FadeInSection>

        <FadeInSection>
          <Flex className={styles.blockWrapper}>
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
                <Avatar src='/alexandr.png' className={styles.avatar}/>
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
          <Flex className={styles.blockWrapper}>
            <Divider/>
            <Text size={textSize}>© 2025 Шарю</Text>
          </Flex>
        </FadeInSection>
      </Flex>
    </>
  );
};