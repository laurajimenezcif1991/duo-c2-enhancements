/**
 * RegisterActionBar — Register App
 *
 * Figma: Smart Terminal Glass 2.0
 *   - Chips (individual):       node 3591:4462
 *   - Bottom Actions Pattern:   node 3473:3146
 *
 * Renders the row of action chips above the main button bar:
 *   [✓ Tax ON]  [⊙ Discount]  [📤 Open Drawer]  [↑]
 *
 * Design specs:
 *   - Container:  bg #111, paddingTop 16, paddingHorizontal 10, gap 6
 *   - Chip:       bg #353233, height 62, borderRadius 100, NO border
 *                 paddingHorizontal 16, paddingVertical 7
 *                 icon 24px + text 18px TextMedium white
 *   - FAB:        62×62 circle, bg #353233, arrow-up icon
 *   - Tax chip:   ok-filled icon (green circle checkmark) when taxEnabled=true
 *                 grey circle when taxEnabled=false
 */

import React from 'react';
import {
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

// Chip background is always dark (#353233) — it's a Figma component-level token
// equivalent to "button/primary/background-tap" which lives outside the semantic palette.
const CHIP_BG  = '#353233';
const CHIP_SEL = '#767676'; // state=Selected
const CHIP_DIS = '#afafaf'; // state=Disabled

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
  const bg        = state === 'selected' ? CHIP_SEL : state === 'disabled' ? CHIP_DIS : CHIP_BG;
  const textColor = state === 'disabled' ? '#767676' : '#ffffff';

  return (
    <Pressable
      onPress={state !== 'disabled' ? onPress : undefined}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: pressed && state === 'default' ? '#4a4748' : bg },
        flex && styles.chipFlex,
        style,
      ]}
    >
      {iconName && (
        <Icon name={iconName as any} size={24} color={textColor} />
      )}
      <Text style={[styles.chipLabel, { color: textColor }]}>
        {label}
      </Text>
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
  onExpand?:     () => void;
  showDrawer?:   boolean;
  showFee?:      boolean;
  showNotes?:    boolean;
  showCustomer?: boolean;
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
  onExpand,
  showDrawer   = true,
  showFee      = false,
  showNotes    = false,
  showCustomer = false,
  dark         = false,
  style,
}: RegisterActionBarProps) {
  return (
    <View style={[styles.bar, style]}>
      {/* Tax ON chip — green ok-filled icon when enabled */}
      <Pressable
        onPress={onTaxToggle}
        style={({ pressed }) => [
          styles.chip,
          styles.chipFlex,
          { backgroundColor: pressed ? '#4a4748' : CHIP_BG },
        ]}
      >
        <Icon
          name={taxEnabled ? 'ok-filled' : 'checkmark'}
          size={24}
          color={taxEnabled ? '#4CAF50' : '#ffffff'}
        />
        <Text style={styles.chipLabel}>
          Tax {taxEnabled ? 'ON' : 'OFF'}
        </Text>
      </Pressable>

      {/* Discount chip */}
      <ActionChip
        label="Discount"
        iconName="discount-reg"
        flex
        onPress={onDiscount}
      />

      {/* Open Drawer chip */}
      {showDrawer && (
        <ActionChip
          label="Open Drawer"
          iconName="drawer"
          flex
          onPress={onOpenDrawer}
        />
      )}

      {/* Optional extras */}
      {showFee && (
        <ActionChip label="Fee" iconName="dollar-24" flex onPress={onFee} />
      )}
      {showNotes && (
        <ActionChip label="Add Notes" iconName="draw-filled" flex onPress={onAddNotes} />
      )}
      {showCustomer && (
        <ActionChip label="Customer" iconName="user-add-filled" flex onPress={onCustomer} />
      )}

      {/* FAB — expand / collapse */}
      <TouchableOpacity
        onPress={onExpand}
        style={styles.fab}
        activeOpacity={0.75}
      >
        <Icon name="arrow-up-reg" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bar: {
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  '#111111',
    paddingTop:       Spacing[16],
    paddingHorizontal: 10,           // Figma: 10px — not in spacing scale, use raw value
    gap:              Spacing[6],
    paddingBottom:    0,
  },
  chip: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'center',
    height:           62,
    borderRadius:     100,
    paddingHorizontal: Spacing[16],
    paddingVertical:  7,
    gap:              Spacing[6],
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
    width:          62,
    height:         62,
    borderRadius:   100,
    backgroundColor: CHIP_BG,
    alignItems:     'center',
    justifyContent: 'center',
  },
});
