import { createTheme } from '@mui/material/styles';
import { THEME_CONFIG } from '../config/app.config';

export const theme = createTheme({
  palette: {
    primary: {
      main: THEME_CONFIG.primary,
      light: '#5EB3FF',
      dark: '#0055D4',
    },
    secondary: {
      main: THEME_CONFIG.secondary,
      light: '#5FE67E',
      dark: '#1FA140',
    },
    error: {
      main: THEME_CONFIG.error,
    },
    warning: {
      main: THEME_CONFIG.warning,
    },
    info: {
      main: THEME_CONFIG.info,
    },
    success: {
      main: THEME_CONFIG.success,
    },
    background: {
      default: THEME_CONFIG.background.default,
      paper: THEME_CONFIG.background.paper,
    },
    text: {
      primary: THEME_CONFIG.text.primary,
      secondary: THEME_CONFIG.text.secondary,
      disabled: THEME_CONFIG.text.disabled,
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: THEME_CONFIG.borderRadius,
  },
  shadows: [
    'none',
    THEME_CONFIG.shadow,
    '0px 4px 12px rgba(0, 0, 0, 0.1)',
    '0px 6px 16px rgba(0, 0, 0, 0.12)',
    '0px 8px 20px rgba(0, 0, 0, 0.14)',
    '0px 10px 24px rgba(0, 0, 0, 0.16)',
    '0px 12px 28px rgba(0, 0, 0, 0.18)',
    '0px 14px 32px rgba(0, 0, 0, 0.20)',
    '0px 16px 36px rgba(0, 0, 0, 0.22)',
    '0px 18px 40px rgba(0, 0, 0, 0.24)',
    '0px 20px 44px rgba(0, 0, 0, 0.26)',
    '0px 22px 48px rgba(0, 0, 0, 0.28)',
    '0px 24px 52px rgba(0, 0, 0, 0.30)',
    '0px 26px 56px rgba(0, 0, 0, 0.32)',
    '0px 28px 60px rgba(0, 0, 0, 0.34)',
    '0px 30px 64px rgba(0, 0, 0, 0.36)',
    '0px 32px 68px rgba(0, 0, 0, 0.38)',
    '0px 34px 72px rgba(0, 0, 0, 0.40)',
    '0px 36px 76px rgba(0, 0, 0, 0.42)',
    '0px 38px 80px rgba(0, 0, 0, 0.44)',
    '0px 40px 84px rgba(0, 0, 0, 0.46)',
    '0px 42px 88px rgba(0, 0, 0, 0.48)',
    '0px 44px 92px rgba(0, 0, 0, 0.50)',
    '0px 46px 96px rgba(0, 0, 0, 0.52)',
    '0px 48px 100px rgba(0, 0, 0, 0.54)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: THEME_CONFIG.borderRadius,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: THEME_CONFIG.shadow,
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: THEME_CONFIG.borderRadius,
          boxShadow: THEME_CONFIG.shadow,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: THEME_CONFIG.borderRadius,
        },
      },
    },
  },
});
