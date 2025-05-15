import { ActionIcon, Anchor, AppShell, Button, createTheme, Divider, Input, Loader, Menu, PasswordInput, Textarea, TextInput, Title } from '@mantine/core';

import classes from './components.module.css';

declare module '@mantine/core' {
  export interface MantineTheme {
    colorScheme: 'light' | 'dark';
  }
}

export const theme = createTheme({
  headings: {
    fontFamily: 'Unbounded',
    fontWeight: '400',
    sizes: {
      h1: {
        fontSize: '22px',
        lineHeight: '120%',
      },
      h2: {
        fontSize: '18px',
        lineHeight: '120%',
      },
    },
  },

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
    sm: '14px',
    md: '16px',
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
    AppShell: AppShell.extend({
      classNames: {
        root: classes.appShell,
        main: classes.main,
        navbar: classes.menu,
      },
    }),
    Title: Title.extend({
      classNames: { root: classes.title },
    }),
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
    Menu: Menu.extend({
      classNames: { dropdown: classes.menuDropdown, item: classes.menuItem },
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
    Textarea: Textarea.extend({
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
    Divider: Divider.extend({
      classNames: { 
        root: classes.divider, 
        label: classes.dividerLabel 
      },
    }),
  },
});