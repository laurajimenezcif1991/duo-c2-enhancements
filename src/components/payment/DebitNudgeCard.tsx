/**
 * DebitNudgeCard — ST Debit Nudge Experiment
 *
 * The nudge UI that appears in the Payment Fragment when the cashier
 * initiates a CHARGE. Encourages the customer to pay with a debit card
 * by surfacing a benefit-forward message and a clear primary CTA.
 *
 * Experiment variants controlled via `variant` prop:
 *   'savings'     — "Skip the fee. Pay with debit."
 *   'speed'       — "Faster checkout. Tap to pay with debit."
 *   'rewards'     — "Earn points. Pay with debit." (future)
 *
 * Device: Duo C2 (600 × 360, customer-facing)
 */

import React, { useRef, useEffect } from 'react';
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

// ─── Experiment variants ──────────────────────────────────────────────────────

export type NudgeVariant = 'savings' | 'speed' | 'rewards';

type NudgeCopy = {
  eyebrow:    string;
  headline:   string;
  body:       string;
  ctaPrimary: string;
  ctaSecondary: string;
};

const NUDGE_COPY: Record<NudgeVariant, NudgeCopy> = {
  savings: {
    eyebrow:      'TIP FOR YOU',
    headline:     'Skip the fee.\nPay with debit.',
    body:         'Debit card payments have no surcharge — save a little on every purchase.',
    ctaPrimary:   'Pay with Debit',
    ctaSecondary: 'Other payment options',
  },
  speed: {
    eyebrow:      'QUICK CHECKOUT',
    headline:     'Tap and go.\nPay with debit.',
    body:         'Contactless debit is the fastest way to complete your purchase today.',
    ctaPrimary:   'Tap to Pay — Debit',
    ctaSecondary: 'Other payment options',
  },
  rewards: {
    eyebrow:      'EARN AS YOU SPEND',
    headline:     'More points.\nPay with debit.',
    body:         'Paying with your debit card earns loyalty points on every dollar spent.',
    ctaPrimary:   'Pay with Debit',
    ctaSecondary: 'Other payment options',
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export type DebitNudgeCardProps = {
  variant?:        NudgeVariant;
  chargeAmount?:   string;
  onDebitPress?:   () => void;
  onOtherPress?:   () => void;
  dark?:           boolean;
  style?:          ViewStyle;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function DebitNudgeCard({
  variant      = 'savings',
  chargeAmount = '$0.00',
  onDebitPress,
  onOtherPress,
  dark         = false,
  style,
}: DebitNudgeCardProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;
  const copy    = NUDGE_COPY[variant];

  // Subtle slide-up entrance animation
  const slideY  = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY,  { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: palette.bgSurface, transform: [{ translateY: slideY }], opacity },
        style,
      ]}
    >
      {/* ── Amount display ─────────────────────────────────────────────────── */}
      <View style={[styles.amountRow, { borderBottomColor: palette.border }]}>
        <Text style={[styles.amountLabel, { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.labelSM }]}>
          TOTAL DUE
        </Text>
        <Text style={[styles.amountValue, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.headingLG }]}>
          {chargeAmount}
        </Text>
      </View>

      {/* ── Nudge message ──────────────────────────────────────────────────── */}
      <View style={styles.nudgeBody}>
        {/* Accent bar */}
        <View style={[styles.accentBar, { backgroundColor: palette.contentAccent1 }]} />

        <View style={styles.nudgeCopy}>
          <Text style={[styles.eyebrow, { color: palette.contentAccent1, fontFamily: FontFamily.textBold, fontSize: FontSize.labelSM }]}>
            {copy.eyebrow}
          </Text>
          <Text style={[styles.headline, { color: palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.headingSM }]}>
            {copy.headline}
          </Text>
          <Text style={[styles.body, { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodyXS }]}>
            {copy.body}
          </Text>
        </View>
      </View>

      {/* ── CTAs ───────────────────────────────────────────────────────────── */}
      <View style={styles.ctaRow}>
        <TouchableOpacity
          onPress={onDebitPress}
          activeOpacity={0.85}
          style={[styles.ctaPrimary, { backgroundColor: palette.contentPrimary }]}
        >
          <Text style={[styles.ctaPrimaryLabel, { fontFamily: FontFamily.textBold, fontSize: FontSize.headingXS }]}>
            {copy.ctaPrimary}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOtherPress}
          activeOpacity={0.75}
          style={styles.ctaSecondary}
        >
          <Text style={[styles.ctaSecondaryLabel, { color: palette.contentPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.bodyXS }]}>
            {copy.ctaSecondary}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    flex:         1,
    borderRadius: Radius.lg,
    overflow:     'hidden',
  },

  // Amount strip
  amountRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[24],
    paddingVertical:   Spacing[16],
    borderBottomWidth: 1,
  },
  amountLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountValue: {},

  // Nudge section
  nudgeBody: {
    flex:          1,
    flexDirection: 'row',
    paddingTop:    Spacing[20],
    paddingBottom: Spacing[16],
    paddingLeft:   Spacing[24],
    paddingRight:  Spacing[24],
    gap:           Spacing[16],
  },
  accentBar: {
    width:        3,
    borderRadius: Radius.full,
    alignSelf:    'stretch',
    flexShrink:   0,
  },
  nudgeCopy: {
    flex: 1,
    gap:  Spacing[6],
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom:  Spacing[4],
  },
  headline: {
    lineHeight: FontSize.headingSM * 1.15,
  },
  body: {
    lineHeight: FontSize.bodyXS * 1.5,
    marginTop:  Spacing[4],
  },

  // CTAs
  ctaRow: {
    paddingHorizontal: Spacing[24],
    paddingBottom:     Spacing[20],
    paddingTop:        Spacing[8],
    gap:               Spacing[8],
  },
  ctaPrimary: {
    height:         56,
    borderRadius:   Radius.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },
  ctaPrimaryLabel: {
    color:         '#ffffff',
    textTransform: 'uppercase',
  },
  ctaSecondary: {
    height:         44,
    alignItems:     'center',
    justifyContent: 'center',
  },
  ctaSecondaryLabel: {
    textDecorationLine: 'underline',
  },
});
