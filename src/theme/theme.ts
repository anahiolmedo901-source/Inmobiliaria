import { colorTokens, type ThemeMode, type ColorTokens } from './colors';

export type AppTheme = ColorTokens & {
  mode: ThemeMode;
  fonts: {
    displayLg: { fontSize: number; lineHeight: number; fontWeight: 400; fontFamily: string };
    headlineLg: { fontSize: number; lineHeight: number; fontWeight: 400; fontFamily: string };
    headlineMd: { fontSize: number; lineHeight: number; fontWeight: 400; fontFamily: string };
    headlineSm: { fontSize: number; lineHeight: number; fontWeight: 400; fontFamily: string };
    bodyLg: { fontSize: number; lineHeight: number; fontWeight: 400; fontFamily: string };
    bodyMd: { fontSize: number; lineHeight: number; fontWeight: 400; fontFamily: string };
    labelMd: { fontSize: number; lineHeight: number; fontWeight: 600; fontFamily: string; letterSpacing: number };
  };
  spacing: {
    unit: number;
    gutter: number;
    sectionPadding: number;
    marginMobile: number;
    marginDesktop: number;
    containerMax: number;
  };
  rounded: {
    sm: number;
    DEFAULT: number;
    lg: number;
    xl: number;
    full: number;
  };
};

export function getTheme(mode: ThemeMode): AppTheme {
  return {
    mode,
    ...colorTokens[mode],
    fonts: {
      displayLg: { fontSize: 64, lineHeight: 70, fontWeight: 400 as const, fontFamily: 'Libre Caslon Text' },
      headlineLg: { fontSize: 48, lineHeight: 58, fontWeight: 400 as const, fontFamily: 'Libre Caslon Text' },
      headlineMd: { fontSize: 32, lineHeight: 42, fontWeight: 400 as const, fontFamily: 'Libre Caslon Text' },
      headlineSm: { fontSize: 24, lineHeight: 34, fontWeight: 400 as const, fontFamily: 'Libre Caslon Text' },
      bodyLg: { fontSize: 18, lineHeight: 29, fontWeight: 400 as const, fontFamily: 'Hanken Grotesk' },
      bodyMd: { fontSize: 16, lineHeight: 26, fontWeight: 400 as const, fontFamily: 'Hanken Grotesk' },
      labelMd: { fontSize: 14, lineHeight: 14, fontWeight: 600 as const, fontFamily: 'Hanken Grotesk', letterSpacing: 0.7 },
    },
    spacing: {
      unit: 8,
      gutter: 24,
      sectionPadding: 120,
      marginMobile: 20,
      marginDesktop: 64,
      containerMax: 1280,
    },
    rounded: {
      sm: 2,
      DEFAULT: 4,
      lg: 8,
      xl: 12,
      full: 9999,
    },
  };
}
