import { ActionIcon } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';
import styles from './button-icon.module.css';

interface ButtonIconProps extends PropsWithChildren {
  variant: 'filled' | 'flat';
  onClick?: () => void;
}

export const ButtonIcon: FC<ButtonIconProps> = (props) => {
  return (
    <ActionIcon unstyled className={`${styles.buttonIcon} ${styles[props.variant]}`}
      onClick={props.onClick}>
      {props.children}
    </ActionIcon>
  );
}