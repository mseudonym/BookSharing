import { ActionIcon, Button, createTheme, Input } from '@mantine/core';
import classes from './components.module.css';

declare module '@mantine/core' {
  export interface MantineTheme {
    colorScheme: 'light' | 'dark';
  }
}

export const theme = createTheme({
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    'xxl': '64px'
  },
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
      classNames: { input: classes.input },
      defaultProps: {
        variant: 'default',
        size: 'md',
      }
    }),
  }
});