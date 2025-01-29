import styles from './loading.module.css';
import { Loader } from '@mantine/core';

export const Loading = () => {
  return (
    <Loader className={styles.loader} color="var(--light-gray-color)" />
  );
};
