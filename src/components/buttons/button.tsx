import React, {PropsWithChildren} from 'react';
import styles from './button.module.css';

export interface ButtonProps {
    variant: 'primary' | 'secondary';
    onClick?: () => void;
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({ children, variant, onClick }) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};