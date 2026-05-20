/**
 * OrderDetailsScreen
 *
 * Full-screen overlay that slides in from the right when the user taps
 * the "Order" pill in the top bar.
 *
 * Layout (Figma 6651:168980):
 *   ┌── Top bar ──────────────────────────────────────────────────────────┐
 *   │ hamburger | Sale | Search | barcode | [X] close pill               │
 *   ├── Scrollable content ──────────────────────────────────────────────┤
 *   │ [Add Customer Name] dark card                                       │
 *   │ [Add Note]          teal card                                       │
 *   │ — item rows —                                                       │
 *   │   Name (Color, Size)    qty × $price           $total              │
 *   │   • Add-on  +$0                                                     │
 *   │   Discount (label, Post Tax)                   -$x.xx              │
 *   │   Fee (label, Pre Tax)                         +$x.xx              │
 *   │   Note: text                                                        │
 *   │   [−] qty [+]                         ✏ 🗑                         │
 *   │   ── divider ──                                                     │
 *   ├── Bottom total ────────────────────────────────────────────────────┤
 *   │ Subtotal                                        $x.xx              │
 *   │ ⓘ Tax  [toggle]                                +$x.xx             │
 *   └── Charge buttons ─────────────────────────────────────────────────┘
 *     [CANCEL]  [CASH]  [CHARGE $x.xx]
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorTokens }          from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Radius, Spacing }      from '../theme/spacing';
import { Icon }                 from '../components/ui/Icon';
import type { CartItem, CartState, CartActions } from '../types/cart';

// ─── Props ────────────────────────────────────────────────────────────────────

export type OrderDetailsScreenProps = {
  visible:      boolean;
  cart:         CartState;
  cartActions:  CartActions;
  taxEnabled:   boolean;
  onTaxToggle:  () => void;
  onClose:      () => void;
  onCharge?:    () => void;
  onCancel?:    () => void;
  /** Called when the edit pencil is tapped on an item row */
  onEditItem?:  (item: CartItem) => void;
  dark?:        boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function OrderDetailsScreen({
  visible,
  cart,
  cartActions,
  taxEnabled,
  onTaxToggle,
  onClose,
  onCharge,
  onCancel,
  onEditItem,
  dark = false,
}: OrderDetailsScreenProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  // Slide in from the right
  const slideX = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.spring(slideX, {
      toValue:        visible ? 0 : 600,
      useNativeDriver: true,
      damping:         28,
      stiffness:       260,
      mass:            0.9,
    }).start();
  }, [visible, slideX]);

  // Tax amount (10% of subtotal as mock for prototype)
  const taxAmount   = taxEnabled ? cart.total * 0.1 : 0;
  const grandTotal  = cart.total + taxAmount;
  const fmt = (n: number) => `$${n.toFixed(2)}`;

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[s.root, { transform: [{ translateX: slideX }] }]}
    >
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <View style={[s.topBar, { backgroundColor: palette.bgSurface, borderBottomColor: palette.border }]}>
        {/* Left: hamburger + Sale */}
        <View style={s.topLeft}>
          <TouchableOpacity style={s.iconBtn} activeOpacity={0.7}>
            <Icon name="hamburger" size={24} color={palette.textPrimary} />
          </TouchableOpacity>
          <View style={s.saleChip}>
            <View style={[s.gdCircle, { backgroundColor: palette.contentAccent1 }]}>
              <Icon name="point-of-sale" size={16} color="#fff" />
            </View>
            <Text style={[s.saleName, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
              Sale
            </Text>
            <Icon name="chevron-down" size={16} color={palette.textPrimary} />
          </View>
        </View>

        {/* Search pill */}
        <View style={[s.searchPill, { backgroundColor: palette.bgLight }]}>
          <Text style={[s.searchHint, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
            Search
          </Text>
          <Icon name="search" size={18} color={palette.textSecondary} />
        </View>

        {/* Right: barcode + X close pill */}
        <View style={s.topRight}>
          <TouchableOpacity style={[s.iconBtn, { borderWidth: 1, borderColor: palette.textSecondary }]} activeOpacity={0.7}>
            <Icon name="barcode-24" size={22} color={palette.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={s.closePill} activeOpacity={0.8}>
            <Icon name="x" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Scrollable order content ─────────────────────────────────────── */}
      <ScrollView
        style={[s.scroll, { backgroundColor: palette.bgSurface }]}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Customer Name card */}
        <TouchableOpacity style={[s.ctaCard, { backgroundColor: palette.bgBase }]} activeOpacity={0.8}>
          <Text style={[s.ctaLabel, { color: '#ffffff', fontFamily: FontFamily.textMedium }]}>
            Add Customer Name
          </Text>
          <Icon name="edit" size={20} color="#ffffff" />
        </TouchableOpacity>

        {/* Add Note card */}
        <TouchableOpacity style={[s.ctaCard, { backgroundColor: palette.bgAccent }]} activeOpacity={0.8}>
          <Text style={[s.ctaLabel, { color: TEAL_DARK, fontFamily: FontFamily.textMedium }]}>
            Add Note
          </Text>
          <Icon name="edit" size={20} color={TEAL_DARK} />
        </TouchableOpacity>

        {/* Items */}
        <View style={s.itemsContainer}>
          {cart.items.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={[s.emptyText, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
                No items yet
              </Text>
            </View>
          ) : (
            cart.items.map(item => (
              <OrderItemRow
                key={item.id}
                item={item}
                palette={palette}
                onIncrement={() => cartActions.changeQty(item.id, +1)}
                onDecrement={() => cartActions.changeQty(item.id, -1)}
                onDelete={() => cartActions.deleteItem(item.id)}
                onEdit={() => onEditItem?.(item)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* ── Bottom: Subtotal + Tax + Charge buttons ──────────────────────── */}
      <View style={s.bottom}>
        {/* Subtotal row */}
        <View style={[s.totalRow, { backgroundColor: palette.bgSurface, borderBottomColor: palette.border }]}>
          <Text style={[s.totalLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
            Subtotal
          </Text>
          <Text style={[s.totalValue, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
            {fmt(cart.total)}
          </Text>
        </View>

        {/* Tax row */}
        <TouchableOpacity
          onPress={onTaxToggle}
          style={[s.taxRow, { backgroundColor: palette.bgLevel1, borderBottomColor: palette.border }]}
          activeOpacity={0.8}
        >
          <View style={s.taxLeft}>
            <Icon name="information" size={20} color={palette.textPrimary} />
            <Text style={[s.totalLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>Tax</Text>
            {/* Simple toggle visual */}
            <View style={[
              s.togglePill,
              { backgroundColor: taxEnabled ? '#61EDEA' : '#ffffff', borderColor: taxEnabled ? '#61EDEA' : '#767676', borderWidth: taxEnabled ? 0 : 2 },
            ]}>
              <View style={[
                s.toggleThumb,
                { backgroundColor: taxEnabled ? '#ffffff' : '#767676' },
                taxEnabled ? s.toggleThumbOn : undefined,
              ]} />
            </View>
          </View>
          <Text style={[s.totalValue, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
            {taxEnabled ? `+${fmt(taxAmount)}` : '+$0.00'}
          </Text>
        </TouchableOpacity>

        {/* CANCEL / CASH / CHARGE */}
        <View style={[s.btnBar, { backgroundColor: palette.bgBase }]}>
          <TouchableOpacity onPress={onCancel} style={[s.btn, s.btnFixed, s.btnCancel]} activeOpacity={0.75}>
            <Text style={[s.btnLabel, { fontFamily: FontFamily.textMedium }]}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btn, s.btnFixed, s.btnCash]} activeOpacity={0.75}>
            <Text style={[s.btnLabel, { fontFamily: FontFamily.textMedium }]}>CASH</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCharge} style={[s.btn, s.btnCharge, { backgroundColor: palette.contentPrimary }]} activeOpacity={0.75}>
            <Text style={[s.chargeLabel, { fontFamily: FontFamily.textBold }]}>CHARGE</Text>
            <Text style={[s.chargeAmount, { fontFamily: FontFamily.textMedium }]}>{fmt(grandTotal)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Order Item Row ───────────────────────────────────────────────────────────

type Palette = typeof ColorTokens.light;

function OrderItemRow({
  item,
  palette,
  onIncrement,
  onDecrement,
  onDelete,
  onEdit,
}: {
  item:        CartItem;
  palette:     Palette;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete:    () => void;
  onEdit?:     () => void;
}) {
  const lineTotal = `$${(item.priceValue * item.quantity).toFixed(2)}`;

  return (
    <View style={s.itemRow}>
      {/* Product name + quantity descriptor + line total */}
      <View style={s.itemHeader}>
        <View style={s.itemNameRow}>
          <Text style={[s.itemName, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[s.itemQtyDesc, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
            {`  ${item.quantity} × ${item.priceLabel}`}
          </Text>
        </View>
        <Text style={[s.itemTotal, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
          {lineTotal}
        </Text>
      </View>

      {/* Note if present */}
      {!!item.note && (
        <Text style={[s.itemNote, { fontFamily: FontFamily.textMedium }]}>
          {`Note: ${item.note}`}
        </Text>
      )}

      {/* Quantity stepper + actions */}
      <View style={s.itemControls}>
        <View style={s.stepper}>
          <TouchableOpacity onPress={onDecrement} style={[s.stepBtn, { borderColor: palette.neutral }]} activeOpacity={0.7}>
            <Icon name="minus" size={20} color={palette.textPrimary} />
          </TouchableOpacity>
          <View style={s.stepValWrap}>
            <Text style={[s.stepVal, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
              {item.quantity}
            </Text>
          </View>
          <TouchableOpacity onPress={onIncrement} style={[s.stepBtn, { borderColor: palette.textSecondary }]} activeOpacity={0.7}>
            <Icon name="plus" size={20} color={palette.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={s.itemActions}>
          <TouchableOpacity onPress={onEdit} style={s.actionBtn} activeOpacity={0.7}>
            <Icon name="edit" size={24} color={palette.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={s.actionBtn} activeOpacity={0.7}>
            <Icon name="trash" size={24} color={palette.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View style={[s.divider, { backgroundColor: palette.border }]} />
    </View>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAL_DARK = '#09757A';

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex:          100,
    flexDirection:   'column',
  },

  // ── Top bar ──────────────────────────────────────────────────────────────
  topBar: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[8],
    borderBottomWidth: 1,
    gap:               Spacing[12],
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing[12], flexShrink: 0 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing[16], flexShrink: 0 },
  iconBtn: { width: 44, height: 44, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  saleChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing[8] },
  gdCircle: { width: 28, height: 28, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  saleName: { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.2 },
  searchPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 44, borderRadius: Radius.full, paddingHorizontal: Spacing[12] },
  searchHint: { fontSize: FontSize.bodySM, lineHeight: FontSize.bodySM * 1.5 },
  closePill: {
    width: 44, height: 44, borderRadius: Radius.full,
    backgroundColor: '#111111', alignItems: 'center', justifyContent: 'center',
  },

  // ── Scroll ───────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing[16],
    paddingTop:        Spacing[8],
    paddingBottom:     Spacing[32],
    gap:               Spacing[8],
  },

  // ── CTA cards ─────────────────────────────────────────────────────────────
  ctaCard: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    borderRadius:    Radius.sm,
    paddingLeft:     Spacing[16],
    paddingRight:    Spacing[16],
    paddingVertical: Spacing[16],
  },
  ctaLabel: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2, flex: 1 },

  // ── Items container ───────────────────────────────────────────────────────
  itemsContainer: { marginTop: Spacing[8] },
  emptyState: { alignItems: 'center', paddingVertical: Spacing[32] },
  emptyText: { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.5 },

  // ── Item row ──────────────────────────────────────────────────────────────
  itemRow: { paddingTop: Spacing[16], gap: Spacing[12] },
  itemHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing[8] },
  itemNameRow: { flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  itemName: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },
  itemQtyDesc: { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.5 },
  itemTotal: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2, flexShrink: 0 },
  itemNote: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2, color: '#DB1802' },

  // Controls row
  itemControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  stepBtn: { width: 44, height: 44, borderRadius: Radius.full, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepValWrap: { width: 60, alignItems: 'center', justifyContent: 'center' },
  stepVal: { fontSize: FontSize.headingMD, lineHeight: FontSize.headingMD * 1.2, textAlign: 'center' },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing[24] },
  actionBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, marginTop: Spacing[4] },

  // ── Bottom ────────────────────────────────────────────────────────────────
  bottom: { flexShrink: 0 },
  totalRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[20],
    borderBottomWidth: 1,
  },
  taxRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[20],
    borderBottomWidth: 1,
  },
  taxLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing[8] },
  totalLabel: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },
  totalValue: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },

  // Tax toggle (inline mini toggle)
  togglePill: { width: 52, height: 32, borderRadius: Radius.full, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', paddingLeft: 6, paddingRight: 26 },
  toggleThumb: { width: 20, height: 20, borderRadius: Radius.full },
  toggleThumbOn: { marginLeft: 14 },

  // Charge buttons
  btnBar: {
    flexDirection:     'row',
    alignItems:        'stretch',
    paddingVertical:   Spacing[16],
    paddingHorizontal: 10,
    gap:               Spacing[6],
  },
  btn: { height: 88, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  btnFixed: { width: 124 },
  btnCancel: { borderWidth: 2, borderColor: '#767676' },
  btnCash: { borderWidth: 2, borderColor: '#767676', backgroundColor: '#0B3354' },
  btnCharge: { flex: 1, alignItems: 'flex-start', justifyContent: 'center', padding: Spacing[16] },
  btnLabel: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2, color: '#ffffff', textAlign: 'center' },
  chargeLabel: { fontSize: FontSize.labelSM, lineHeight: FontSize.labelSM * 1.2, color: '#ffffff', textTransform: 'uppercase', marginBottom: Spacing[4] },
  chargeAmount: { fontSize: FontSize.headingLG, lineHeight: FontSize.headingLG * 1.2, color: '#ffffff' },
});
