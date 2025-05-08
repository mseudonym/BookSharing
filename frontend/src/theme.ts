import { MantineThemeOverride, MantineTheme } from '@mantine/core';

export const theme: MantineThemeOverride = {
  primaryColor: 'dark',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: (theme: MantineTheme) => ({
        root: {
          borderRadius: '16px',
          minHeight: '50px',
          width: '100%',
          textAlign: 'center',
          transition: '0.4s',
          '&[data-variant="filled"]': {
            backgroundColor: theme.black,
            color: theme.white,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.90)',
            },
            '&:disabled': {
              backgroundColor: 'var(--gray-50-color)',
              color: 'var(--light-gray-color)',
            },
          },
          '&[data-variant="outline"]': {
            backgroundColor: theme.white,
            border: '1px solid var(--light-gray-color)',
            color: theme.black,
            '&:hover': {
              color: 'black',
              backgroundColor: '#f9f9f9',
            },
          },
          '&[data-variant="subtle"]': {
            backgroundColor: theme.white,
            color: theme.black,
            '&:hover': {
              backgroundColor: '#f9f9f9',
              color: 'black',
            },
            '&:disabled': {
              color: 'var(--light-gray-color)',
            },
          },
        },
      }),
    },
    ActionIcon: {
      styles: (theme: MantineTheme) => ({
        root: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50px',
          height: '50px',
          borderRadius: '100%',
          cursor: 'pointer',
          flexShrink: 0,
          transition: '0.4s',
          '&[data-variant="filled"]': {
            backgroundColor: 'var(--white-80-color)',
            '&:hover': {
              backgroundColor: '#f9f9f9',
            },
          },
          '&[data-variant="subtle"]': {
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'var(--white-80-color)',
            },
          },
        },
      }),
    },
  },
}; 