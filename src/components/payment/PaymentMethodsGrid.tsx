/**
 * PaymentMethodsGrid
 *
 * Pure content tooltip — renders the triangle + white grid card.
 * Positioning and backdrop are handled by the parent (C1PaymentPanel).
 *
 * Figma: node 23:21395
 */

import React from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontFamily } from '../../theme/typography';
import { Icon, type IconName } from '../ui/Icon';

/**
 * Forces an icon to render as pure white on web by applying a CSS filter.
 * Many SVGs have hardcoded fill colours on inner paths; this override ensures
 * they always appear white regardless of the SVG's internal fill attributes.
 */
function WhiteIcon({ name, size }: { name: IconName; size: number }) {
  if (Platform.OS === 'web') {
    return (
      <View style={{ filter: 'brightness(0) invert(1)' } as any}>
        <Icon name={name} size={size} color="#ffffff" />
      </View>
    );
  }
  return <Icon name={name} size={size} color="#ffffff" />;
}

// ─── Method definitions ───────────────────────────────────────────────────────

export type MethodId =
  | 'debit' | 'credit' | 'cash'
  | 'manual' | 'multi-tender' | 'force'
  | 'foodstamp' | 'ebt-voucher' | 'ebt-cash'
  | 'gift-card' | 'check' | 'other';

export type PaymentMethod = {
  id:       MethodId;
  label:    string;
  icon:     IconName;
  color:    string;
  /** Debit/credit toggle freely; all others lock permanently */
  isToggle?: boolean;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  // Row 1
  { id: 'debit',        label: 'DEBIT',        icon: 'card-bank',               color: '#12afab', isToggle: true },
  { id: 'credit',       label: 'CREDIT',       icon: 'credit-card',             color: '#1e9af7', isToggle: true },
  { id: 'cash',         label: 'CASH',         icon: 'cash',                    color: '#5ebc5e' },
  // Row 2
  { id: 'manual',       label: 'MANUAL ENTRY', icon: 'card-reader-sell-mode-32',color: '#3c69a0' },
  { id: 'multi-tender', label: 'MULTI-TENDER', icon: 'payment-multi-tender',    color: '#3c69a0' },
  { id: 'force',        label: 'FORCE',        icon: 'card-payment-32',         color: '#3c69a0' },
  // Row 3
  { id: 'foodstamp',    label: 'FOODSTAMP',    icon: 'payment-ebt',             color: '#375270' },
  { id: 'ebt-voucher',  label: 'EBT VOUCHER',  icon: 'ebt',                     color: '#375270' },
  { id: 'ebt-cash',     label: 'EBT CASH',     icon: 'ebt',                     color: '#375270' },
  // Row 4
  { id: 'gift-card',    label: 'GIFT CARD',    icon: 'gift',                    color: '#87a7bf' },
  { id: 'check',        label: 'CHECK',        icon: 'dollar',                  color: '#87a7bf' },
  { id: 'other',        label: 'OTHER',        icon: 'payment-other',           color: '#87a7bf' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

type PaymentMethodsGridProps = {
  selected:  MethodId | null;
  locked:    boolean;
  onSelect:  (m: PaymentMethod) => void;
  animY:     Animated.Value;
  animO:     Animated.Value;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PaymentMethodsGrid({
  selected,
  locked,
  onSelect,
  animY,
  animO,
}: PaymentMethodsGridProps) {
  return (
    <Animated.View
      style={[sg.root, { opacity: animO, transform: [{ translateY: animY }] }]}
    >
      {/* Triangle pointer — anchored to the right side (toward Payment methods btn) */}
      <View style={sg.arrowRow}>
        <View style={sg.arrow} />
      </View>

      {/* White card container */}
      <View style={sg.grid}>
        {PAYMENT_METHODS.map((method) => {
          const isSelected = method.id === selected;
          const isDisabled = locked;

          return (
            <TouchableOpacity
              key={method.id}
              style={[sg.card, { backgroundColor: isDisabled ? '#a0a0a0' : method.color }]}
              onPress={() => { if (!isDisabled) onSelect(method); }}
              activeOpacity={isDisabled ? 1 : 0.8}
            >
              {/* Radio indicator */}
              <View style={[sg.radio, isSelected && sg.radioSelected]}>
                {isSelected && <Text style={sg.radioCheck}>✓</Text>}
              </View>

              <WhiteIcon name={method.icon} size={30} />

              <Text style={sg.cardLabel} numberOfLines={1}>
                {method.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_W = 116;
const CARD_H = 86;
const GAP    = 10;
const PAD    = 12;

const sg = StyleSheet.create({
  root: {
    // Pure content — no absolute positioning; parent places this view
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius:  14,
    elevation:     14,
  },

  arrowRow: {
    flexDirection:  'row',
    justifyContent: 'flex-end',
    paddingRight:   24,
    marginBottom:   -1,     // overlap 1px so no gap between arrow and card
  },

  arrow: {
    width:             0,
    height:            0,
    borderLeftWidth:   9,
    borderRightWidth:  9,
    borderBottomWidth: 11,
    borderLeftColor:   'transparent',
    borderRightColor:  'transparent',
    borderBottomColor: '#ffffff',
  },

  grid: {
    backgroundColor: '#ffffff',
    borderRadius:    6,
    padding:         PAD,
    flexDirection:   'row',
    flexWrap:        'wrap',
    gap:             GAP,
    width:           CARD_W * 3 + GAP * 2 + PAD * 2,
  },

  card: {
    width:          CARD_W,
    height:         CARD_H,
    borderRadius:   4.5,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            3,
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius:  2,
    elevation:     3,
  },

  radio: {
    position:        'absolute',
    top:             4,
    left:            4,
    width:           17,
    height:          17,
    borderRadius:    8.5,
    borderWidth:     1.5,
    borderColor:     '#ffffff',
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: 'transparent',
  },

  radioSelected: {
    backgroundColor: '#ffffff',
  },

  radioCheck: {
    fontSize:   9,
    lineHeight: 11,
    color:      '#12afab',
    fontWeight: '700',
  },

  cardLabel: {
    fontFamily:    FontFamily.textMedium,
    fontSize:      10,
    color:         '#ffffff',
    textAlign:     'center',
    letterSpacing: 0.3,
  },
});
