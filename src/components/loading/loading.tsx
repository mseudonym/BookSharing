import { FC } from 'react';

export const Loading: FC = () => {
  return (
    <img loading="lazy" src="/loading.svg" alt="Loading icon" />
  );
};
