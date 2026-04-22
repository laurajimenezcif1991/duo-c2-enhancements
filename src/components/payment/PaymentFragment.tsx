/**
 * PaymentFragment — ST Debit Nudge Experiment
 *
 * The payment selection overlay that replaces the Register bottom bar
 * when the cashier presses CHARGE on the Duo C1 (merchant screen).
 *
 * On the Duo C2 (customer screen) this renders as a full-screen takeover
 * that first presents the DebitNudgeCard, then transitions into the
 * standard payment method picker if the customer declines.
 *
 * States:
 *   'nudge'    → DebitNudgeCard experiment (default entry point)
 *   'methods'  → Full payment method list (customer declined nudge)
 *   'confirm'  → Post-selection confirmation (amount + method)
 *   'success'  → Payment accepted
 *
 * Layout: Duo C1 (600 × 912) — merchant side shows an inline status bar
 *         Duo C2 (600 × 360) — customer side shows full-screen fragment
 */

import React, { useState } from 'react';
import {
  Animated,
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
import { DebitNudgeCard, NudgeVariant } from './DebitNudgeCard';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentState = 'nudge' | 'methods' | 'confirm' | 'success';

export type PaymentMethod = {
  id:    string;
  label: string;
  icon:  string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'debit',       label: 'Debit Card',    icon: 'payment-credit-card' },
  { id: 'credit',      label: 'Credit Card',   icon: 'payment-credit-card' },
  { id: 'cash',        label: 'Cash',          icon: 'payment-cash'        },
  { id: 'wallet',      label: 'Digital Wallet',icon: 'payment-wallet'      },
  { id: 'qr',          label: 'QR Code',       icon: 'payment-qr'          },
  { id: 'other',       label: 'Other',         icon: 'payment-other'       },
];

export type PaymentFragmentProps = {
  chargeAmount?:   string;
  nudgeVariant?:   NudgeVariant;
  onComplete?:     (method: string) => void;
  onCancel?:       () => void;
  dark?:           boolean;
  /** 'c1' = merchant-facing (600×912), 'c2' = customer-facing (600×360) */
  screen?:         'c1' | 'c2';
  style?:          ViewStyle;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PaymentFragment({
  chargeAmount = '$0.00',
  nudgeVariant = 'savings',
  onComplete,
  onCancel,
  dark         = false,
  screen       = 'c2',
  style,
}: PaymentFragmentProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;
  const [state, setState]   = useState<PaymentState>('nudge');
  const [selected, setSelected] = useState<string | null>(null);

  const isC1 = screen === 'c1';

  // ── Merchant (C1) side: compact status bar ──────────────────────────────
  if (isC1) {
    return (
      <View style={[styles.c1Bar, { backgroundColor: '#111111' }, style]}>
        <View style={styles.c1Left}>
          <Icon name="payment-credit-card" size={20} color="#ffffff" />
          <Text style={[styles.c1Label, { fontFamily: FontFamily.textMedium, fontSize: FontSize.bodySM }]}>
            Awaiting payment…
          </Text>
        </View>
        <Text style={[styles.c1Amount, { fontFamily: FontFamily.textMedium, fontSize: FontSize.headingXS }]}>
          {chargeAmount}
        </Text>
        <TouchableOpacity onPress={onCancel} style={styles.c1Cancel} activeOpacity={0.75}>
          <Text style={[styles.c1CancelLabel, { fontFamily: FontFamily.textMedium, fontSize: FontSize.bodyXS }]}>
            CANCEL
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Customer (C2) side: full-screen payment fragment ────────────────────
  return (
    <View style={[styles.c2Root, { backgroundColor: palette.bgBase }, style]}>

      {/* Nudge state */}
      {state === 'nudge' && (
        <DebitNudgeCard
          variant={nudgeVariant}
          chargeAmount={chargeAmount}
          dark={dark}
          onDebitPress={() => {
            setSelected('debit');
            setState('confirm');
          }}
          onOtherPress={() => setState('methods')}
          style={styles.c2Card}
        />
      )}

      {/* Payment methods list */}
      {state === 'methods' && (
        <View style={[styles.c2Card, styles.methodsCard, { backgroundColor: palette.bgSurface }]}>
          <View style={[styles.methodsHeader, { borderBottomColor: palette.border }]}>
            <Text style={[styles.methodsTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.headingXS }]}>
              Choose payment
            </Text>
            <Text style={[styles.methodsAmount, { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodyXS }]}>
              {chargeAmount}
            </Text>
          </View>

          <View style={styles.methodsList}>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => { setSelected(method.id); setState('confirm'); }}
                activeOpacity={0.75}
                style={[
                  styles.methodRow,
                  { borderBottomColor: palette.border },
                ]}
              >
                <Icon name={method.icon as any} size={24} color={palette.contentPrimary} />
                <Text style={[styles.methodLabel, { color: palette.textPrimary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodySM }]}>
                  {method.label}
                </Text>
                <Icon name="chevron-right" size={18} color={palette.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Confirm state */}
      {state === 'confirm' && selected && (
        <View style={[styles.c2Card, styles.confirmCard, { backgroundColor: palette.bgSurface }]}>
          <Text style={[styles.confirmPrompt, { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodyXS }]}>
            {selected === 'debit' ? 'Insert, swipe, or tap your debit card' : `Complete payment with ${PAYMENT_METHODS.find(m => m.id === selected)?.label}`}
          </Text>
          <Text style={[styles.confirmAmount, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.heading3XL }]}>
            {chargeAmount}
          </Text>
          <View style={[styles.confirmIconRing, { borderColor: palette.contentAccent1 }]}>
            <Icon name="payment-credit-card" size={40} color={palette.contentAccent1} />
          </View>
          <TouchableOpacity
            onPress={() => onComplete?.(selected)}
            style={[styles.confirmBtn, { backgroundColor: palette.success }]}
            activeOpacity={0.85}
          >
            <Text style={[styles.confirmBtnLabel, { fontFamily: FontFamily.textBold, fontSize: FontSize.headingXS }]}>
              CONFIRM PAYMENT
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setState('methods')} style={styles.backLink}>
            <Text style={[styles.backLinkLabel, { color: palette.contentPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.bodyXS }]}>
              ← Change payment method
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Success state */}
      {state === 'success' && (
        <View style={[styles.c2Card, styles.successCard, { backgroundColor: palette.bgSurface }]}>
          <View style={[styles.successIcon, { backgroundColor: palette.successSubdued }]}>
            <Icon name="ok-filled" size={48} color={palette.success} />
          </View>
          <Text style={[styles.successTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.headingSM }]}>
            Payment approved
          </Text>
          <Text style={[styles.successAmount, { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodyXS }]}>
            {chargeAmount} charged
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // C1 (merchant-facing) compact bar
  c1Bar: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[20],
    gap:               Spacing[12],
  },
  c1Left: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[8],
  },
  c1Label: {
    color: '#ffffff',
  },
  c1Amount: {
    color: '#ffffff',
  },
  c1Cancel: {
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[8],
    borderRadius:      Radius.sm,
    borderWidth:       1,
    borderColor:       '#767676',
  },
  c1CancelLabel: {
    color: '#ffffff',
  },

  // C2 (customer-facing) full-screen root
  c2Root: {
    flex:    1,
    padding: Spacing[12],
  },
  c2Card: {
    flex:         1,
    borderRadius: Radius.lg,
    overflow:     'hidden',
  },

  // Methods list
  methodsCard: {},
  methodsHeader: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[20],
    paddingVertical:   Spacing[16],
    borderBottomWidth: 1,
  },
  methodsTitle: {},
  methodsAmount: {},
  methodsList: {
    flex: 1,
  },
  methodRow: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: Spacing[20],
    paddingVertical:   Spacing[14],
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap:               Spacing[12],
  },
  methodLabel: {
    flex: 1,
  },

  // Confirm
  confirmCard: {
    alignItems:     'center',
    justifyContent: 'center',
    gap:            Spacing[16],
    paddingHorizontal: Spacing[32],
  },
  confirmPrompt: {
    textAlign: 'center',
  },
  confirmAmount: {
    textAlign: 'center',
  },
  confirmIconRing: {
    width:          96,
    height:         96,
    borderRadius:   48,
    borderWidth:    2,
    alignItems:     'center',
    justifyContent: 'center',
  },
  confirmBtn: {
    width:          '100%',
    height:         56,
    borderRadius:   Radius.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },
  confirmBtnLabel: {
    color: '#ffffff',
  },
  backLink: {
    paddingVertical: Spacing[8],
  },
  backLinkLabel: {},

  // Success
  successCard: {
    alignItems:     'center',
    justifyContent: 'center',
    gap:            Spacing[12],
  },
  successIcon: {
    width:          88,
    height:         88,
    borderRadius:   44,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   Spacing[8],
  },
  successTitle: {},
  successAmount: {},
});
