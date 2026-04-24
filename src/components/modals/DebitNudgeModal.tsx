/**
 * DebitNudgeModal — Experiment #1 · Method #2
 *
 * Figma: Debit-nudge-experiment · node 34:11164
 *
 * Rendered as an absolute overlay *inside* the C1 screen (600 × 960),
 * NOT as a system Modal — so it is clipped to the device frame.
 *
 * Animation:
 *   • Scrim   — instant opacity (no transition)
 *   • Sheet   — spring slide-up from the C1 bottom edge
 *
 * Assets:
 *   • Illustration: assets/illustrations/modal-illo.png
 *   • GD logo icon / checkmark / x — from Icon component
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorTokens }          from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';
import { Radius, Spacing }      from '../../theme/spacing';
import { Icon }                 from '../ui/Icon';

// ─── Assets ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ILLUSTRATION = require('../../../assets/illustrations/modal-illo.png');

// ─── Constants ────────────────────────────────────────────────────────────────

/** C1 screen height — constrains the sheet ceiling */
const C1_H    = 960;
/** Sheet springs up from this far below the visible area */
const SHEET_H = C1_H;

// ─── Benefits ─────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    title: 'Faster settlement',
    body:  'Debit clears instantly. No waiting, money in your account sooner.',
  },
  {
    title: 'Works on every channel',
    body:  'In-person, invoices, paylinks — debit default applies everywhere.',
  },
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

export type DebitNudgeModalProps = {
  visible:       boolean;
  onSetDefault?: () => void;
  onMaybeLater?: () => void;
  onClose?:      () => void;
  dark?:         boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function DebitNudgeModal({
  visible,
  onSetDefault,
  onMaybeLater,
  onClose,
  dark = false,
}: DebitNudgeModalProps) {
  const palette  = dark ? ColorTokens.dark : ColorTokens.light;
  const dismiss  = onClose ?? onMaybeLater;

  // translateY: 0 → visible at bottom, SHEET_H → fully off-screen below
  const slideY   = useRef(new Animated.Value(SHEET_H)).current;
  // scrimOpacity: instant — driven by visible boolean, no animation needed
  const scrimRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Scrim: instant
      scrimRef.setValue(1);
      // Sheet: spring up
      Animated.spring(slideY, {
        toValue:        0,
        useNativeDriver: true,
        damping:        28,
        stiffness:      260,
        mass:           0.9,
      }).start();
    } else {
      // Sheet: spring down, then hide scrim
      Animated.spring(slideY, {
        toValue:        SHEET_H,
        useNativeDriver: true,
        damping:        28,
        stiffness:      280,
        mass:           0.8,
      }).start(() => scrimRef.setValue(0));
    }
  }, [visible, slideY, scrimRef]);

  // Don't mount anything until first shown
  if (!visible && slideY === slideY) {
    // We still render so the spring-out plays; but hide once off-screen
  }

  return (
    // Absolute fill over the C1 area — pointer events pass through when hidden
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[s.overlay, { opacity: scrimRef }]}
    >
      {/* Scrim — tap to dismiss */}
      <Pressable style={s.scrim} onPress={dismiss} />

      {/* Sheet */}
      <Animated.View
        style={[
          s.sheet,
          { backgroundColor: palette.bgSurface },
          { transform: [{ translateY: slideY }] },
        ]}
      >
        {/* Header: GD logo + close */}
        <View style={s.header}>
          <View style={s.logoRow}>
            <Icon name="gd-logo-icon" size={22} color={palette.textPrimary} />
            <Text style={[s.logoLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
              GoDaddy
            </Text>
          </View>
          <TouchableOpacity onPress={dismiss} style={s.closeBtn} activeOpacity={0.7}>
            <Icon name="x" size={20} color={palette.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Scrollable body */}
        <ScrollView
          style={s.body}
          contentContainerStyle={s.bodyContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Title */}
          <Text style={[s.title, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
            Encourage debit payments
          </Text>

          {/* Illustration */}
          <Image
            source={ILLUSTRATION}
            style={s.illustration}
            resizeMode="contain"
          />

          {/* Benefits */}
          <View style={s.benefits}>
            {BENEFITS.map((b, i) => (
              <View key={i} style={s.benefitRow}>
                <View style={s.checkWrap}>
                  <Icon name="checkmark" size={18} color={palette.textPrimary} />
                </View>
                <View style={s.benefitText}>
                  <Text style={[s.benefitTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                    {b.title}
                  </Text>
                  <Text style={[s.benefitBody, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
                    {b.body}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={[s.actions, { borderTopColor: palette.border }]}>
          <TouchableOpacity
            onPress={onSetDefault ?? dismiss}
            activeOpacity={0.8}
            style={[s.btn, { backgroundColor: palette.bgBase }]}
          >
            <Text style={[s.btnLabel, { color: '#ffffff', fontFamily: FontFamily.textMedium }]}>
              Set as default
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onMaybeLater ?? dismiss}
            activeOpacity={0.8}
            style={[s.btn, s.btnOutline, { borderColor: palette.contentTertiary }]}
          >
            <Text style={[s.btnLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
              Maybe later
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  // Fills the entire C1 screen area
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },

  // Dark background — instant
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  // Bottom sheet — height is driven by content; maxHeight prevents overflow
  sheet: {
    width:                600,
    maxHeight:            C1_H - 40,   // 40px top margin so scrim is visible
    borderTopLeftRadius:  16,
    borderTopRightRadius: 16,
    overflow:             'hidden',
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[20],
    paddingTop:        Spacing[20],
    paddingBottom:     Spacing[4],
  },

  logoRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[6],
  },

  logoLabel: {
    fontSize:   FontSize.bodySM,
    lineHeight: FontSize.bodySM * 1.2,
  },

  closeBtn: {
    width:          36,
    height:         36,
    borderRadius:   Radius.full,
    alignItems:     'center',
    justifyContent: 'center',
  },

  // ── Body ────────────────────────────────────────────────────────────────────
  // flexShrink: 1 lets the ScrollView contract when content is smaller than
  // maxHeight; flex: 1 would force it to fill all remaining space (creating the gap).
  body: {
    flexShrink: 1,
  },

  bodyContent: {
    paddingHorizontal: Spacing[40],
    paddingBottom:     Spacing[20],
    alignItems:        'center',
  },

  title: {
    fontSize:     FontSize.heading3XL,
    lineHeight:   FontSize.heading3XL * 1.2,
    textAlign:    'center',
    marginBottom: Spacing[16],
    marginTop:    Spacing[4],
  },

  illustration: {
    width:        300,
    height:       180,
    marginBottom: Spacing[16],
  },

  // ── Benefits ────────────────────────────────────────────────────────────────
  benefits: {
    width: '100%',
  },

  benefitRow: {
    flexDirection:   'row',
    alignItems:      'flex-start',
    gap:             Spacing[12],
    paddingVertical: Spacing[8],
  },

  checkWrap: {
    width:      22,
    alignItems: 'center',
    paddingTop: 1,
  },

  benefitText: {
    flex: 1,
    gap:  Spacing[2],
  },

  benefitTitle: {
    fontSize:   FontSize.headingXXS,
    lineHeight: FontSize.headingXXS * 1.2,
  },

  benefitBody: {
    fontSize:   FontSize.bodyXS,
    lineHeight: FontSize.bodyXS * 1.5,
  },

  // ── Actions ─────────────────────────────────────────────────────────────────
  actions: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               Spacing[12],
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[16],
    borderTopWidth:    1,
  },

  btn: {
    flex:           1,
    height:         64,
    borderRadius:   Radius.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },

  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth:     2,
  },

  btnLabel: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
  },
});
