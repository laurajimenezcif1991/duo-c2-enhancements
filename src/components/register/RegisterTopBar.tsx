/**
 * RegisterTopBar — Register App
 *
 * Figma: Debit-nudge-experiment · node 14:10212 / Smart-Terminal-Glass-2.0 · node 3715:11925
 *
 * Rows:
 *   1. Main bar  : hamburger | GD logo + Sale | search pill | barcode btn | Order pill
 *   2. Item row  : last-tapped item name + price | qty – / input / + | edit | delete
 *                  (only visible when selectedItem is non-null)
 *   3. Chip bar  : rendered by RegisterTabBar (separate component)
 *
 * Order pill (Figma): h=44 w=126 pl=6 pr=5 py=4 rounded=30
 *   badge bg = grey (contentTertiary) when 0, blue (contentPrimary) when > 0
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

// ─── Selected-item shape (subset of CartItem for display) ────────────────────

export type SelectedItemInfo = {
  id:       string;
  name:     string;
  price:    string;   // formatted "$30.00"
  quantity: number;
};

// ─── Props ────────────────────────────────────────────────────────────────────

export type RegisterTopBarProps = {
  saleName?:      string;
  onMenuPress?:   () => void;
  onSalePress?:   () => void;
  onSearchPress?: () => void;
  onBarcodePress?: () => void;
  showOrderBadge?:    boolean;
  orderCount?:        number;
  onOrderPress?:      () => void;
  /** When true, replaces the Order pill with a plain X-circle close button */
  orderDetailsOpen?:  boolean;
  /** Last-tapped cart item shown in the item row */
  selectedItem?:  SelectedItemInfo | null;
  onItemIncrement?: () => void;
  onItemDecrement?: () => void;
  onItemDelete?:  () => void;
  onItemEdit?:    () => void;
  dark?:          boolean;
  style?:         ViewStyle;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterTopBar({
  saleName          = 'Sale',
  onMenuPress,
  onSalePress,
  onSearchPress,
  onBarcodePress,
  showOrderBadge    = false,
  orderCount        = 0,
  onOrderPress,
  orderDetailsOpen  = false,
  selectedItem      = null,
  onItemIncrement,
  onItemDecrement,
  onItemDelete,
  onItemEdit,
  dark              = false,
  style,
}: RegisterTopBarProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  return (
    <View style={[s.wrapper, { backgroundColor: palette.bgSurface }, style]}>

      {/* ── Row 1: main bar ──────────────────────────────────────────────── */}
      <View style={[s.bar, { borderBottomColor: palette.border }]}>

        {/* Left: hamburger + Sale */}
        <View style={s.left}>
          <TouchableOpacity onPress={onMenuPress} style={s.iconBtn}>
            <Icon name="hamburger" size={24} color={palette.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onSalePress} style={s.saleBtn}>
            <View style={[s.gdCircle, { backgroundColor: palette.contentAccent1 }]}>
              <Icon name="point-of-sale" size={18} color="#fff" />
            </View>
            <Text style={[s.saleName, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.bodyMD }]}>
              {saleName}
            </Text>
            <Icon name="chevron-down" size={18} color={palette.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search pill */}
        <TouchableOpacity
          onPress={onSearchPress}
          style={[s.searchPill, { backgroundColor: palette.bgLight }]}
          activeOpacity={0.8}
        >
          <Text style={[s.searchHint, { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodySM }]}>
            Search
          </Text>
          <Icon name="search" size={20} color={palette.textSecondary} />
        </TouchableOpacity>

        {/* Right: barcode + Order pill */}
        <View style={s.right}>
          <TouchableOpacity
            onPress={onBarcodePress}
            style={[s.iconBtn, { borderWidth: 1, borderColor: palette.textSecondary }]}
          >
            <Icon name="barcode-24" size={22} color={palette.textPrimary} />
          </TouchableOpacity>

          {showOrderBadge && (
            orderDetailsOpen ? (
              /* X close button — shown while Order Details is open */
              <TouchableOpacity
                onPress={onOrderPress}
                style={[s.closePill, { backgroundColor: palette.bgBase }]}
                activeOpacity={0.8}
              >
                <Icon name="x" size={20} color="#ffffff" />
              </TouchableOpacity>
            ) : (
              /* Normal Order pill */
              <TouchableOpacity
                onPress={onOrderPress}
                style={[s.orderPill, { backgroundColor: palette.bgBase }]}
                activeOpacity={0.8}
              >
                <View style={s.orderLeft}>
                  <Icon name="cart" size={18} color="#fff" />
                  <Text style={[s.orderLabel, { fontFamily: FontFamily.textMedium, fontSize: FontSize.headingXXS }]}>
                    Order
                  </Text>
                </View>
                <View style={[
                  s.orderBadge,
                  { backgroundColor: orderCount > 0 ? palette.contentPrimary : palette.contentTertiary },
                ]}>
                  <Text style={[s.orderBadgeText, { fontFamily: FontFamily.textMedium, fontSize: FontSize.headingXXS }]}>
                    {orderCount}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* ── Row 2: selected item ─────────────────────────────────────────── */}
      {selectedItem && (
        <View style={[s.itemRow, { borderColor: palette.border }]}>

          {/* Item name + price */}
          <View style={s.itemInfo}>
            <Text
              style={[s.itemName, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.headingXS }]}
              numberOfLines={2}
            >
              {selectedItem.name}
            </Text>
            <View style={s.itemPriceRow}>
              <Text style={[s.itemPriceLabel, { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodySM }]}>
                x {selectedItem.price}
              </Text>
            </View>
          </View>

          {/* Qty controls + actions */}
          <View style={s.itemControls}>
            {/* – qty + */}
            <View style={s.qtyRow}>
              <TouchableOpacity
                onPress={onItemDecrement}
                style={[s.qtyBtn, { backgroundColor: palette.bgLevel1 }]}
                activeOpacity={0.7}
              >
                <Icon name="minus" size={20} color={palette.textPrimary} />
              </TouchableOpacity>

              <View style={[s.qtyBox, { borderColor: palette.neutral }]}>
                <Text style={[s.qtyText, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.headingMD }]}>
                  {selectedItem.quantity}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onItemIncrement}
                style={[s.qtyBtn, { backgroundColor: palette.border }]}
                activeOpacity={0.7}
              >
                <Icon name="plus" size={20} color={palette.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Edit + Delete */}
            <View style={s.itemActions}>
              <TouchableOpacity onPress={onItemEdit} style={s.iconBtn} activeOpacity={0.7}>
                <Icon name="edit" size={20} color={palette.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onItemDelete} style={s.iconBtn} activeOpacity={0.7}>
                <Icon name="trash" size={20} color={palette.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  wrapper: {
    // shadow (Elevation/100 from Figma)
    shadowColor:   '#111111',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius:  4,
    elevation:     4,
  },

  // ── Main bar ────────────────────────────────────────────────────────────
  bar: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingLeft:       6,
    paddingRight:      Spacing[16],
    paddingVertical:   Spacing[8],
    gap:               Spacing[12],
  },

  left: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[8],
  },

  iconBtn: {
    width:          44,
    height:         44,
    borderRadius:   Radius.full,
    alignItems:     'center',
    justifyContent: 'center',
  },

  saleBtn: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[8],
    width:         160,
  },

  gdCircle: {
    width:          28,
    height:         28,
    borderRadius:   999,
    alignItems:     'center',
    justifyContent: 'center',
  },

  saleName: {
    flex: 1,
  },

  searchPill: {
    flex:              1,
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    height:            44,
    paddingHorizontal: Spacing[12],
    borderRadius:      Radius.full,
    gap:               Spacing[8],
  },

  searchHint: {
    flex: 1,
  },

  right: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[8],
  },

  // X close pill — shown when Order Details screen is open (same shape as orderPill)
  closePill: {
    width:           44,
    height:          44,
    borderRadius:    Radius.full,
    alignItems:      'center',
    justifyContent:  'center',
  },

  // Order pill — Figma: h=44 pl=6 pr=5 py=4 rounded=30 w=126
  orderPill: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    height:         44,
    width:          126,
    paddingLeft:    6,
    paddingRight:   5,
    paddingVertical: 4,
    borderRadius:   30,
  },

  orderLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[4],
  },

  orderLabel: {
    color: '#ffffff',
  },

  orderBadge: {
    width:          32,
    height:         32,
    borderRadius:   Radius.full,
    alignItems:     'center',
    justifyContent: 'center',
  },

  orderBadgeText: {
    color: '#ffffff',
  },

  // ── Item row ────────────────────────────────────────────────────────────
  itemRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[20],
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },

  itemInfo: {
    flex:  1,
    gap:   Spacing[4],
  },

  itemName: {
    lineHeight: FontSize.headingXS * 1.2,
  },

  itemPriceRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[4],
  },

  itemPriceLabel: {
    lineHeight: FontSize.bodySM * 1.5,
  },

  itemControls: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[12],
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[8],
  },

  qtyBtn: {
    width:          44,
    height:         44,
    borderRadius:   Radius.full,
    alignItems:     'center',
    justifyContent: 'center',
  },

  qtyBox: {
    width:          56,
    height:         44,
    borderWidth:    1.5,
    borderRadius:   Radius.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },

  qtyText: {
    textAlign: 'center',
    lineHeight: FontSize.headingMD * 1.2,
  },

  itemActions: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[4],
  },
});
