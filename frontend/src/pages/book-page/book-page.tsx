import { ActionIcon, Divider, Menu, Modal, Title, Text, Button, Flex, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TrashCanIcon24Regular } from '@skbkontur/icons';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons/icons/ArrowALeftIcon';
import { UiMenuDots3HIcon24Regular } from '@skbkontur/icons/icons/UiMenuDots3HIcon';
import React from 'react';
import { useParams } from 'react-router-dom';

import _styles from '~/index.module.css';
import styles from '~/pages/book-page/book-page.module.css';

import { Header } from '~/components/header';
import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { Queue } from '~/components/queue/queue';
import { useGetBooksByIdBookId } from '~/generated-api/books/books';
import { useGetItemsByBookId } from '~/generated-api/items/items';
import { ErrorPage } from '~/pages/error-page/error-page';
import { LoadingPage } from '~/pages/loading-page';
import { Page } from '~/ui/pages';
import { Wrapper } from '~/ui/wrapper';

export const BookPage = () => {
  const { id } = useParams();
  const { data: book, isLoading: isLoadingBook, isError: isErrorBook } = useGetBooksByIdBookId(id!);
  const { data: queueList, isLoading: isLoadingQueues, isError: isErrorQueues } = useGetItemsByBookId({ bookId: id });
  const [opened, { open, close }] = useDisclosure(false);

  /* const { mutateAsync: deleteBook } = useMutation({
    mutationFn: deleteBooksByIdBookId,
    onSuccess: async () => {
      router.navigate(AppRoute.Profile);
    },
  }); */

  if (isLoadingBook || isLoadingQueues) {
    return <LoadingPage />;
  }

  if (isErrorBook || isErrorQueues || !book) {
    return <ErrorPage />;
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title="Удалить книгу?" centered>
        <Text className={_styles.textGray}>Это также удалит все очереди за ней.</Text>
        <Flex
          justify="flex-start"
          align="center"
          direction="row"
          gap="var(--mantine-spacing-sm)"
        >
          <Button variant="filled" >
              Да, удалить
          </Button>
          <Button  color="outline" onClick={close}>
              Нет, оставить
          </Button>
        </Flex>
      </Modal>
      <Page>
        <Header variant="auto" withPadding hideOnDesktop>
          <ActionIcon variant="transparent" onClick={() => { window.history.back(); }}>
            <ArrowALeftIcon24Regular />
          </ActionIcon>

          <Menu position='bottom-end' offset={-50}>
            <Menu.Target>
              <ActionIcon variant="transparent">
                <UiMenuDots3HIcon24Regular />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={open} leftSection={<TrashCanIcon24Regular/>}>
              Удалить книгу с полки
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

        </Header>

        <Wrapper background='none' noPaddingHorizontal noGap className={styles.bookWrapper}>
          <div className={styles.bookCover}>
            <Image className={styles.bookImage} src={book.bookCoverUrl} />
            <div className={styles.roundRect} />
          </div>
          <Image className={styles.bookImageDesktop} src={book.bookCoverUrl} />
          <div className={styles.bookContent}>
            <div className={styles.bookInfo}>
              <div className={styles.bookHeader}>
                <div className={styles.bookExtra}>
                  <Text span className={_styles.textGray}>{book?.author}</Text>
                  <Text span className={_styles.textGray}>/</Text>
                  <Text span className={_styles.textGray}>
                    {book.publicationYear}
                    {' '}
                г.
                  </Text>
                </div>
                <Title ta='center'>{book?.title}</Title>
              </div>
              <div className={styles.bookBlock}>
                <Text span className={_styles.textGray}>Описание</Text>
                <Text>{book?.description}</Text>
              </div>
              <Divider my="l" />
            </div>
          
            <section className={styles.queues}>
              <Header variant="left" withPadding>
                <Title>Эта книга у ваших друзей</Title>
              </Header>
              {queueList == undefined || queueList.length == 0
                ? (
                  <IllustrationWrapper
                    src="/queue-illustration.svg"
                    alt="Queue is empty illustration"
                    text="Очередей нет"
                  />
                )
                : queueList.map((queue) => <Queue {...queue} bookId={id!} key={id!} />)}
            </section>
          </div>
          <Menu position='bottom-end' offset={-50}>
            <Menu.Target>
              <ActionIcon variant="transparent" className={styles.menuDesctopButton}>
                <UiMenuDots3HIcon24Regular />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={open} leftSection={<TrashCanIcon24Regular/>}>
              Удалить книгу с полки
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Wrapper>
      </Page>
    </>
  );
};
