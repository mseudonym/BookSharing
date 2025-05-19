import { PasswordInput as MantinePasswordInput, PasswordInputProps } from '@mantine/core';
import { EyeClosedIcon20Regular, EyeOpenIcon20Regular } from '@skbkontur/icons';
import React from 'react';

import styles from '~/components/custom-mantine/password-input/password-input.module.css';

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const { label, placeholder, error, ...rest } = props;
  
  return (
    <MantinePasswordInput
      ref={ref}
      label={label}
      placeholder={placeholder}
      error={error}
      {...rest}
      visibilityToggleIcon={({ reveal }) =>
        reveal ? (
          <EyeClosedIcon20Regular className={styles.eyeIcon} />
        ) : (
          <EyeOpenIcon20Regular className={styles.eyeIcon} />
        )
      }
    />
  );
});

PasswordInput.displayName = 'PasswordInput';