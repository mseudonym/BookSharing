import { TextInput, TextInputProps } from '@mantine/core';
import { InputMask, type MaskOptions } from '@react-input/mask';
import React, { forwardRef } from 'react';

type ISBNInputProps = TextInputProps & {
    mask?: string;
    replacement?: string | { [key: string]: RegExp };
    showMask?: boolean;
};

export const IsbnInput = forwardRef<HTMLInputElement, ISBNInputProps>(
  (
    {
      mask = '___-_-__-______-_', // можно ли 97 сюда добавить
      replacement = { _: /\d/ },
      showMask = false,
      ...props
    },
    ref
  ) => {
    return (
      <TextInput
        {...props}
        ref={ref}
        component={({
          ...inputProps
        }: React.InputHTMLAttributes<HTMLInputElement> & MaskOptions) => (
          <InputMask
            {...inputProps}
            mask={mask}
            replacement={replacement}
            showMask={showMask}
            />
        )}
        />
    );
  }
);

IsbnInput.displayName = 'ISBNInput';