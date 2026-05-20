/**
 * PaymentFragment — ST Debit Nudge Experiment
 *
 * C1 (merchant) — Floating panel overlay (480 × 751) positioned inside the
 *   600 × 960 screen. Shows behind a soft scrim; register remains visible.
 *   Figma: node 14:12986 · "Oficial" frame
 *
 *   Layout (top → bottom):
 *     Header   86px  #ededed  — C2 Variant selector + Payment methods
 *     Summary 153px  white    — SALE + poynt-card icon / amount
 *     Tabs     65px  white    — SUMMARY | NOTES | RECEIPT dividers
 *     Main    303px  #2544b7  — poynt-card-payment illo + "Tap, Insert or Swipe Card"
 *     Cancel   96px  white    — CANCEL button
 *     Footer   48px  #f5f5f5  — Powered by GoDaddy
 *
 * C2 (customer) — Full-screen prompt.
 *   Figma: nodes 89:8486 (A) · 89:8860 (B) · 89:8556 (C)
 *   Tap/click the NFC area → payment confirmed.
 *   States: 'waiting' → 'processing' → 'success'
 *   Variant nudge row (waiting only):
 *     A — "Debit or Credit card"
 *     B — ✓ "Choose debit—it's faster"
 *     C — [card-bank] "Debit? Fast and easy"
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { FontFamily, FontSize } from '../../theme/typography';
import { Spacing }              from '../../theme/spacing';
import { Icon }                 from '../ui/Icon';
import {
  PaymentMethodsGrid,
  type MethodId,
  type PaymentMethod,
} from './PaymentMethodsGrid';

// ─── Brand palette (Poynt / GD payment terminal) ──────────────────────────────

const PF = {
  blue:        '#2544b7',
  blueLight:   '#5068c0',
  headerBg:    '#ededed',
  border:      '#cccccc',
  textDark:    '#4a4a4a',
  amountColor: '#133247',
  green:       '#4caf50',
  nudgeGreen:  '#00a63f',
  white:       '#ffffff',
  nudgeDark:   '#353233',
  nudgeGray:   '#767676',
};

// ─── C2 variant type ─────────────────────────────────────────────────────────

export type C2Variant = 'A' | 'B' | 'C';

// ─── C1 panel width (480px centered inside 600px C1 screen) ──────────────────

const PANEL_W = 480;

// ─── Props ────────────────────────────────────────────────────────────────────

export type PaymentFragmentProps = {
  chargeAmount?:    string;
  onComplete?:      (method: string) => void;
  onCancel?:        () => void;
  screen?:          'c1' | 'c2';
  style?:           ViewStyle;
  /** unused but kept for API compat */
  nudgeVariant?:    string;
  dark?:            boolean;
};

// ─── Shared: fade + scale entrance ───────────────────────────────────────────

function useModalAnim(visible: boolean) {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const scale   = useRef(new Animated.Value(visible ? 1 : 0.92)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(scale,   { toValue: 1, damping: 24, stiffness: 280, mass: 0.8, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 130, useNativeDriver: true }),
        Animated.timing(scale,   { toValue: 0.92, duration: 130, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, opacity, scale]);

  return { opacity, scale };
}

// ═════════════════════════════════════════════════════════════════════════════
// C1 — Floating payment panel
// ═════════════════════════════════════════════════════════════════════════════

type C1PanelProps = {
  chargeAmount:    string;
  visible:         boolean;
  onCancel?:       () => void;
};

const GRID_TOP   = 208;
const GRID_RIGHT = 60;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const POYNT_CARD_PNG = require('../../../assets/icons/poynt-card-payment.png');

export function C1PaymentPanel({
  chargeAmount,
  visible,
  onCancel,
}: C1PanelProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'notes' | 'receipt'>('summary');

  // ── Grid state ────────────────────────────────────────────────────────────
  const [selectedMethod, setSelectedMethod] = useState<MethodId | null>(null);
  const [lockedMethod, setLockedMethod]     = useState<string | null>(null);
  const [lockedColor,  setLockedColor]      = useState<string | null>(null);
  const [gridOpen, setGridOpen]             = useState(false);

  const gridAnimO = useRef(new Animated.Value(0)).current;
  const gridAnimY = useRef(new Animated.Value(-8)).current;

  const openGrid = () => {
    if (lockedMethod) return;
    setGridOpen(true);
    Animated.parallel([
      Animated.timing(gridAnimO, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.spring(gridAnimY,  { toValue: 0, damping: 22, stiffness: 260, mass: 0.7, useNativeDriver: true }),
    ]).start();
  };

  const handleCancel = () => {
    setSelectedMethod(null);
    setLockedMethod(null);
    setLockedColor(null);
    setGridOpen(false);
    gridAnimO.setValue(0);
    gridAnimY.setValue(-8);
    onCancel?.();
  };

  const closeGrid = () => {
    Animated.parallel([
      Animated.timing(gridAnimO, { toValue: 0, duration: 130, useNativeDriver: true }),
      Animated.timing(gridAnimY, { toValue: -8, duration: 130, useNativeDriver: true }),
    ]).start(() => setGridOpen(false));
  };

  const handleMethodSelect = (m: PaymentMethod) => {
    setSelectedMethod(m.id);
    setLockedMethod(m.label);
    setLockedColor(m.color);
    closeGrid();
  };

  const dropdownLabel = lockedMethod ?? 'Payment methods';
  const isLocked = lockedMethod !== null;

  const { opacity, scale } = useModalAnim(visible);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[s1.container, { opacity }]}
    >
      {/* Scrim behind panel */}
      <Pressable style={s1.scrim} onPress={handleCancel} />

      {/* Panel */}
      <Animated.View style={[s1.panel, { transform: [{ scale }] }]}>

        {/* ── Header: SALE label + payment methods ──────────────────────── */}
        <View style={s1.header}>
          {/* SALE label — vertically centered with the dropdown */}
          <Text style={s1.saleHeaderLabel}>SALE</Text>

          {/* Payment methods dropdown */}
          <TouchableOpacity
            style={[
              s1.methodsBtn,
              isLocked && lockedColor
                ? { backgroundColor: lockedColor, borderColor: lockedColor }
                : null,
            ]}
            activeOpacity={isLocked ? 1 : 0.8}
            onPress={openGrid}
          >
            <Text style={[s1.methodsBtnLabel, isLocked && s1.methodsBtnLabelLocked]}>
              {dropdownLabel}
            </Text>
            {!isLocked && <Icon name="chevron-down" size={14} color={PF.textDark} />}
          </TouchableOpacity>
        </View>

        {/* ── Summary row ───────────────────────────────────────────────── */}
        <View style={s1.summary}>
          <Icon name="credit-card" size={48} color={PF.textDark} />
          <Text style={s1.amount}>{chargeAmount}</Text>
        </View>

        {/* ── Tab row ───────────────────────────────────────────────────── */}
        <View style={s1.tabs}>
          <View style={s1.tabDivider} />
          <View style={s1.tabRow}>
            {(['summary', 'notes', 'receipt'] as const).map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={s1.tabItem}
                activeOpacity={0.7}
              >
                <Text style={[s1.tabLabel, { color: activeTab === tab ? PF.textDark : PF.border }]}>
                  {tab.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={s1.tabDivider} />
        </View>

        {/* ── Main blue area ────────────────────────────────────────────── */}
        <View style={s1.main}>
          <Image source={POYNT_CARD_PNG} style={s1.poyntCardImg} resizeMode="contain" />
          <Text style={s1.tapLabel}>
            {isLocked ? `Payment: ${lockedMethod}` : 'Tap, Insert or Swipe Card'}
          </Text>
          <TouchableOpacity style={s1.manualBtn} activeOpacity={0.8}>
            <Icon name="card-reader-sell-mode-32" size={20} color={PF.white} />
            <Text style={s1.manualBtnLabel}>MANUAL ENTRY</Text>
          </TouchableOpacity>
        </View>

        {/* ── Cancel button ────────────────────────────────────────────── */}
        <TouchableOpacity onPress={handleCancel} style={s1.cancelRow} activeOpacity={0.75}>
          <Text style={s1.cancelLabel}>CANCEL</Text>
        </TouchableOpacity>

        {/* ── Footer: Powered by GoDaddy ───────────────────────────────── */}
        <View style={s1.footer}>
          <View style={s1.footerLeft}>
            <Icon name="locked" size={13} color={PF.white} />
          </View>
          <View style={s1.footerRight}>
            <Icon name="gd-logo-icon" size={16} color={PF.white} />
            <Text style={s1.footerBrand}>GoDaddy</Text>
          </View>
        </View>
      </Animated.View>

      {/* ── Payment methods grid tooltip ───────────────────────────────────── */}
      {gridOpen && (
        <>
          <Pressable style={s1.gridBackdrop} onPress={closeGrid} />
          <View style={[s1.gridAnchor, { top: GRID_TOP, right: GRID_RIGHT }]}
                pointerEvents="box-none">
            <PaymentMethodsGrid
              selected={selectedMethod}
              locked={isLocked}
              onSelect={handleMethodSelect}
              animY={gridAnimY}
              animO={gridAnimO}
            />
          </View>
        </>
      )}
    </Animated.View>
  );
}

// ─── C1 styles ────────────────────────────────────────────────────────────────

const s1 = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems:     'center',
    justifyContent: 'center',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  panel: {
    width:           PANEL_W,
    backgroundColor: PF.white,
    borderRadius:    12,
    overflow:        'hidden',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 8 },
    shadowOpacity:   0.22,
    shadowRadius:    20,
    elevation:       24,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    backgroundColor:   PF.headerBg,
    paddingHorizontal: 16,
    height:            86,
  },

  // ── SALE label in header ─────────────────────────────────────────────────
  saleHeaderLabel: {
    fontFamily: FontFamily.textBold,
    fontSize:   22,
    color:      PF.textDark,
    letterSpacing: 0.5,
  },

  methodsBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    borderWidth:       1.5,
    borderColor:       PF.border,
    borderRadius:      6,
    paddingHorizontal: 12,
    paddingVertical:   13,
    backgroundColor:   PF.white,
  },
  methodsBtnLocked: {
    backgroundColor: '#f5f5f5',
    borderColor:     '#aaa',
  },
  methodsBtnLabel: {
    fontFamily: FontFamily.textRegular,
    fontSize:   FontSize.bodySM,
    color:      PF.textDark,
  },
  methodsBtnLabelLocked: {
    color:      PF.white,
    fontFamily: FontFamily.textMedium,
  },

  // ── Grid positioning ──────────────────────────────────────────────────────
  gridBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 150,
  },
  gridAnchor: {
    position: 'absolute',
    zIndex:   200,
  },

  // ── Summary ─────────────────────────────────────────────────────────────
  summary: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    padding:           16,
    height:            153,
    backgroundColor:   PF.white,
  },
  summaryLeft: {
    gap: Spacing[20],
  },
  saleLabel: {
    fontFamily: FontFamily.textBold,
    fontSize:   18,
    color:      PF.textDark,
  },
  amount: {
    fontFamily: FontFamily.displayRegular,
    fontSize:   54,
    lineHeight: 58,
    color:      PF.amountColor,
    textAlign:  'right',
  },

  // ── Tabs ────────────────────────────────────────────────────────────────
  tabs: {
    height:          65,
    backgroundColor: PF.white,
    justifyContent:  'space-between',
  },
  tabDivider: {
    height:          2,
    backgroundColor: PF.border,
  },
  tabRow: {
    flex:           1,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            46,
  },
  tabItem: {
    paddingHorizontal: 4,
    height:            '100%',
    alignItems:        'center',
    justifyContent:    'center',
  },
  tabLabel: {
    fontFamily: FontFamily.textRegular,
    fontSize:   16,
    lineHeight: 20,
  },

  // ── Main blue area ───────────────────────────────────────────────────────
  main: {
    height:          240,
    backgroundColor: PF.blue,
    alignItems:      'center',
    justifyContent:  'center',
    gap:             Spacing[20],
  },
  poyntCardImg: {
    width:  70,
    height: 90,
  },
  tapLabel: {
    fontFamily: FontFamily.displayRegular,
    fontSize:   24,
    lineHeight: 30,
    color:      PF.white,
    textAlign:  'center',
    paddingHorizontal: 24,
  },
  manualBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               10,
    backgroundColor:   PF.blueLight,
    borderRadius:      8,
    paddingHorizontal: 24,
    paddingVertical:   14,
  },
  manualBtnLabel: {
    fontFamily:  FontFamily.textMedium,
    fontSize:    16,
    color:       PF.white,
    letterSpacing: 0.5,
  },

  // ── Cancel ──────────────────────────────────────────────────────────────
  cancelRow: {
    height:         96,
    alignItems:     'center',
    justifyContent: 'center',
    backgroundColor: PF.white,
  },
  cancelLabel: {
    fontFamily: FontFamily.textBold,
    fontSize:   21,
    color:      PF.textDark,
  },

  // ── Footer ──────────────────────────────────────────────────────────────
  footer: {
    height:            48,
    backgroundColor:   '#333333',
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 16,
  },
  footerLeft: {
    alignItems:     'center',
    justifyContent: 'center',
  },
  footerRight: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            5,
  },
  footerBrand: {
    fontFamily:  FontFamily.textMedium,
    fontSize:    14,
    color:       PF.white,
    letterSpacing: 0.2,
  },
});

// ═════════════════════════════════════════════════════════════════════════════
// C2 — Customer payment prompt (full-screen)
// ═════════════════════════════════════════════════════════════════════════════

type C2PromptState = 'waiting' | 'processing' | 'success';

type C2PromptProps = {
  chargeAmount: string;
  onComplete?:  (method: string) => void;
  variant?:     C2Variant;
};

export function C2PaymentPrompt({ chargeAmount, onComplete, variant = 'A' }: C2PromptProps) {
  const [state, setState] = useState<C2PromptState>('waiting');

  // Pulse animation removed — NFC icon is static

  // Reset state when variant changes so stakeholders see a fresh screen
  useEffect(() => { setState('waiting'); }, [variant]);

  const handleTap = () => {
    if (state !== 'waiting') return;
    setState('processing');
    setTimeout(() => {
      setState('success');
      setTimeout(() => onComplete?.('debit'), 1200);
    }, 900);
  };

  return (
    <View style={s2.root}>

      {/* ── Top bar: dots + PURCHASE | amount ─────────────────────────── */}
      <View style={s2.topBar}>
        <View style={s2.topLeft}>
          <View style={s2.dotsRow}>
            <View style={[s2.dot, { backgroundColor: PF.nudgeGreen }]} />
            <View style={[s2.dot, { backgroundColor: PF.border }]} />
            <View style={[s2.dot, { backgroundColor: PF.border }]} />
            <View style={[s2.dot, { backgroundColor: PF.border }]} />
          </View>
          <Text style={s2.purchaseLabel}>PURCHASE</Text>
        </View>
        <Text style={s2.amountLabel}>{chargeAmount}</Text>
      </View>

      {/* ── Centre: NFC tap target ─────────────────────────────────────── */}
      <View style={s2.centre}>
        {state === 'success' ? (
          <>
            <Icon name="check-filled" size={72} color={PF.nudgeGreen} />
            <Text style={[s2.promptLabel, { color: PF.nudgeGreen }]}>
              Payment Approved
            </Text>
          </>
        ) : (
          <>
            {/* ── Instruction label — above NFC icon ──────────────────── */}
            <Text style={s2.promptLabel}>
              {state === 'processing' ? 'Processing…' : 'Tap, Insert or Swipe'}
            </Text>

            <TouchableOpacity
              onPress={handleTap}
              activeOpacity={0.75}
              style={s2.nfcBtn}
              disabled={state !== 'waiting'}
            >
              <Icon name="nfc" size={112} color="#111111" />
            </TouchableOpacity>

            {state === 'waiting' && <NudgeRow variant={variant} />}
          </>
        )}
      </View>
    </View>
  );
}

// ─── NudgeRow — variant-specific debit nudge ─────────────────────────────────

function NudgeRow({ variant }: { variant: C2Variant }) {
  if (variant === 'A') {
    return null;
  }
  if (variant === 'B') {
    return (
      <View style={s2.nudgeRow}>
        <Icon name="checkmark" size={20} color={PF.nudgeDark} />
        <Text style={s2.nudgeText}>Choose debit—it&apos;s faster</Text>
      </View>
    );
  }
  // Variant C
  return (
    <View style={s2.nudgeRow}>
      <Icon name="card-bank" size={22} color={PF.nudgeDark} />
      <Text style={s2.nudgeText}>Debit? Fast and easy</Text>
    </View>
  );
}

// ─── C2 styles ────────────────────────────────────────────────────────────────

const s2 = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: PF.white,
  },

  topBar: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    justifyContent:    'space-between',
    paddingHorizontal: 19,
    paddingTop:        16,
    paddingBottom:     8,
  },
  topLeft: {
    gap: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    gap:           13,
    alignItems:    'center',
  },
  dot: {
    width:        13,
    height:       13,
    borderRadius: 6.5,
  },
  purchaseLabel: {
    fontFamily:  FontFamily.textBold,
    fontSize:    14,
    color:       PF.nudgeGreen,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  amountLabel: {
    fontFamily: FontFamily.displayMedium,
    fontSize:   40,
    lineHeight: 48,
    color:      '#111111',
    textAlign:  'right',
  },

  centre: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            16,
    paddingBottom:  16,
  },
  nfcBtn: {
    alignItems:     'center',
    justifyContent: 'center',
  },
  promptLabel: {
    fontFamily: FontFamily.displayRegular,
    fontSize:   28,
    lineHeight: 34,
    color:      '#2544B7',
    textAlign:  'center',
    paddingHorizontal: 24,
  },

  // ── Nudge row ────────────────────────────────────────────────────────────
  nudgeRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            8,
    paddingVertical:  4,
    paddingHorizontal: 16,
  },
  nudgeText: {
    fontFamily: FontFamily.displayMedium,
    fontSize:   24,
    lineHeight: 30,
    color:      PF.nudgeDark,
    textAlign:  'center',
  },
  nudgeTextBold: {
    fontFamily: FontFamily.displayMedium,
    fontSize:   24,
    lineHeight: 30,
    color:      PF.nudgeDark,
    textAlign:  'center',
  },
});

// ═════════════════════════════════════════════════════════════════════════════
// PaymentFragment — backward-compat wrapper
// ═════════════════════════════════════════════════════════════════════════════

export function PaymentFragment({
  chargeAmount = '$0.00',
  onComplete,
  onCancel,
  screen = 'c2',
  style,
}: PaymentFragmentProps) {
  if (screen === 'c1') {
    return (
      <C1PaymentPanel
        chargeAmount={chargeAmount}
        visible
        onCancel={onCancel}
      />
    );
  }
  return (
    <View style={[{ flex: 1 }, style]}>
      <C2PaymentPrompt chargeAmount={chargeAmount} onComplete={onComplete} />
    </View>
  );
}
