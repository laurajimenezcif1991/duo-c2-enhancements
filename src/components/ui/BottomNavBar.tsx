/**
 * BottomNavBar — Smart Terminal Glass 2.0
 * Figma: o6lUHeoCNpJgcCg2dpzBil node 11066:10769
 *
 * The black OS navigation bar fixed at the very bottom of every screen.
 * Matches the Android navigation bar with three gesture/button targets:
 *
 *   ◁  Back    — navigates to the previous screen
 *   ○  Home    — returns to the Launcher home screen
 *   □  Recent  — shows recent apps
 *
 * Dimensions: full-width × 49 px (fixed; no device scaling applied).
 * Background: always #000000.
 * Icon color: #E6E6E6 (Neutrals/300) — lighter than pure white for contrast.
 *
 * Usage:
 *   <BottomNavBar />
 *   <BottomNavBar onBack={navigation.goBack} onHome={handleHome} />
 *   <BottomNavBar showRecent={false} />
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Icon } from './Icon';

export type BottomNavBarProps = {
  onBack?:     () => void;
  onHome?:     () => void;
  onRecent?:   () => void;
  showRecent?: boolean;
  style?:      ViewStyle;
};

const BAR_H    = 49;
const ICON_CLR = '#E6E6E6';
const HIT      = { top: 8, bottom: 8, left: 16, right: 16 };

export function BottomNavBar({
  onBack,
  onHome,
  onRecent,
  showRecent = true,
  style,
}: BottomNavBarProps) {
  return (
    <View style={[styles.bar, style]}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={HIT}
        accessibilityLabel="Back"
        accessibilityRole="button"
        style={styles.btn}
      >
        <Icon name="nav-back" size={14} color={ICON_CLR} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onHome}
        hitSlop={HIT}
        accessibilityLabel="Home"
        accessibilityRole="button"
        style={styles.btn}
      >
        <Icon name="nav-home" size={15} color={ICON_CLR} />
      </TouchableOpacity>

      {showRecent && (
        <TouchableOpacity
          onPress={onRecent}
          hitSlop={HIT}
          accessibilityLabel="Recent apps"
          accessibilityRole="button"
          disabled={!onRecent}
          style={[styles.btn, !onRecent && styles.inactive]}
        >
          <Icon
            name="nav-recent"
            size={13}
            color={onRecent ? ICON_CLR : 'rgba(230,230,230,0.4)'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width:           '100%',
    height:          BAR_H,
    backgroundColor: '#000000',
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             112,
    paddingHorizontal: 164,
  },
  btn: {
    alignItems:     'center',
    justifyContent: 'center',
    padding:        8,
  },
  inactive: {
    opacity: 0.35,
  },
});
