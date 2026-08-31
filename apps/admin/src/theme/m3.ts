import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
  Theme as M3Theme,
} from '@material/material-color-utilities';

export const PRIMARY_SEED = '#E04F26';
export const SECONDARY_SEED = '#F4ECE5';

export interface M3ThemeColors {
  primary: string;
  'on-primary': string;
  'primary-container': string;
  'on-primary-container': string;
  secondary: string;
  'on-secondary': string;
  'secondary-container': string;
  'on-secondary-container': string;
  tertiary: string;
  'on-tertiary': string;
  'tertiary-container': string;
  'on-tertiary-container': string;
  error: string;
  'on-error': string;
  'error-container': string;
  'on-error-container': string;
  background: string;
  'on-background': string;
  surface: string;
  'on-surface': string;
  'surface-variant': string;
  'on-surface-variant': string;
  outline: string;
  'outline-variant': string;
  'surface-container-lowest': string;
  'surface-container-low': string;
  'surface-container': string;
  'surface-container-high': string;
  'surface-container-highest': string;
  'surface-bright': string;
  'surface-dim': string;
  [key: string]: string;
}

const extractScheme = (scheme: any, isDark: boolean): M3ThemeColors => {
  return {
    primary: hexFromArgb(scheme.primary),
    'on-primary': hexFromArgb(scheme.onPrimary),
    'primary-container': hexFromArgb(scheme.primaryContainer),
    'on-primary-container': hexFromArgb(scheme.onPrimaryContainer),
    secondary: hexFromArgb(scheme.secondary),
    'on-secondary': hexFromArgb(scheme.onSecondary),
    'secondary-container': hexFromArgb(scheme.secondaryContainer),
    'on-secondary-container': hexFromArgb(scheme.onSecondaryContainer),
    tertiary: hexFromArgb(scheme.tertiary),
    'on-tertiary': hexFromArgb(scheme.onTertiary),
    'tertiary-container': hexFromArgb(scheme.tertiaryContainer),
    'on-tertiary-container': hexFromArgb(scheme.onTertiaryContainer),
    error: hexFromArgb(scheme.error),
    'on-error': hexFromArgb(scheme.onError),
    'error-container': hexFromArgb(scheme.errorContainer),
    'on-error-container': hexFromArgb(scheme.onErrorContainer),
    background: isDark ? '#14120D' : '#FDF8F4',
    'on-background': hexFromArgb(scheme.onBackground),
    surface: isDark ? '#1C1914' : '#FFFBF8',
    'on-surface': hexFromArgb(scheme.onSurface),
    'surface-variant': hexFromArgb(scheme.surfaceVariant),
    'on-surface-variant': hexFromArgb(scheme.onSurfaceVariant),
    outline: hexFromArgb(scheme.outline),
    'outline-variant': hexFromArgb(scheme.outlineVariant),
    'surface-container-lowest': isDark ? '#100E0A' : '#FFFFFF',
    'surface-container-low': isDark ? '#1A1712' : '#F7F1EB',
    'surface-container': isDark ? '#201D17' : '#F2ECE5',
    'surface-container-high': isDark ? '#26231C' : '#EDE6DF',
    'surface-container-highest': isDark ? '#312D26' : '#E7E0D8',
    'surface-bright': isDark ? '#3A362E' : '#FFFBF8',
    'surface-dim': isDark ? '#14120D' : '#DED7D0',
  };
};

export const generateM3Palettes = (
  seed: string = PRIMARY_SEED
): { light: M3ThemeColors; dark: M3ThemeColors; m3Raw: M3Theme } => {
  const argb = argbFromHex(seed);
  const m3Theme = themeFromSourceColor(argb, [
    {
      name: 'brandSecondary',
      value: argbFromHex(SECONDARY_SEED),
      blend: true,
    },
  ]);

  return {
    light: extractScheme(m3Theme.schemes.light, false),
    dark: extractScheme(m3Theme.schemes.dark, true),
    m3Raw: m3Theme,
  };
};

export const { light: m3LightColors, dark: m3DarkColors } = generateM3Palettes();
