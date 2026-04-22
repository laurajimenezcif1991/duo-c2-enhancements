/**
 * RegisterBottomBarTotal — Register App
 *
 * Figma: Smart Terminal Glass 2.0 — node 3473:3115
 *
 * Two-row summary panel shown above the action chips when an order is in progress:
 *   ┌─────────────────────────────┐  ← white (bgSurface)
 *   │ Subtotal            $0.00   │
 *   ├─────────────────────────────┤  ← light gray (bgLight)
 *   │ ⓘ Tax  [toggle]    +$0.00  │
 *   └─────────────────────────────┘
 *
 * Design specs:
 *   - Subtotal row:  bg white, px 16, py 24, heading 20px medium, textPrimary
 *   - Tax row:       bg bgLight (#F6F6F6), border-top border, px 16, py 24, heading 20px medium
 *   - Tax toggle:    teal/green when enabled, grey when disabled
 */

import React from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ColorTokens } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Icon } from '../ui/Icon';

export type RegisterBottomBarTotalProps = {
  subtotal?:    string;
  tax?:         string;
  taxEnabled?:  boolean;
  onTaxToggle?: () => void;
  dark?:        boolean;
  style?:       ViewStyle;
};

export function RegisterBottomBarTotal({
  subtotal    = '0.00',
  tax         = '0.00',
  taxEnabled  = true,
  onTaxToggle,
  dark        = false,
  style,
}: RegisterBottomBarTotalProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  return (
    <View style={[styles.container, style]}>
      {/* ── Subtotal row ───────────────────────────────────────────────────── */}
      <View style={[styles.row, { backgroundColor: palette.bgSurface }]}>
        <Text style={[styles.rowLabel, { color: palette.textPrimary }]}>
          Subtotal
        </Text>
        <Text style={[styles.rowValue, { color: palette.textPrimary }]}>
          ${subtotal}
        </Text>
      </View>

      {/* ── Tax row ────────────────────────────────────────────────────────── */}
      <View
        style={[
          styles.row,
          styles.taxRow,
          {
            backgroundColor: palette.bgLight,
            borderTopColor:  palette.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onTaxToggle}
          style={styles.taxLeft}
          activeOpacity={0.75}
        >
          <Icon name="info" size={20} color={palette.textSecondary} />
          <Text style={[styles.rowLabel, { color: palette.textPrimary }]}>
            Tax
          </Text>
          <Switch
            value={taxEnabled}
            onValueChange={onTaxToggle}
            trackColor={{ false: palette.contentTertiary, true: '#00BFBF' }}
            thumbColor="#ffffff"
            style={styles.toggle}
          />
        </TouchableOpacity>

        <Text style={[styles.rowValue, { color: palette.textPrimary }]}>
          {taxEnabled ? `+$${tax}` : `$${tax}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  row: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical:  Spacing[24],
  },
  taxRow: {
    borderTopWidth: 1,
  },
  rowLabel: {
    fontFamily: FontFamily.textMedium,
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
  },
  rowValue: {
    fontFamily: FontFamily.textMedium,
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
  },
  taxLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[16],
  },
  toggle: {
    transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
  },
});
