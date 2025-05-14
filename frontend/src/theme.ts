import { ActionIcon, Anchor, Button, createTheme, Input, Loader, PasswordInput, TextInput } from '@mantine/core';

import classes from './components.module.css';

declare module '@mantine/core' {
  export interface MantineTheme {
    colorScheme: 'light' | 'dark';
  }
}

export const theme = createTheme({
  // Spacing system
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    'xxl': '64px'
  },

  // Typography system
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  fontSizes: {
    xs: '14px',
    sm: '16px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },

  // Border radius system
  radius: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  // Components configuration
  components: {
    Button: Button.extend({
      classNames: { root: classes.button },
      defaultProps: {
        variant: 'outline',
        size: 'md',
      }
    }),
    ActionIcon: ActionIcon.extend({
      classNames: { root: classes.actionIcon },
      defaultProps: {
        variant: 'white',
        size: 'lg',
      }
    }),
    Input: Input.extend({
      classNames: {
        wrapper: classes.inputWrapper, 
        input: classes.input 
      },
      defaultProps: {
        variant: 'default',
        size: 'md',
      }
    }),
    PasswordInput: PasswordInput.extend({
      classNames: {
        root: classes.inputWrapper,
        input: classes.input, 
        label: classes.inputLabel, 
        error: classes.inputError,
        visibilityToggle: classes.visibilityToggle
      },
      defaultProps: {
        variant: 'default',
        size: 'md',
      },
    }),
    TextInput: TextInput.extend({
      classNames: { 
        root: classes.inputWrapper,
        input: classes.input, 
        label: classes.inputLabel, 
        error: classes.inputError 
      },
      defaultProps: {
        variant: 'default',
        size: 'md',
      },
    }),
    Anchor: Anchor.extend({
      classNames: { root: classes.anchor },
    }),
    Loader: Loader.extend({
      classNames: { root: classes.loader },
      defaultProps: {
        color: 'var(--primary-color)',
        variant: 'md'
      }
    }),
  },
});