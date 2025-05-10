import { Button, ActionIcon, MantineTheme, createTheme } from '@mantine/core';
import classes from './components.module.css';

declare module '@mantine/core' {
  export interface MantineTheme {
    colorScheme: 'light' | 'dark';
    other: MantineThemeOther;
  }

  export interface MantineThemeOther {
    colors: {
      rainbow: string;
      green: string;
      red: string;
      lightYellow: string;
      lightBlue: string;
      lightPink: string;
      white: string;
      white80: string;
      lightBackground16: string;
      lightBackground9: string;
      lightBackground: string;
      disabledText: string;
      secondaryText: string;
      primary: string;
      black: string;
    };
  }
}

const lightThemeColors = {
  colors: {
    rainbow: 'var(--rainbow-color)',
    green: 'var(--green-color)',
    red: 'var(--red-color)',
    lightYellow: 'var(--light-yellow-color)',
    lightBlue: 'var(--light-blue-color)',
    lightPink: 'var(--light-pink-color)',
    white: 'var(--white-color)',
    white80: 'var(--white-80-color)',
    lightBackground16: 'var(--light-background-16-color)',
    lightBackground9: 'var(--light-background-9-color)',
    lightBackground: 'var(--light-background-color)',
    disabledText: 'var(--disabled-text-color)',
    secondaryText: 'var(--secondary-text-color)',
    primary: 'var(--primary-color)',
    black: 'var(--black-color)',
  }
};

const darkThemeColors = {
  colors: {}
};


export const theme = createTheme({
  components: {
    Button: Button.extend({
      classNames: { root: classes.button }
    }),
  }
});