/**
 * Typography Tokens — Smart Terminal Glass 2.0
 *
 * Source: Figma "Smart Terminal Glass 2.0" (o6lUHeoCNpJgcCg2dpzBil)
 *   node-id 1292-36535 — New Styles Typography page
 *
 * Font families map to loaded OTF identifiers registered via useFonts().
 * Raw px values are stored here — apply scale() from devices.ts at the
 * component level for screen-adaptive sizing.
 *
 * Last synced: March 2026
 */

import { TextStyle } from 'react-native';

// ─── Font Families ────────────────────────────────────────────────────────────
export const FontFamily = {
  /** GD Sherpa Variable — Display weight (Regular 400) */
  displayRegular: 'GDSherpaDisplay-Regular',
  /** GD Sherpa Variable — Display weight (Medium 500) */
  displayMedium: 'GDSherpaDisplay-Medium',
  /** GD Sherpa Variable — Text weight (Regular 400) */
  textRegular: 'GDSherpaText-Regular',
  /** GD Sherpa Variable — Text weight (Medium 500) */
  textMedium: 'GDSherpaText-Medium',
  /** GD Sherpa Variable — Text weight (Bold 700) */
  textBold: 'GDSherpaText-Bold',
} as const;

// ─── Font Weights ─────────────────────────────────────────────────────────────
export const FontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
} as const;

// ─── Font Sizes (raw px from Figma) ──────────────────────────────────────────
// Apply scale() from devices.ts when consuming inside components.
export const FontSize = {
  // Display scale
  displayXXL: 96,
  displayXL:  72,
  displayLG:  64,
  displayMD:  56,
  // Heading scale
  heading3XL: 40,
  heading2XL: 36,
  headingXL:  32,
  headingLG:  30,
  headingMD:  28,
  headingSM:  24,
  headingXS:  20,
  headingXXS: 18,
  // Body scale
  bodyXL: 40,
  bodyLG: 24,
  bodyMD: 20,
  bodySM: 18,
  bodyXS: 16,
  // Label Caps
  labelLG: 32,
  labelMD: 24,
  labelSM: 14,
} as const;

// ─── Line Heights ─────────────────────────────────────────────────────────────
export const LineHeight = {
  /** Tight 120% — Display, Heading, Label Caps, Body XL */
  tight:  1.2,
  /** Normal 150% — Body LG → XS */
  normal: 1.5,
} as const;

// ─── Letter Spacing ───────────────────────────────────────────────────────────
export const LetterSpacing = {
  normal: 0,
  /** Body XL condensed */
  condensed: -2,
} as const;

// ─── Pre-built TextStyle presets ──────────────────────────────────────────────
// Use directly in StyleSheet.create(). Font sizes here are NOT scaled —
// wrap in scale(FontSize.X) from devices.ts where adaptive sizing is needed.
export const TextStyles = {

  // ── Display ──────────────────────────────────────────────────────────────
  displayXXL: {
    fontFamily: FontFamily.displayRegular,
    fontSize: FontSize.displayXXL,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.displayXXL * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  displayXL: {
    fontFamily: FontFamily.displayRegular,
    fontSize: FontSize.displayXL,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.displayXL * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  displayLG: {
    fontFamily: FontFamily.displayRegular,
    fontSize: FontSize.displayLG,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.displayLG * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  displayMD: {
    fontFamily: FontFamily.displayRegular,
    fontSize: FontSize.displayMD,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.displayMD * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  // ── Heading ───────────────────────────────────────────────────────────────
  heading3XL: {
    fontFamily: FontFamily.textMedium,
    fontSize: FontSize.heading3XL,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.heading3XL * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  heading2XL: {
    fontFamily: FontFamily.textMedium,
    fontSize: FontSize.heading2XL,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.heading2XL * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  headingXL: {
    fontFamily: FontFamily.textMedium,
    fontSize: FontSize.headingXL,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.headingXL * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  headingLG: {
    fontFamily: FontFamily.textMedium,
    fontSize: FontSize.headingLG,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.headingLG * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  headingMD: {
    fontFamily: FontFamily.textMedium,
    fontSize: FontSize.headingMD,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.headingMD * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  headingSM: {
    fontFamily: FontFamily.textMedium,
    fontSize: FontSize.headingSM,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.headingSM * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  headingXS: {
    fontFamily: FontFamily.textMedium,
    fontSize: FontSize.headingXS,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.headingXS * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  headingXXS: {
    fontFamily: FontFamily.textMedium,
    fontSize: FontSize.headingXXS,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.headingXXS * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  // ── Body ──────────────────────────────────────────────────────────────────
  bodyXL: {
    fontFamily: FontFamily.textMedium,
    fontSize: FontSize.bodyXL,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.bodyXL * LineHeight.tight,
    letterSpacing: LetterSpacing.condensed,
  } satisfies TextStyle,

  bodyLG: {
    fontFamily: FontFamily.textRegular,
    fontSize: FontSize.bodyLG,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.bodyLG * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  bodyMD: {
    fontFamily: FontFamily.textRegular,
    fontSize: FontSize.bodyMD,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.bodyMD * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  bodySM: {
    fontFamily: FontFamily.textRegular,
    fontSize: FontSize.bodySM,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.bodySM * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  bodyXS: {
    fontFamily: FontFamily.textRegular,
    fontSize: FontSize.bodyXS,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.bodyXS * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  // ── Label Caps ────────────────────────────────────────────────────────────
  labelLG: {
    fontFamily: FontFamily.textBold,
    fontSize: FontSize.labelLG,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.labelLG * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
    textTransform: 'uppercase',
  } satisfies TextStyle,

  labelMD: {
    fontFamily: FontFamily.textBold,
    fontSize: FontSize.labelMD,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.labelMD * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
    textTransform: 'uppercase',
  } satisfies TextStyle,

  labelSM: {
    fontFamily: FontFamily.textBold,
    fontSize: FontSize.labelSM,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.labelSM * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
    textTransform: 'uppercase',
  } satisfies TextStyle,

} as const;
