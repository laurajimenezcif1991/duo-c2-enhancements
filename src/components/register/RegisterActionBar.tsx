/**
 * RegisterActionBar — Register App
 *
 * Figma: Register-App-2025
 *   Collapsed  (always visible): node 3473:3146
 *   Expanded accordion:          node 6610:117817
 *
 * Collapsed row (always visible):
 *   [✓ Tax ON]  [⊙ Discount]  [📤 Open Drawer]  [↑ FAB]
 *
 * Expanded — slides in above collapsed row:
 *   Row 1: [Customer]
 *   Row 2: [Save Order]  [$ Fee]  [✏ Add Notes]
 *   Row 3: (same as collapsed, arrow now points ↓)
 *
 * Tapping FAB toggles expand/collapse with spring animation + arrow rotation.
 */

import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { FontFamily, FontSize } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Icon } from '../ui/Icon';

// ─── Constants ────────────────────────────────────────────────────────────────

const CHIP_BG  = '#353233';
const CHIP_HIT = '#4a4748';

// Two extra rows (62 chip + 16 gap + 62 chip) that slide in when expanded
const EXPANDED_H = 62 + 16 + 62; // 140

// ─── ActionChip ───────────────────────────────────────────────────────────────

export type ActionChipState = 'default' | 'selected' | 'disabled';

export type ActionChipProps = {
  label:     string;
  iconName?: string;
  state?:    ActionChipState;
  flex?:     boolean;
  onPress?:  () => void;
  style?:    ViewStyle;
};

export function ActionChip({
  label,
  iconName,
  state   = 'default',
  flex    = false,
  onPress,
  style,
}: ActionChipProps) {
  const isDisabled = state === 'disabled';
  const isSelected = state === 'selected';
  const baseBg     = isDisabled ? '#afafaf' : isSelected ? '#767676' : CHIP_BG;
  const textColor  = isDisabled ? '#767676' : '#ffffff';

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        s.chip,
        { backgroundColor: pressed && !isDisabled ? CHIP_HIT : baseBg },
        flex && s.chipFlex,
        style,
      ]}
    >
      {iconName && <Icon name={iconName as any} size={24} color={textColor} />}
      <Text style={[s.chipLabel, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

// ─── RegisterActionBar ────────────────────────────────────────────────────────

export type RegisterActionBarProps = {
  taxEnabled?:   boolean;
  onTaxToggle?:  () => void;
  onDiscount?:   () => void;
  onOpenDrawer?: () => void;
  onFee?:        () => void;
  onAddNotes?:   () => void;
  onCustomer?:   () => void;
  onSaveOrder?:  () => void;
  showDrawer?:   boolean;
  dark?:         boolean;
  style?:        ViewStyle;
};

export function RegisterActionBar({
  taxEnabled   = true,
  onTaxToggle,
  onDiscount,
  onOpenDrawer,
  onFee,
  onAddNotes,
  onCustomer,
  onSaveOrder,
  showDrawer   = true,
  dark         = false,
  style,
}: RegisterActionBarProps) {
  const [expanded, setExpanded] = useState(false);

  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    Animated.parallel([
      Animated.spring(heightAnim, {
        toValue, useNativeDriver: false,
        damping: 28, stiffness: 260, mass: 0.9,
      }),
      Animated.spring(rotateAnim, {
        toValue, useNativeDriver: true,
        damping: 28, stiffness: 260, mass: 0.9,
      }),
    ]).start();
    setExpanded(v => !v);
  };

  const expandedHeight = heightAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, EXPANDED_H],
  });

  const arrowRotate = rotateAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[s.bar, style]}>

      {/* ── Expandable rows (slides in above collapsed row) ─────────────── */}
      <Animated.View style={{ height: expandedHeight, overflow: 'hidden' }}>
        <View style={s.expandedInner}>

          {/* Row 1: Customer */}
          <View style={s.row}>
            <ActionChip label="Customer" iconName="user-add" onPress={onCustomer} />
          </View>

          {/* Row 2: Save Order | Fee | Add Notes */}
          <View style={s.row}>
            <ActionChip label="Save Order" iconName="save"       onPress={onSaveOrder} />
            <ActionChip label="Fee"        iconName="dollar-24"  flex onPress={onFee} />
            <ActionChip label="Add Notes"  iconName="draw-24"    flex onPress={onAddNotes} />
          </View>

        </View>
      </Animated.View>

      {/* ── Collapsed row (always visible) ──────────────────────────────── */}
      <View style={s.row}>

        {/* Tax toggle */}
        <Pressable
          onPress={onTaxToggle}
          style={({ pressed }) => [s.chip, s.chipFlex, { backgroundColor: pressed ? CHIP_HIT : CHIP_BG }]}
        >
          <Icon
            name={taxEnabled ? 'ok-filled' : 'checkmark'}
            size={24}
            color={taxEnabled ? '#4CAF50' : '#ffffff'}
          />
          <Text style={s.chipLabel}>Tax {taxEnabled ? 'ON' : 'OFF'}</Text>
        </Pressable>

        {/* Discount */}
        <ActionChip label="Discount" iconName="discount-reg" flex onPress={onDiscount} />

        {/* Open Drawer */}
        {showDrawer && (
          <ActionChip label="Open Drawer" iconName="drawer" flex onPress={onOpenDrawer} />
        )}

        {/* FAB — rotates ↑ (collapsed) ↓ (expanded) */}
        <TouchableOpacity onPress={toggle} style={s.fab} activeOpacity={0.75}>
          <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
            <Icon name="arrow-up-reg" size={24} color="#ffffff" />
          </Animated.View>
        </TouchableOpacity>
      </View>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  bar: {
    backgroundColor:   '#111111',
    paddingTop:        Spacing[16],
    paddingHorizontal: 10,
    gap:               Spacing[16],
    paddingBottom:     0,
  },
  expandedInner: {
    gap:           Spacing[16],
    paddingBottom: Spacing[16],
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[6],
  },
  chip: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'center',
    height:            62,
    borderRadius:      100,
    paddingHorizontal: Spacing[16],
    paddingVertical:   7,
    gap:               Spacing[6],
  },
  chipFlex: {
    flex: 1,
  },
  chipLabel: {
    fontFamily: FontFamily.textMedium,
    fontSize:   FontSize.headingXXS,
    lineHeight: FontSize.headingXXS * 1.2,
    color:      '#ffffff',
    textAlign:  'center',
  },
  fab: {
    width:           62,
    height:          62,
    borderRadius:    100,
    backgroundColor: CHIP_BG,
    alignItems:      'center',
    justifyContent:  'center',
  },
});
