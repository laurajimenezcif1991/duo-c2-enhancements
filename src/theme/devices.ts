/**
 * Device Context Tokens — Smart Terminal Glass 2.0
 *
 * Defines the three Smart Terminal device families and provides
 * per-device scaling utilities so a single component tree renders
 * correctly on any terminal without manual pixel math.
 *
 * Devices:
 *   Pro      1440 × 900   — swivel-screen countertop (original baseline)
 *   Flex      540 × 1080  — portable handheld POS
 *   DuoC1    600 × 912    — dual-screen countertop, operator display
 *   DuoC2    600 × 360    — dual-screen countertop, customer-facing screen
 *
 * Usage:
 *   import { useDeviceScale } from '../theme';
 *   const { scale, scaleW, scaleH } = useDeviceScale();
 *   fontSize: scale(FontSize.bodyMD),
 *   paddingHorizontal: scaleW(Spacing.lg),
 */

import { Dimensions } from 'react-native';

// ─── Device specifications ────────────────────────────────────────────────────

export enum DeviceContext {
  Pro   = 'Pro',
  Flex  = 'Flex',
  DuoC1 = 'DuoC1',
  DuoC2 = 'DuoC2',
}

export type DeviceSpec = {
  id:          DeviceContext;
  label:       string;
  baseWidth:   number;
  baseHeight:  number;
  description: string;
};

export const Devices: Record<DeviceContext, DeviceSpec> = {
  [DeviceContext.Pro]: {
    id:          DeviceContext.Pro,
    label:       'Pro',
    baseWidth:   1440,
    baseHeight:  900,
    description: 'High-performance swivel-screen countertop POS · 1440 × 900',
  },
  [DeviceContext.Flex]: {
    id:          DeviceContext.Flex,
    label:       'Flex',
    baseWidth:   540,
    baseHeight:  1080,
    description: 'Portable handheld POS — tableside, curbside, pop-ups · 540 × 1080',
  },
  [DeviceContext.DuoC1]: {
    id:          DeviceContext.DuoC1,
    label:       'Duo (Main)',
    baseWidth:   600,
    baseHeight:  912,
    description: 'Dual-screen countertop — operator-facing main display · 600 × 912',
  },
  [DeviceContext.DuoC2]: {
    id:          DeviceContext.DuoC2,
    label:       'Duo (Customer)',
    baseWidth:   600,
    baseHeight:  360,
    description: 'Dual-screen countertop — customer-facing display · 600 × 360',
  },
};

// ─── Runtime window dimensions ────────────────────────────────────────────────

const { width: WIN_W, height: WIN_H } = Dimensions.get('window');

// ─── Scale utilities type ─────────────────────────────────────────────────────

export type ScaleUtils = {
  /** Scale a horizontal/width value from the device baseline */
  scaleW: (n: number) => number;
  /** Scale a vertical/height value from the device baseline */
  scaleH: (n: number) => number;
  /** General scale using the width ratio — use for font sizes */
  scale:  (n: number) => number;
  /** Pre-scaled spacing shorthand: spacing(Spacing.lg) → number */
  spacing: (value: number) => number;
  /** The device spec used to build these utilities */
  device: DeviceSpec;
};

// ─── Scaling factory ──────────────────────────────────────────────────────────

export function createScaleUtils(context: DeviceContext = DeviceContext.Pro): ScaleUtils {
  const device   = Devices[context];
  const scaleW   = (n: number) => (WIN_W / device.baseWidth)  * n;
  const scaleH   = (n: number) => (WIN_H / device.baseHeight) * n;
  const scale    = scaleW;
  const spacing  = scaleW;
  return { scaleW, scaleH, scale, spacing, device };
}

// ─── Backward-compatible Pro-baseline exports ─────────────────────────────────
// These match the original theme.ts scaleW / scaleH / scale functions exactly,
// so existing code that imports from theme/theme.ts continues to work via the
// barrel shim in index.ts.

const _pro = createScaleUtils(DeviceContext.Pro);
export const scaleW = _pro.scaleW;
export const scaleH = _pro.scaleH;
export const scale  = _pro.scale;

// ─── useDeviceScale hook ──────────────────────────────────────────────────────
// Resolves the device context from the current window dimensions.
// Pass an explicit `override` to force a specific device (e.g. in tests).

export function useDeviceScale(override?: DeviceContext): ScaleUtils {
  if (override) return createScaleUtils(override);

  const w = WIN_W;
  const h = WIN_H;

  if (w <= 560)              return createScaleUtils(DeviceContext.Flex);
  if (w <= 620 && h <= 380)  return createScaleUtils(DeviceContext.DuoC2);
  if (w <= 620)              return createScaleUtils(DeviceContext.DuoC1);
  return createScaleUtils(DeviceContext.Pro);
}
