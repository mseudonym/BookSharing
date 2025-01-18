import _styles from '../../index.module.css'
import styles from './book-card.module.css';
import { BookModel } from '../../generated-api/model';
import { Link } from 'react-router-dom';

export const BookCard: React.FC<BookModel> = ({ id, title, bookCoverUrl, author }) => {
  return (
    <Link className={styles.bookCard} to={`/book/${id}`}>
      <img
        loading="lazy"
        src={bookCoverUrl ?? "src/assets/default-book-cover.png"}
        className={styles.bookCover}
        alt={`Book cover for ${title}`}
      />
      <div className={styles.bookInfo}>
        <p className={styles.bookText}>{title}</p>
        <p className={`${styles.bookText} ${_styles.textGray}`}>{author}</p>
      </div>
    </Link>
  );
};