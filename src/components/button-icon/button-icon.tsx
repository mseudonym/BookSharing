import { ActionIcon } from '@mantine/core';
import { PropsWithChildren } from 'react';
import { PropsWithClass } from '../../conts';

export const ButtonIcon = ({ children }: PropsWithChildren<PropsWithClass>) => {
  return (
    <ActionIcon unstyled className='button-icon'>
      {children}
    </ActionIcon>
  );
}