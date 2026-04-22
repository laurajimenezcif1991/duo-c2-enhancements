/**
 * Spacing Tokens — Smart Terminal Glass 2.0
 *
 * Source: Figma "Smart Terminal Glass 2.0" (o6lUHeoCNpJgcCg2dpzBil)
 *   node-id 2745-10623 — Spacing page
 *
 * Raw pixel values from Figma. Apply scaleW() from devices.ts for
 * screen-adaptive dimensions in components.
 *
 * Two access styles:
 *   Numeric key:  Spacing[16], Spacing[32]
 *   Named alias:  Spacing.xxs, Spacing.sm, Spacing.xxl
 *
 * Last synced: March 2026
 */

// ─── Stack spacing — all 18 steps ────────────────────────────────────────────
export const Spacing = {
  // Numeric keys (match Figma "spacing-stack-N" tokens)
  0:   0,
  4:   4,
  6:   6,
  8:   8,
  12:  12,
  16:  16,
  20:  20,
  24:  24,
  32:  32,
  40:  40,
  48:  48,
  56:  56,
  64:  64,
  72:  72,
  80:  80,
  96:  96,
  112: 112,
  128: 128,

  // Named aliases (from Figma component descriptions XXXS → GIANT)
  none:     0,
  xxxs:     8,
  xxs:      16,
  xs:       24,
  sm:       32,
  md:       40,
  lg:       48,
  xl:       56,
  xxl:      64,
  xxxl:     80,
  big:      96,
  ultraBig: 120,
  huge:     160,
  giant:    200,
} as const;

export type SpacingKey = keyof typeof Spacing;

// ─── Border radius ────────────────────────────────────────────────────────────
// Extracted from Figma component usage across the design system.
export const Radius = {
  none:  0,
  xs:    4,
  sm:    6,
  md:    8,
  lg:    12,
  xl:    16,
  xxl:   24,
  full:  9999,
} as const;

export type RadiusKey = keyof typeof Radius;
