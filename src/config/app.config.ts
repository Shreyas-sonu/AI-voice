// Application Configuration
export const APP_CONFIG = {
  name: 'VoxFlow',
  tagline: 'Voice AI Platform',
  description: 'Build, deploy, and manage intelligent voice agents',
  version: '1.0.0',
  author: 'VoxFlow Team',
} as const;

export const THEME_CONFIG = {
  primary: '#0A84FF',
  secondary: '#30D158',
  accent: '#FF9F0A',
  error: '#FF453A',
  warning: '#FFD60A',
  info: '#64D2FF',
  success: '#30D158',
  background: {
    default: '#F2F2F7',
    paper: '#FFFFFF',
    dark: '#1C1C1E',
  },
  text: {
    primary: 'rgba(28, 28, 30, 0.87)',
    secondary: 'rgba(28, 28, 30, 0.60)',
    disabled: 'rgba(28, 28, 30, 0.38)',
  },
  shadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
  borderRadius: 12,
} as const;
