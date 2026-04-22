/**
 * OrderSidebar — Register App (Pro layout only)
 *
 * Figma: node-id 6348-163177 — Sidebar (475px wide)
 *
 * Contains:
 *  - Add Customer Name (dark pill)
 *  - Add Note (teal pill)
 *  - Order items list (empty state: "Add Item to being the order")
 *  - Subtotal row
 *  - Tax toggle row
 *  - CANCEL / CASH / CHARGE bottom bar
 */

import React from 'react';
import {
  ScrollView,
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
import { Toggle } from '../ui/Toggle';
import { RegisterBottomBar } from './RegisterBottomBar';

export type OrderItem = {
  id:       string;
  name:     string;
  unitPrice: string;
  qty:      number;
  total:    string;
};

export type OrderSidebarProps = {
  customerName?:  string;
  note?:          string;
  items?:         OrderItem[];
  subtotal?:      string;
  taxAmount?:     string;
  taxEnabled?:    boolean;
  chargeAmount?:  string;
  onCustomerPress?: () => void;
  onNotePress?:   () => void;
  onTaxToggle?:   (val: boolean) => void;
  onEditItem?:    (id: string) => void;
  onDeleteItem?:  (id: string) => void;
  onCancel?:      () => void;
  onCash?:        () => void;
  onCharge?:      () => void;
  dark?:          boolean;
  style?:         ViewStyle;
};

export function OrderSidebar({
  customerName  = '',
  note          = '',
  items         = [],
  subtotal      = '$0.00',
  taxAmount     = '+$0.00',
  taxEnabled    = true,
  chargeAmount  = '$0.00',
  onCustomerPress,
  onNotePress,
  onTaxToggle,
  onEditItem,
  onDeleteItem,
  onCancel,
  onCash,
  onCharge,
  dark          = false,
  style,
}: OrderSidebarProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  return (
    <View style={[styles.sidebar, { backgroundColor: palette.bgSurface }, style]}>

      {/* ── Customer + Note pills ─────────────────────────────────────────── */}
      <View style={[styles.pills, { paddingBottom: Spacing[16] }]}>
        <TouchableOpacity
          onPress={onCustomerPress}
          style={[styles.pill, { backgroundColor: palette.bgBase, borderRadius: Radius.sm }]}
        >
          <Text style={[styles.pillText, { color: '#fff', fontFamily: FontFamily.textMedium, fontSize: FontSize.bodyMD }]}>
            {customerName || 'Add Customer Name'}
          </Text>
          <Icon name="edit" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNotePress}
          style={[styles.pill, { backgroundColor: palette.bgAccent, borderRadius: Radius.sm }]}
        >
          <Text style={[styles.pillText, { color: palette.textOnColour2, fontFamily: FontFamily.textMedium, fontSize: FontSize.bodyMD }]}>
            {note || 'Add Note'}
          </Text>
          <Icon name="edit" size={22} color={palette.contentAccent1} />
        </TouchableOpacity>
      </View>

      {/* ── Order items ───────────────────────────────────────────────────── */}
      <ScrollView style={styles.itemList} contentContainerStyle={styles.itemListContent}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodySM }]}>
              Add Item to being the order
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <View
              key={item.id}
              style={[styles.orderItem, { borderBottomColor: palette.bgSurface }]}
            >
              <View style={styles.orderItemLeft}>
                <Text style={[styles.orderItemName, { color: palette.textPrimary, fontFamily: FontFamily.textBold, fontSize: FontSize.bodySM }]}>
                  {item.name}
                </Text>
                <Text style={[styles.orderItemMeta, { color: palette.textSecondary, fontFamily: FontFamily.textMedium, fontSize: FontSize.bodySM }]}>
                  {item.qty} × {item.unitPrice}
                </Text>
              </View>
              <View style={styles.orderItemRight}>
                <Text style={[styles.orderItemTotal, { color: palette.textPrimary, fontFamily: FontFamily.textBold, fontSize: FontSize.bodySM }]}>
                  {item.total}
                </Text>
                <View style={styles.orderItemActions}>
                  <TouchableOpacity onPress={() => onEditItem?.(item.id)} style={styles.actionIcon}>
                    <Icon name="edit" size={22} color={palette.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDeleteItem?.(item.id)} style={styles.actionIcon}>
                    <Icon name="trash" size={22} color={palette.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── Subtotal + Tax ────────────────────────────────────────────────── */}
      <View style={[styles.totals, { borderTopColor: palette.border }]}>
        {/* Subtotal */}
        <View style={[styles.totalRow, { backgroundColor: palette.bgSurface, borderBottomColor: palette.bgSurface }]}>
          <Text style={[styles.totalLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.bodyMD }]}>
            Subtotal
          </Text>
          <Text style={[styles.totalValue, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.bodyMD }]}>
            {subtotal}
          </Text>
        </View>

        {/* Tax */}
        <View style={[styles.taxRow, { backgroundColor: palette.bgLight, borderTopColor: palette.border }]}>
          <View style={styles.taxLeft}>
            <Icon name="information" size={22} color={palette.textPrimary} />
            <Text style={[styles.totalLabel, { color: palette.textPrimary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodyMD, marginLeft: Spacing[8] }]}>
              Tax
            </Text>
            <Toggle
              value={taxEnabled}
              onChange={(v) => onTaxToggle?.(v)}
              style={{ marginLeft: Spacing[16] }}
            />
          </View>
          <Text style={[styles.totalValue, { color: palette.textPrimary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodyMD }]}>
            {taxAmount}
          </Text>
        </View>
      </View>

      {/* ── Bottom action buttons ─────────────────────────────────────────── */}
      <RegisterBottomBar
        chargeAmount={chargeAmount}
        onCancel={onCancel}
        onCash={onCash}
        onCharge={onCharge}
        dark={dark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    flexDirection: 'column',
  },
  pills: {
    paddingHorizontal: Spacing[16],
    paddingTop:        Spacing[8],
    gap:               Spacing[8],
  },
  pill: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical:  Spacing[16],
  },
  pillText: {
    flex: 1,
    marginRight: Spacing[8],
  },
  itemList: {
    flex: 1,
  },
  itemListContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing[8],
  },
  emptyState: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: Spacing[48],
  },
  emptyText: {
    textAlign: 'center',
  },
  orderItem: {
    flexDirection:    'row',
    paddingHorizontal: Spacing[8],
    paddingVertical:  Spacing[12],
    borderBottomWidth: 1,
    gap:              Spacing[16],
  },
  orderItemLeft: {
    flex: 1,
  },
  orderItemName: {
    marginBottom: Spacing[4],
  },
  orderItemMeta: {},
  orderItemRight: {
    alignItems: 'flex-end',
    gap:        Spacing[8],
  },
  orderItemTotal: {},
  orderItemActions: {
    flexDirection: 'row',
    gap:           Spacing[16],
  },
  actionIcon: {
    padding: Spacing[8],
  },
  totals: {
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: Spacing[20],
    paddingVertical:   Spacing[12],
    borderBottomWidth: 1,
    height:           68,
  },
  totalLabel: {},
  totalValue: {
    textAlign: 'right',
  },
  taxRow: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: Spacing[20],
    paddingVertical:  Spacing[12],
    borderTopWidth:   1,
    height:           68,
  },
  taxLeft: {
    flexDirection: 'row',
    alignItems:    'center',
  },
});
