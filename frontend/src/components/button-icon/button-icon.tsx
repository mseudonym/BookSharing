import styles from './button-icon.module.css';
import { ActionIcon } from '@mantine/core';
import { PropsWithChildren } from 'react';

interface ButtonIconProps extends PropsWithChildren {
  variant: 'fill' | 'flat';
  onClick?: () => void;
}

export const ButtonIcon = ({ variant, onClick, children }: ButtonIconProps) => {
  return (
    <ActionIcon
      unstyled
      className={`${styles.buttonIcon} ${styles[variant]}`}
      onClick={onClick}
    >
      {children}
    </ActionIcon>
  );
};
