import _styles from '../../index.module.css'
import styles from './book-page.module.css';
import { Header } from '../../components/header/header.tsx';
import { ArrowALeftIcon24Regular, UiMenuDots3HIcon24Regular } from '@skbkontur/icons';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { PageBackground } from '../../ui/page/page-background.tsx';
import { Divider } from '@mantine/core';
import { Queue } from '../../components/queue/queue.tsx';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getBooksByIdBookId, getGetBooksByIdBookIdQueryKey } from '../../generated-api/books/books.ts';
import { ErrorPage } from '../error-page/error-page.tsx';
import { Loading } from '../../components/loading/loading.tsx';
import { getGetItemsByBookIdQueryKey, getItemsByBookId } from '../../generated-api/items/items.ts';

export const BookPage = () => {
  const id = useParams().id ?? "";
  const { data: book, isLoading } = useQuery({
    queryFn: () => getBooksByIdBookId(id),
    queryKey: getGetBooksByIdBookIdQueryKey(id),
  })

  const { data: queueList } = useQuery({
    queryFn: () => getItemsByBookId({ bookId: id }),
    queryKey: getGetItemsByBookIdQueryKey({ bookId: id })
  })

  if (isLoading) {
    return <Loading />
  }

  if (!book) {
    return <ErrorPage />;
  }

  return (
    <PageBackground>
      <Header variant='autoPadding'>
        <ButtonIcon variant='flat' onClick={() => { window.history.back() }}>
          <ArrowALeftIcon24Regular />
        </ButtonIcon>
        <ButtonIcon variant='flat'>
          <UiMenuDots3HIcon24Regular />
        </ButtonIcon>
      </Header>

      <div className={styles.wrapper}>
        <div className={styles.bookWrapper}>
          <img className={styles.bookImage} src={book.isPhotoUploaded! ? book.bookCoverUrl! : "/src/assets/default-book-cover.png"} />
          <div className={_styles.roundRect} />
        </div>
        <div className={_styles.content}>
          <div className={styles.bookInfo}>
            <div className={styles.bookHeader}>
              <div className={styles.bookExtra}>
                <p className={_styles.textGray}>{book?.author}</p>
                <p className={_styles.textGray}>/</p>
                <p className={_styles.textGray}>{book.publicationYear} г.</p>
              </div>
              <h1 className={`${_styles.title} ${_styles.textCenter}`}>{book?.title}</h1>
            </div>
            <div className={styles.bookBlock}>
              <p className={_styles.textGray}>Описание</p>
              <p>{book?.description}</p>
            </div>
          </div>
          <Divider my="l" style={{ width: "90%" }} />
          <section className={styles.queues}>
            <h1 className={`${_styles.title} ${_styles.titleWrapper}`}>Эта книга у ваших друзей</h1>
            {queueList == undefined || queueList.length == 0
              ? <div className={_styles.illustrationWrapper}>
                <img loading='lazy'
                  src='/src/assets/queue-illustration.svg'
                  alt='QueueEmpty illustration' 
                  width={200}/>
                <p className={_styles.textCenter}>Очередей нет</p>
              </div>
              : queueList.map((queue) => <Queue {...queue} bookId={id} />)}
          </section>
        </div>
      </div>
    </PageBackground>
  );
}
