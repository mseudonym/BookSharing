import { TextInput, TextInputProps } from '@mantine/core';
import React, { forwardRef } from 'react';
import InputMask from 'react-input-mask';

type ISBNInputProps = TextInputProps & {
  maskChar?: string | null;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
};

export const ISBNInput = forwardRef<HTMLInputElement, ISBNInputProps>(
  ({ maskChar = null, ...props }, ref) => {
    return (
      <InputMask
        mask="999-9-99-999999-9"
        maskChar={maskChar}
        alwaysShowMask={true}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
        name={props.name}
      >
        {(inputProps) => (
          <TextInput
            {...props}
            {...inputProps}
            ref={ref}
          />
        )}
      </InputMask>
    );
  }
);

ISBNInput.displayName = 'ISBNInput';