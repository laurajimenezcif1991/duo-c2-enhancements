/**
 * RegisterDuoC2Screen — ST Debit Nudge Experiment
 *
 * Duo C2 (600 × 360) — customer-facing landscape screen.
 *
 * Idle state:   "Ready to pay" placeholder (mirrors standard C2 idle)
 * Payment state: PaymentFragment full-screen (DebitNudgeCard experiment)
 *
 * This screen is the primary experiment canvas — the DebitNudgeCard
 * renders here with A/B variant copy to test debit adoption lift.
 *
 * Device: Duo C2 · 600 × 360 · Android OS
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ColorTokens } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { SystemStatusBar } from '../components/ui/SystemStatusBar';
import { BottomNavBar }    from '../components/ui/BottomNavBar';
import { PaymentFragment } from '../components/payment/PaymentFragment';
import type { NudgeVariant } from '../components/payment/DebitNudgeCard';

// ─── Props ────────────────────────────────────────────────────────────────────

type RegisterDuoC2ScreenProps = {
  dark?:           boolean;
  nudgeVariant?:   NudgeVariant;
  paymentActive?:  boolean;
  chargeAmount?:   string;
  onPaymentComplete?: (method: string) => void;
  onPaymentCancel?:   () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterDuoC2Screen({
  dark             = false,
  nudgeVariant     = 'savings',
  paymentActive    = false,
  chargeAmount     = '$12.50',
  onPaymentComplete,
  onPaymentCancel,
}: RegisterDuoC2ScreenProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  return (
    <View style={[styles.root, { backgroundColor: palette.bgBase }]}>
      {/* Thin OS status bar */}
      <SystemStatusBar variant={dark ? 'black' : 'white'} />

      {/* Main content area */}
      <View style={styles.content}>
        {paymentActive ? (
          /* ── Experiment: DebitNudge full-screen ─────────────────────── */
          <PaymentFragment
            screen="c2"
            chargeAmount={chargeAmount}
            nudgeVariant={nudgeVariant}
            dark={dark}
            onComplete={onPaymentComplete}
            onCancel={onPaymentCancel}
            style={styles.fragment}
          />
        ) : (
          /* ── Idle: ready-to-pay placeholder ─────────────────────────── */
          <View style={styles.idle}>
            <Text style={[styles.idleTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.headingXS }]}>
              Ready for your order
            </Text>
            <Text style={[styles.idleSub, { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodyXS }]}>
              Your cashier is preparing your total
            </Text>
          </View>
        )}
      </View>

      {/* OS nav bar */}
      <BottomNavBar />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex:  1,
    width: 600,
  },
  content: {
    flex: 1,
  },
  fragment: {
    flex: 1,
  },
  idle: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            8,
  },
  idleTitle: {},
  idleSub: {},
});
