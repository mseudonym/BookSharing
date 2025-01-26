import styles from './button.module.css';
import { PropsWithChildren } from 'react';
import { Button as MButton } from '@mantine/core';

interface ButtonProps extends PropsWithChildren {
  variant: 'primary' | 'fill' | 'border';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button = ({ variant, onClick, disabled, children }: ButtonProps) => {
  return (
    <MButton
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </MButton>
  );
};
