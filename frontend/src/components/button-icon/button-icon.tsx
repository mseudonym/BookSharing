import { ActionIcon } from '@mantine/core';
import React from 'react';
import { PropsWithChildren } from 'react';

interface ButtonIconProps extends PropsWithChildren {
  variant: 'fill' | 'flat';
  onClick?: () => void;
}

// Удалить

export const ButtonIcon = ({ variant, onClick, children }: ButtonIconProps) => {
  // Map our custom variants to Mantine variants
  const mantineVariant = {
    fill: 'filled',
    flat: 'subtle',
  }[variant];

  return (
    <ActionIcon
      variant={mantineVariant}
      onClick={onClick}
    >
      {children}
    </ActionIcon>
  );
};
