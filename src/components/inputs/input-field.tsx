import React from "react";
import styles from './input-field.module.css';


export interface InputFieldProps {
    label: string;
    placeholder: string;
    type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, placeholder, type}) => {
    const inputId = `${label.toLowerCase()}-input`;

    return (
        <div className={styles.inputBlock}>
            <label htmlFor={inputId} className={styles.inputLabel}>
                {label}
            </label>
            <input
                id={inputId}
                type={type}
                className={styles.input}
                placeholder={placeholder}
                aria-label={label}
            />
        </div>
    );
};