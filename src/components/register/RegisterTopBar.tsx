/**
 * RegisterTopBar — Register App
 *
 * Figma: node-id 6348-163176 (Pro), same structure on Duo/Flex at smaller width.
 *
 * Contains:
 *  - Hamburger menu icon (left)
 *  - GD logo circle + "Sale" dropdown label (left)
 *  - Search pill (centre/right — expands on wide devices)
 *  - Barcode scanner icon button
 *  - Print icon button (Pro/wide only via showPrint prop)
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
import { Icon } from '../ui/Icon';

export type RegisterTopBarProps = {
  saleName?:     string;
  searchQuery?:  string;
  onMenuPress?:  () => void;
  onSalePress?:  () => void;
  onSearchPress?: () => void;
  onBarcodePress?: () => void;
  onPrintPress?: () => void;
  showPrint?:    boolean;
  orderCount?:   number;
  onOrderPress?: () => void;
  showOrderBadge?: boolean;
  dark?:         boolean;
  style?:        ViewStyle;
};

export function RegisterTopBar({
  saleName       = 'Sale',
  searchQuery    = '',
  onMenuPress,
  onSalePress,
  onSearchPress,
  onBarcodePress,
  onPrintPress,
  showPrint      = false,
  orderCount     = 0,
  onOrderPress,
  showOrderBadge = false,
  dark           = false,
  style,
}: RegisterTopBarProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: palette.bgSurface,
          borderBottomColor: palette.border,
        },
        style,
      ]}
    >
      {/* ── Left ──────────────────────────────────────────────────────────── */}
      <View style={styles.left}>
        <TouchableOpacity
          onPress={onMenuPress}
          style={[styles.iconBtn, { borderRadius: Radius.full }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="hamburger" size={24} color={palette.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onSalePress} style={styles.saleBtn}>
          {/* GD logo circle */}
          <View style={[styles.gdCircle, { backgroundColor: palette.contentAccent1 }]}>
            <Icon name="point-of-sale" size={18} color="#fff" />
          </View>
          <Text style={[styles.saleName, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.bodyMD }]}>
            {saleName}
          </Text>
          <Icon name="chevron-down" size={18} color={palette.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <TouchableOpacity
        onPress={onSearchPress}
        style={[
          styles.searchPill,
          { backgroundColor: palette.bgLight, borderRadius: Radius.full },
        ]}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.searchPlaceholder,
            { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodySM },
          ]}
          numberOfLines={1}
        >
          {searchQuery || 'Search'}
        </Text>
        <Icon name="search" size={20} color={palette.textSecondary} />
      </TouchableOpacity>

      {/* ── Right icons ───────────────────────────────────────────────────── */}
      <View style={styles.right}>
        <TouchableOpacity
          onPress={onBarcodePress}
          style={[
            styles.iconBtn,
            {
              borderColor:  palette.textSecondary,
              borderWidth:  1,
              borderRadius: Radius.full,
            },
          ]}
        >
          <Icon name="barcode-24" size={22} color={palette.textPrimary} />
        </TouchableOpacity>

        {showPrint && (
          <TouchableOpacity
            onPress={onPrintPress}
            style={[
              styles.iconBtn,
              {
                borderColor:  palette.textSecondary,
                borderWidth:  1,
                borderRadius: Radius.full,
              },
            ]}
          >
            <Icon name="print" size={22} color={palette.textPrimary} />
          </TouchableOpacity>
        )}

        {showOrderBadge && (
          <TouchableOpacity onPress={onOrderPress} style={[styles.orderBadge, { backgroundColor: palette.bgBase, borderRadius: Radius.full }]}>
            <Icon name="cart" size={18} color="#fff" />
            <Text style={[styles.orderLabel, { fontFamily: FontFamily.textMedium, fontSize: FontSize.bodySM }]}>
              Order
            </Text>
            <View style={[styles.orderCount, { backgroundColor: palette.contentPrimary }]}>
              <Text style={[styles.orderCountText, { fontFamily: FontFamily.textBold, fontSize: 11 }]}>
                {orderCount}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection:    'row',
    alignItems:       'center',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[12],
    borderBottomWidth: 1,
    gap:              Spacing[16],
  },
  left: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[16],
  },
  iconBtn: {
    width:          44,
    height:         44,
    alignItems:     'center',
    justifyContent: 'center',
  },
  saleBtn: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[8],
  },
  gdCircle: {
    width:          28,
    height:         28,
    borderRadius:   999,
    alignItems:     'center',
    justifyContent: 'center',
  },
  saleName: {
    marginRight: Spacing[2],
  },
  searchPill: {
    flex:              1,
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    height:            44,
    paddingHorizontal: Spacing[12],
    gap:               Spacing[8],
  },
  searchPlaceholder: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[8],
  },
  orderBadge: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              Spacing[6],
    paddingHorizontal: Spacing[12],
    paddingVertical:   Spacing[8],
    borderRadius:     Radius.full,
  },
  orderLabel: {
    color: '#fff',
  },
  orderCount: {
    minWidth:        20,
    height:          20,
    borderRadius:    10,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: Spacing[4],
  },
  orderCountText: {
    color: '#fff',
  },
});
