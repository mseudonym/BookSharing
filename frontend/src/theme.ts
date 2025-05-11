import { ActionIcon, Button, createTheme } from '@mantine/core';
import classes from './components.module.css';

declare module '@mantine/core' {
  export interface MantineTheme {
    colorScheme: 'light' | 'dark';
  }
}

export const theme = createTheme({
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
  }
});