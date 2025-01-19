import styles from './button.module.css';
import { FC, PropsWithChildren } from "react";
import {Button as MButton} from "@mantine/core";

interface ButtonProps extends PropsWithChildren {
  variant: 'primary' | 'fill' | 'border';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = (props) => {
  return (
    <MButton
      className={`${styles.button} ${styles[props.variant]}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </MButton>
  );
};
