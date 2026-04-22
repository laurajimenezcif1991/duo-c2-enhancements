/**
 * Color Tokens — Smart Terminal Glass 2.0
 *
 * Source: Figma "Smart Terminal Glass 2.0" (o6lUHeoCNpJgcCg2dpzBil)
 *   node-id 1213-46974 — Colors page
 *
 * Each group has a `light` and `dark` variant so components can
 * select the correct palette at render time via the current device theme.
 *
 * Last synced: March 2026
 */

// ─── Content Colors ───────────────────────────────────────────────────────────
// Used for interactive elements, icons, highlights.
// Source: Deep Sea + Everyday Blue (Teal) palettes.
export const ContentColors = {
  light: {
    /** Deep Sea 400 — primary interactive / brand blue */
    contentPrimary: '#1976D2',
    /** Deep Sea 700 — secondary interactive, darker */
    contentSecondary: '#0B3354',
    /** Tech Gray 400 — tertiary / muted */
    contentTertiary: '#767676',
    /** Everyday Blue (Teal) 500 — teal accent */
    contentAccent1: '#00A4A6',
    /** Everyday Blue (Teal) 300 — lighter teal */
    contentAccent2: '#61EDEA',
    /** Everyday Blue (Teal) 200 — softest teal */
    contentAccent3: '#B6FAF5',
  },
  dark: {
    contentPrimary: '#145FA9',
    contentSecondary: '#0B3354',
    contentTertiary: '#F5F5F5',
    contentAccent1: '#1BDBDB',
    contentAccent2: '#61EDEA',
    contentAccent3: '#A6FFF8',
  },
} as const;

// ─── Background & Border Colors ───────────────────────────────────────────────
// Source: Monochrome + Tech Gray + Everyday Blue palettes.
export const BackgroundColors = {
  light: {
    /** Monochrome Cash Black — page/app background */
    bgBase: '#111111',
    /** Monochrome Space White — card/surface background */
    bgSurface: '#FFFFFF',
    /** Neutral light background */
    bgLight: '#F6F6F6',
    /** Tech Gray 150 — elevated surface, level-1 container */
    bgLevel1: '#E5E5E5',
    /** Everyday Blue 100 — teal-tinted accent surface */
    bgAccent: '#D8EFEF',
    /** Tech Gray 150 — default border / divider */
    border: '#E5E5E5',
    /** Tech Gray 400 — disabled state border */
    borderDisabled: '#767676',
  },
  dark: {
    bgBase: '#2B2B2B',
    bgSurface: '#111111',
    bgLight: '#272727',
    bgLevel1: '#444444',
    bgAccent: '#09757A',
    border: '#F5F5F5',
    borderDisabled: '#767676',
  },
} as const;

// ─── Text Colors ──────────────────────────────────────────────────────────────
// Source: Monochrome + Tech Gray palettes.
export const TextColors = {
  light: {
    /** Monochrome Cash Black — primary body text */
    textPrimary: '#111111',
    /** Tech Gray 500 — secondary / supporting text */
    textSecondary: '#5E5E5E',
    /** Monochrome Space White — text on colored/dark backgrounds */
    textOnColour1: '#FFFFFF',
    /** Everyday Blue Teal — text on accent surfaces */
    textOnColour2: '#09757A',
  },
  dark: {
    textPrimary: '#FFFFFF',
    textSecondary: '#D6D6D6',
    textOnColour1: '#111111',
    textOnColour2: '#D8EFEF',
  },
} as const;

// ─── Semantic Colors ──────────────────────────────────────────────────────────
// Used for feedback states: success, caution, warning, critical, neutral.
export const SemanticColors = {
  light: {
    /** Success Green — confirmation banners, checkmarks */
    success: '#00A63F',
    successSubdued: 'rgba(0, 166, 63, 0.10)',
    /** Joyous Yellow — attention / caution indicators */
    caution: '#FED317',
    cautionSubdued: 'rgba(254, 211, 23, 0.20)',
    /** Warning Yellow — important notice */
    warning: '#DE7C00',
    warningSubdued: 'rgba(222, 124, 0, 0.10)',
    /** Critical Red — error / destructive actions */
    critical: '#DB1802',
    criticalSubdued: 'rgba(219, 24, 2, 0.10)',
    /** Tech Gray 300 — neutral / inactive state */
    neutral: '#AFAFAF',
    neutralSubdued: 'rgba(175, 175, 175, 0.20)',
  },
  dark: {
    success: '#00782E',
    successSubdued: 'rgba(0, 120, 46, 0.30)',
    caution: '#DEB812',
    cautionSubdued: 'rgba(199, 165, 15, 0.30)',
    warning: '#AA6D00',
    warningSubdued: 'rgba(170, 109, 0, 0.30)',
    critical: '#AE1302',
    criticalSubdued: 'rgba(174, 19, 2, 0.30)',
    neutral: '#6F6F6F',
    neutralSubdued: 'rgba(111, 111, 111, 0.30)',
  },
} as const;

// ─── Convenience flat export (light mode default) ─────────────────────────────
// Use in StyleSheet.create() when you don't need dynamic theming.
export const Colors = {
  ...ContentColors.light,
  ...BackgroundColors.light,
  ...TextColors.light,
  ...SemanticColors.light,
} as const;

// Full token map indexed by mode — use with useColorScheme() or device context
export const ColorTokens = {
  light: {
    ...ContentColors.light,
    ...BackgroundColors.light,
    ...TextColors.light,
    ...SemanticColors.light,
  },
  dark: {
    ...ContentColors.dark,
    ...BackgroundColors.dark,
    ...TextColors.dark,
    ...SemanticColors.dark,
  },
} as const;

export type ColorMode = 'light' | 'dark';
export type ColorKey = keyof typeof ColorTokens.light;
