import { MantineThemeOverride, MantineTheme } from '@mantine/core';

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

const getButtonStyles = (theme: MantineTheme) => ({
  root: {
    maxHeight: '50px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,

    '&[data-variant="filled"]': {
      backgroundColor: theme.other.colors.primary,
      color: theme.other.colors.white,
      '&:hover': {
        backgroundColor: theme.other.colors.black,
        transform: 'translateY(-1px)'
      },
      '&:disabled': {
        backgroundColor: theme.other.colors.lightBackground9,
        color: theme.other.colors.disabledText,
      }
    },

    '&[data-variant="white"]': {
      backgroundColor: theme.other.colors.white,
      color: theme.other.colors.primary,
      '&:hover': {
        backgroundColor: theme.other.colors.lightBackground,
      },
      '&:disabled': {
        color: theme.other.colors.disabledText,
      }
    },

    '&[data-variant="outline"]': {
      backgroundColor: theme.other.colors.white,
      border: `1px solid ${theme.other.colors.lightBackground16}`,
      color: theme.other.colors.primary,
      '&:hover': {
        backgroundColor: theme.other.colors.lightBackground,
      },
      '&:disabled': {
        color: theme.other.colors.disabledText,
        backgroundColor: theme.other.colors.lightBackground,
      }
    },
  }
});

const getActionIconStyles = (theme: MantineTheme) => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '100%',
    cursor: 'pointer',

    '&[data-variant="transparent"]': {
      backgroundColor: 'transparent',
      color: theme.other.colors.primary,
      '&:hover': {
        color: theme.other.colors.black,
      },
      '&:disabled': {
        color: theme.other.colors.disabledText,
      }
    },
    '&[data-variant="white"]': {
      backgroundColor: theme.other.colors.white,
      color: theme.other.colors.primary,
      '&:hover': {
        backgroundColor: theme.other.colors.lightBackground,
      },
      '&:disabled': {
        backgroundColor: theme.other.colors.lightBackground,
        color: theme.other.colors.disabledText,
      }
    }
  }
});

export const createTheme = (colorScheme: 'light' | 'dark'): MantineThemeOverride => ({
  colorScheme,
  other: colorScheme === 'dark' ? darkThemeColors : lightThemeColors,
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  components: {
    Button: {
      styles: getButtonStyles,
      defaultProps: {
        size: 'md',
      }
    },
    ActionIcon: {
      styles: getActionIconStyles,
      defaultProps: {
        size: 'lg',
      }
    },
  },
});