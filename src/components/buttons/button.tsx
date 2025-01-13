import styles from './button.module.css';
import { FC, PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren {
  variant: 'primary' | 'fill' | 'border';
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = (props) => {
  return (
    <button
      className={`${styles.button} ${styles[props.variant]}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
