/**
 * RegisterBottomBar — Register App
 *
 * Figma: Smart Terminal Glass 2.0
 *   - Bottom Bar Buttons Pattern:  node 3473:3103
 *   - Bottom Bar Pattern:          node 3473:3107
 *
 * Three-button row at the base of the Register screen:
 *   [CANCEL]  [CASH]  [CHARGE $0.00]
 *
 * Design specs:
 *   - Container:  bg #111, paddingVertical 16, paddingHorizontal 10, gap 6
 *   - CANCEL:     width 124, height 88, border 2px #767676, radius 6, text 20px medium white
 *   - CASH:       width 124, height 88, border 2px #767676, bg #0B3354, radius 6, text 20px medium white
 *   - CHARGE:     flex-1, height 88, bg contentPrimary (#1976D2), radius 6, padding 16
 *                 "CHARGE" label: 14px labelSM bold uppercase white
 *                 amount: 30px headingLG medium white
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ColorTokens } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';
import { Radius, Spacing } from '../../theme/spacing';

export type RegisterBottomBarProps = {
  chargeAmount?: string;
  onCancel?:     () => void;
  onCash?:       () => void;
  onCharge?:     () => void;
  cancelLabel?:  string;
  cashLabel?:    string;
  chargeLabel?:  string;
  dark?:         boolean;
  style?:        ViewStyle;
};

export function RegisterBottomBar({
  chargeAmount = '$0.00',
  onCancel,
  onCash,
  onCharge,
  cancelLabel  = 'CANCEL',
  cashLabel    = 'CASH',
  chargeLabel  = 'CHARGE',
  dark         = false,
  style,
}: RegisterBottomBarProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  return (
    <View style={[styles.bar, style]}>
      {/* ── CANCEL ── outline, no fill */}
      <TouchableOpacity
        onPress={onCancel}
        activeOpacity={0.75}
        style={[styles.btn, styles.btnFixed, styles.btnCancel]}
      >
        <Text style={styles.btnLabel}>
          {cancelLabel}
        </Text>
      </TouchableOpacity>

      {/* ── CASH ── dark navy fill */}
      <TouchableOpacity
        onPress={onCash}
        activeOpacity={0.75}
        style={[styles.btn, styles.btnFixed, styles.btnCash]}
      >
        <Text style={styles.btnLabel}>
          {cashLabel}
        </Text>
      </TouchableOpacity>

      {/* ── CHARGE ── primary blue, stacked label + amount */}
      <TouchableOpacity
        onPress={onCharge}
        activeOpacity={0.75}
        style={[styles.btn, styles.btnCharge, { backgroundColor: palette.contentPrimary }]}
      >
        <Text style={styles.chargeLabel}>
          {chargeLabel}
        </Text>
        <Text style={styles.chargeAmount}>
          {chargeAmount}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection:     'row',
    alignItems:        'stretch',
    backgroundColor:   '#111111',
    paddingVertical:   Spacing[16],
    paddingHorizontal: 10,            // Figma: 10px — not in spacing scale, use raw value
    gap:               Spacing[6],
  },
  btn: {
    height:         88,
    borderRadius:   Radius.sm,
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
  },
  btnFixed: {
    width:       124,
  },
  btnCancel: {
    borderWidth:  2,
    borderColor:  '#767676',
  },
  btnCash: {
    borderWidth:      2,
    borderColor:      '#767676',
    backgroundColor:  '#0B3354',
  },
  btnCharge: {
    flex:           1,
    alignItems:     'flex-start',
    justifyContent: 'center',
    padding:        Spacing[16],
  },
  btnLabel: {
    fontFamily: FontFamily.textMedium,
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
    color:      '#ffffff',
    textAlign:  'center',
  },
  chargeLabel: {
    fontFamily:    FontFamily.textBold,
    fontSize:      FontSize.labelSM,
    lineHeight:    FontSize.labelSM * 1.2,
    color:         '#ffffff',
    textTransform: 'uppercase',
    marginBottom:  Spacing[4],
  },
  chargeAmount: {
    fontFamily: FontFamily.textMedium,
    fontSize:   FontSize.headingLG,
    lineHeight: FontSize.headingLG * 1.2,
    color:      '#ffffff',
  },
});
