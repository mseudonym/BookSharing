import styles from './input-field.module.css';
import _styles from '../../../index.module.css';
import { Message, UseFormRegisterReturn } from 'react-hook-form';

export interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  register?: UseFormRegisterReturn<string>;
  error?: Message | undefined;
}

export const InputField = ({ label, placeholder, type, register, error }: InputFieldProps) => {
  return (
    <div className={styles.inputBlock}>
      <label className={styles.inputLabel}>
        {label}
        <input
          {...register}
          type={type}
          className={styles.input}
          placeholder={placeholder}
          aria-label={label}
        />
      </label>
      <p className={_styles.error}>{error}</p>
    </div>
  );
};
