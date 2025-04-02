import _styles from '/src/index.module.css';
import styles from './empty-state.module.css';

interface EmptyStateProps {
  src: string;
  alt: string;
  text: string;
}

export const EmptyState = ({ src, alt, text }: EmptyStateProps) => {
  return (
    <div className={styles.illustrationWrapper}>
      <img
        loading="lazy"
        src={src}
        alt={alt}
        className={styles.image}
      />
      <p className={_styles.textCenter}>{text}</p>
    </div>
  );
};
