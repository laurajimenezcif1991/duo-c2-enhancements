/**
 * SystemStatusBar — Smart Terminal Glass 2.0
 * Figma: o6lUHeoCNpJgcCg2dpzBil node 11066:10736
 *
 * Read-only OS status strip rendered at the very top of every screen.
 * Shows time (left) and signal/battery icons (right), mirroring the
 * Android system status bar.
 *
 * Variants:
 *   white — bgSurface background, dark text/icons  (default for Register App)
 *   black — #111 background, white text/icons      (for dark overlays)
 *
 * Dimensions: full-width × 25 px (matching Figma spec for all devices).
 *
 * Usage:
 *   <SystemStatusBar />
 *   <SystemStatusBar variant="black" time="9:41 AM" />
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { ColorTokens } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { Icon } from './Icon';

// Inline battery indicator (no SVG asset available)
function BatteryIcon({ color }: { color: string }) {
  return (
    <View style={[battStyles.outer, { borderColor: color }]}>
      <View style={[battStyles.fill, { backgroundColor: color }]} />
      <View style={[battStyles.cap, { backgroundColor: color }]} />
    </View>
  );
}
const battStyles = StyleSheet.create({
  outer: {
    width:        12,
    height:       7,
    borderWidth:  1,
    borderRadius: 1.5,
    flexDirection:'row',
    alignItems:   'center',
    paddingLeft:  1,
    paddingVertical: 1,
    position:     'relative',
  },
  fill: {
    flex:         1,
    height:       '100%',
    borderRadius: 0.5,
  },
  cap: {
    position: 'absolute',
    right:    -3,
    width:    2,
    height:   4,
    borderRadius: 1,
  },
});

export type SystemStatusBarVariant = 'white' | 'black';

export type SystemStatusBarProps = {
  /** 'white' = light surface bg + dark icons; 'black' = dark bg + light icons */
  variant?: SystemStatusBarVariant;
  /** Clock label shown on the left. Defaults to '12:30 PM'. */
  time?:    string;
  dark?:    boolean;
  style?:   ViewStyle;
};

const BAR_H = 25;
const ICON_SIZE = 15;

export function SystemStatusBar({
  variant = 'white',
  time    = '12:30 PM',
  dark    = false,
  style,
}: SystemStatusBarProps) {
  const palette   = dark ? ColorTokens.dark : ColorTokens.light;
  const isBlack   = variant === 'black';
  const bg        = isBlack ? '#111111' : palette.bgSurface;
  const textColor = isBlack ? '#FFFFFF' : palette.textPrimary;
  const iconColor = isBlack ? '#FFFFFF' : palette.textPrimary;

  return (
    <View style={[styles.bar, { backgroundColor: bg, height: BAR_H }, style]}>
      {/* Left: time */}
      <Text style={[styles.time, { color: textColor, fontFamily: FontFamily.textRegular }]}>
        {time}
      </Text>

      {/* Right: Wi-Fi + battery */}
      <View style={styles.icons}>
        <Icon name="wi-fi"   size={ICON_SIZE} color={iconColor} />
        <BatteryIcon color={iconColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width:             '100%',
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 6,
    paddingVertical:   3,
  },
  time: {
    fontSize:      14,
    lineHeight:    18,
    letterSpacing: -0.025,
  },
  icons: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
});
