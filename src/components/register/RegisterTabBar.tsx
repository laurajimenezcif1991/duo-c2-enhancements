/**
 * RegisterTabBar — Register App
 *
 * Figma: Debit-nudge-experiment · node 34:13998 (Top bar → "Chips" row)
 *
 * Spec (from the Chips container):
 *   paddingHorizontal : 4 px
 *   paddingVertical   : 10 px
 *   backgroundColor   : bgSurface (white)
 *
 *   Each chip: flex 1 (equal share of full 600 px width), px 12, py 16
 *   Active bg : bgLight (#F6F6F6) — light grey pill
 *   Inactive  : transparent
 *   Keypad chip carries a leading card-reader-disconnected icon (24 px)
 */

import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { ColorTokens } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Chip } from '../ui/Chip';
import type { IconName } from '../ui/Icon';

// ─── Tab definitions ──────────────────────────────────────────────────────────

export type RegisterTab = 'products' | 'favorites' | 'categories' | 'keypad';

const TABS: { key: RegisterTab; label: string; icon?: IconName }[] = [
  { key: 'products',   label: 'Products'   },
  { key: 'favorites',  label: 'Favorites'  },
  { key: 'categories', label: 'Categories' },
  { key: 'keypad',     label: 'Keypad',    icon: 'card-reader-disconnected' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export type RegisterTabBarProps = {
  activeTab:   RegisterTab;
  onTabChange: (tab: RegisterTab) => void;
  dark?:       boolean;
  style?:      ViewStyle;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterTabBar({
  activeTab,
  onTabChange,
  dark  = false,
  style,
}: RegisterTabBarProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  return (
    <View
      style={[
        s.bar,
        {
          backgroundColor:  palette.bgSurface,
          borderBottomColor: palette.border,
        },
        style,
      ]}
    >
      {TABS.map(({ key, label, icon }) => (
        <Chip
          key={key}
          label={label}
          active={key === activeTab}
          icon={icon}
          onPress={() => onTabChange(key)}
          dark={dark}
          style={s.chip}
        />
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  bar: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: Spacing[4],
    paddingVertical:   10,
    borderBottomWidth: 1,
  },
  chip: {
    flex: 1,
  },
});
