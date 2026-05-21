/**
 * OrderDetailsScreen
 *
 * Renders inline as the content area of RegisterDuoScreen — no slide animation,
 * no internal top bar. The parent RegisterDuoScreen mounts/unmounts this and
 * the shared RegisterTopBar switches its Order pill to an X when it is open.
 *
 * Layout (Figma 6651:168980):
 *   ├── Scrollable content ──────────────────────────────────────────────┤
 *   │ [Add Customer Name] dark card                                       │
 *   │ [Add Note]          teal card                                       │
 *   │ — item rows —                                                       │
 *   │   Name (Color, Size)    qty × $price           $total              │
 *   │   Note: text                                                        │
 *   │   [−] qty [+]                         ✏ 🗑                         │
 *   │   ── divider ──                                                     │
 *   ├── Bottom total (with top drop shadow) ─────────────────────────────┤
 *   │ Subtotal                                        $x.xx              │
 *   │ ⓘ Tax  [toggle]                                +$x.xx             │
 *   └── Charge buttons ─────────────────────────────────────────────────┘
 *     [CANCEL]  [CASH]  [CHARGE $x.xx]
 */

import React from 'react';
import {
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
import type { CartItem, CartState, CartActions, CartAddOn, CartAppliedModifier } from '../types/cart';

// ─── Props ────────────────────────────────────────────────────────────────────

export type OrderDetailsScreenProps = {
  cart:                   CartState;
  cartActions:            CartActions;
  taxEnabled:             boolean;
  onTaxToggle:            () => void;
  onCancel?:              () => void;
  onCharge?:              () => void;
  onEditItem?:            (item: CartItem) => void;
  dark?:                  boolean;
  // ── Order-level values (owned by RegisterDuoScreen) ────────────────────
  customerName?:          string;
  onEditCustomerName?:    () => void;
  orderNote?:             string;
  onEditOrderNote?:       () => void;
  orderDiscount?:         CartAppliedModifier | null;
  onAddOrderDiscount?:    () => void;
  onRemoveOrderDiscount?: () => void;
  orderFee?:              CartAppliedModifier | null;
  onAddOrderFee?:         () => void;
  onRemoveOrderFee?:      () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function OrderDetailsScreen({
  cart,
  cartActions,
  taxEnabled,
  onTaxToggle,
  onCancel,
  onCharge,
  onEditItem,
  dark = false,
  customerName          = '',
  onEditCustomerName,
  orderNote             = '',
  onEditOrderNote,
  orderDiscount         = null,
  onAddOrderDiscount,
  onRemoveOrderDiscount,
  orderFee              = null,
  onAddOrderFee,
  onRemoveOrderFee,
}: OrderDetailsScreenProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  const taxAmount  = taxEnabled ? cart.total * 0.1 : 0;
  const grandTotal = cart.total + taxAmount;
  const fmt = (n: number) => `$${n.toFixed(2)}`;

  return (
    <View style={[s.root, { backgroundColor: palette.bgSurface }]}>

      {/* ── Scrollable order content ─────────────────────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Name card */}
        <TouchableOpacity
          style={[s.ctaCard, { backgroundColor: palette.bgBase }]}
          activeOpacity={0.8}
          onPress={onEditCustomerName}
        >
          <Text
            style={[s.ctaLabel, { color: '#ffffff', fontFamily: FontFamily.textMedium }]}
            numberOfLines={1}
          >
            {customerName.length > 0 ? customerName : 'Add Customer Name'}
          </Text>
          <Icon name="keypad" size={20} color="#ffffff" />
        </TouchableOpacity>

        {/* Note card — shows note text when set */}
        <TouchableOpacity
          style={[s.ctaCard, { backgroundColor: palette.bgAccent }]}
          activeOpacity={0.8}
          onPress={onEditOrderNote}
        >
          <Text
            style={[s.ctaLabel, { color: TEAL_DARK, fontFamily: FontFamily.textMedium }]}
            numberOfLines={1}
          >
            {orderNote.length > 0 ? orderNote : 'Add Note'}
          </Text>
          <Icon name="keypad" size={20} color={TEAL_DARK} />
        </TouchableOpacity>

        {/* Item rows */}
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

        {/* ── Order-level Discount Applied — only when applied ─────────── */}
        {orderDiscount && (
          <OrderModSection
            label="Discount Applied"
            applied={orderDiscount}
            palette={palette}
            onAdd={onAddOrderDiscount}
            onRemove={onRemoveOrderDiscount}
          />
        )}

        {/* ── Order-level Fee Applied — only when applied ───────────────── */}
        {orderFee && (
          <OrderModSection
            label="Fee Applied"
            applied={orderFee}
            palette={palette}
            onAdd={onAddOrderFee}
            onRemove={onRemoveOrderFee}
          />
        )}

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
          style={[s.taxRow, { backgroundColor: palette.bgLight, borderBottomColor: palette.border }]}
          activeOpacity={0.8}
        >
          <View style={s.taxLeft}>
            <Icon name="information" size={20} color={palette.textPrimary} />
            <Text style={[s.totalLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
              Tax
            </Text>
            <View style={[
              s.togglePill,
              {
                backgroundColor: taxEnabled ? '#61EDEA' : '#ffffff',
                borderColor:     taxEnabled ? '#61EDEA' : '#767676',
                borderWidth:     taxEnabled ? 0 : 2,
                paddingLeft:     taxEnabled ? 26 : 6,
                paddingRight:    taxEnabled ? 6  : 26,
              },
            ]}>
              <View style={[s.toggleThumb, { backgroundColor: taxEnabled ? '#ffffff' : '#767676' }]} />
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
          <TouchableOpacity
            onPress={onCharge}
            style={[s.btn, s.btnCharge, { backgroundColor: palette.contentPrimary }]}
            activeOpacity={0.75}
          >
            <Text style={[s.chargeLabel, { fontFamily: FontFamily.textBold }]}>CHARGE</Text>
            <Text style={[s.chargeAmount, { fontFamily: FontFamily.textMedium }]}>{fmt(grandTotal)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
      {/* ── Product headline: name + qty×price + line total ─────────────── */}
      <View style={s.itemHeader}>
        <View style={s.itemNameRow}>
          <Text
            style={[s.itemName, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}
            numberOfLines={2}
          >
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

      {/* ── Add-ons (checkbox/radio modifier selections) ─────────────────── */}
      {item.addOns && item.addOns.length > 0 && (
        <View style={s.addOnsBlock}>
          {item.addOns.map((ao, i) => (
            <View key={i} style={s.addOnRow}>
              <Text style={[s.addOnBullet, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
                {'• '}
              </Text>
              <Text style={[s.addOnText, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
                {ao.label}
              </Text>
              <Text style={[s.addOnPrice, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
                {`  ${ao.price}`}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* ── Discount line ────────────────────────────────────────────────── */}
      {item.discount && (
        <View style={s.modifierLine}>
          <Text
            style={[s.modifierLineLabel, { color: TEAL_DARK, fontFamily: FontFamily.textMedium }]}
            numberOfLines={1}
          >
            {`Discount (${item.discount.label} ${item.discount.value}${item.discount.postTax ? ', Post Tax' : ', Pre Tax'})`}
          </Text>
          <Text style={[s.modifierLineValue, { color: palette.textPrimary, fontFamily: FontFamily.textRegular }]}>
            {`-${item.discount.value}`}
          </Text>
        </View>
      )}

      {/* ── Fee line ─────────────────────────────────────────────────────── */}
      {item.fee && (
        <View style={s.modifierLine}>
          <Text
            style={[s.modifierLineLabel, { color: TEAL_DARK, fontFamily: FontFamily.textMedium }]}
            numberOfLines={1}
          >
            {`Fee (${item.fee.label} ${item.fee.value}${item.fee.postTax ? ', Post Tax' : ', Pre Tax'})`}
          </Text>
          <Text style={[s.modifierLineValue, { color: palette.textPrimary, fontFamily: FontFamily.textRegular }]}>
            {`+${item.fee.value}`}
          </Text>
        </View>
      )}

      {/* ── Note ─────────────────────────────────────────────────────────── */}
      {!!item.note && (
        <Text style={[s.itemNote, { fontFamily: FontFamily.textMedium }]}>
          {`Note: ${item.note}`}
        </Text>
      )}

      {/* ── Quantity stepper + edit + trash ──────────────────────────────── */}
      <View style={s.itemControls}>
        <View style={s.stepper}>
          <TouchableOpacity
            onPress={onDecrement}
            style={[s.stepBtn, { borderColor: palette.neutral }]}
            activeOpacity={0.7}
          >
            <Icon name="minus" size={20} color={palette.textPrimary} />
          </TouchableOpacity>
          <View style={s.stepValWrap}>
            <Text style={[s.stepVal, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
              {item.quantity}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onIncrement}
            style={[s.stepBtn, { borderColor: palette.textSecondary }]}
            activeOpacity={0.7}
          >
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
    flex:          1,
    flexDirection: 'column',
  },

  // ── Scroll ───────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing[16],
    paddingTop:        Spacing[24],   // slightly more gap below header (fix 3)
    paddingBottom:     Spacing[32],
    gap:               Spacing[8],
  },

  // ── CTA cards ─────────────────────────────────────────────────────────────
  ctaCard: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    borderRadius:    Radius.sm,
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[20],   // slightly more vertical padding (fix 2)
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

  // Add-ons block
  addOnsBlock: { gap: 2 },
  addOnRow:    { flexDirection: 'row', alignItems: 'center' },
  addOnBullet: { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.5 },
  addOnText:   { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.5 },
  addOnPrice:  { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.5 },

  // Discount / Fee line
  modifierLine: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    gap:            Spacing[8],
  },
  modifierLineLabel: { flex: 1, fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },
  modifierLineValue: { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.5, flexShrink: 0 },

  // Controls row
  itemControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  stepBtn: { width: 44, height: 44, borderRadius: Radius.full, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepValWrap: { width: 60, alignItems: 'center', justifyContent: 'center' },
  stepVal: { fontSize: FontSize.headingMD, lineHeight: FontSize.headingMD * 1.2, textAlign: 'center' },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing[24] },
  actionBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, marginTop: Spacing[4] },

  // ── Bottom section with top drop shadow (fix 4) ───────────────────────────
  bottom: {
    flexShrink:   0,
    shadowColor:  '#111111',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.10,
    shadowRadius:  6,
    elevation:     8,
  },
  totalRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[24],
    borderBottomWidth: 1,
  },
  taxRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[24],
    borderBottomWidth: 1,
  },
  taxLeft:    { flexDirection: 'row', alignItems: 'center', gap: Spacing[8] },
  totalLabel: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },
  totalValue: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },

  // Tax toggle
  togglePill: {
    width: 52, height: 32, borderRadius: Radius.full,
    paddingVertical: 6, flexDirection: 'row', alignItems: 'center',
  },
  toggleThumb: { width: 20, height: 20, borderRadius: Radius.full },

  // Charge buttons
  btnBar: {
    flexDirection:     'row',
    alignItems:        'stretch',
    paddingVertical:   Spacing[16],
    paddingHorizontal: 10,
    gap:               Spacing[6],
  },
  btn:       { height: 88, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  btnFixed:  { width: 124 },
  btnCancel: { borderWidth: 2, borderColor: '#767676' },
  btnCash:   { borderWidth: 2, borderColor: '#767676', backgroundColor: '#0B3354' },
  btnCharge: { flex: 1, alignItems: 'flex-start', justifyContent: 'center', padding: Spacing[16] },
  btnLabel:  { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2, color: '#ffffff', textAlign: 'center' },
  chargeLabel:  { fontSize: FontSize.labelSM, lineHeight: FontSize.labelSM * 1.2, color: '#ffffff', textTransform: 'uppercase', marginBottom: Spacing[4] },
  chargeAmount: { fontSize: FontSize.headingLG, lineHeight: FontSize.headingLG * 1.2, color: '#ffffff' },

  // Order-level modifier sections
  modSection:  { paddingHorizontal: Spacing[16], paddingTop: Spacing[16], gap: Spacing[8] },
  modHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modTitle:    { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },
  modAdd:      { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2, color: '#09757A' },
  appliedCard: {
    flexDirection:  'row',
    alignItems:     'center',
    backgroundColor:'#F6F6F6',
    borderRadius:   Radius.md,
    paddingVertical:   Spacing[16],
    paddingHorizontal: Spacing[16],
    gap: Spacing[8],
  },
  appliedLabel:{ flex: 1, fontSize: FontSize.bodyMD },
  appliedValue:{ fontSize: FontSize.bodyMD },
});

// ─── OrderModSection ─────────────────────────────────────────────────────────

type OrderPalette = typeof ColorTokens.light;

function OrderModSection({
  label,
  applied,
  palette,
  onAdd,
  onRemove,
}: {
  label:    string;
  applied:  CartAppliedModifier | null | undefined;
  palette:  OrderPalette;
  onAdd?:   () => void;
  onRemove?:() => void;
}) {
  return (
    <View style={s.modSection}>
      <View style={s.modHeader}>
        <Text style={[s.modTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
          {label}
        </Text>
        <TouchableOpacity onPress={onAdd} activeOpacity={0.7}>
          <Text style={[s.modAdd, { fontFamily: FontFamily.textMedium }]}>+ Add</Text>
        </TouchableOpacity>
      </View>
      {applied && (
        <View style={s.appliedCard}>
          <Text style={[s.appliedLabel, { color: palette.textPrimary, fontFamily: FontFamily.textRegular }]}>
            {applied.label}
          </Text>
          <Text style={[s.appliedValue, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
            {applied.value}
          </Text>
          <TouchableOpacity onPress={onRemove} activeOpacity={0.7} style={{ padding: 4 }}>
            <Icon name="trash" size={20} color={palette.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
