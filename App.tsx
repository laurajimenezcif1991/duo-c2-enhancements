/**
 * App — ST Debit Nudge Experiment
 *
 * Entry point for the experiment. Loads fonts and renders the Duo device
 * layout directly — no design system showcase or navigation chrome.
 *
 * The app presents both Duo screens side-by-side in a scrollable canvas
 * so the full merchant+customer flow is visible during development.
 *
 * In production the two screens would run on their respective physical
 * displays (C1 = merchant, C2 = customer).
 *
 * ┌─────────────────┬─────────────────┐
 * │   Duo C1        │   Duo C2        │
 * │   Merchant      │   Customer      │
 * │   600 × 912     │   600 × 360     │
 * └─────────────────┴─────────────────┘
 *
 * Experiment controls (top strip — dev only):
 *   • Nudge variant picker: savings | speed | rewards
 *   • Dark mode toggle
 */

import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFonts } from 'expo-font';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import { RegisterDuoScreen }   from './src/screens/RegisterDuoScreen';
import { RegisterDuoC2Screen } from './src/screens/RegisterDuoC2Screen';
import type { NudgeVariant } from './src/components/payment/DebitNudgeCard';

// ─── Fonts ────────────────────────────────────────────────────────────────────

const FONTS = {
  'GDSherpaDisplay-Regular': require('./assets/fonts/GDSherpa-Display-Regular.otf'),
  'GDSherpaDisplay-Medium':  require('./assets/fonts/GDSherpa-Display-Medium.otf'),
  'GDSherpaText-Regular':    require('./assets/fonts/GDSherpa-Text-Regular.otf'),
  'GDSherpaText-Medium':     require('./assets/fonts/GDSherpa-Text-Medium.otf'),
  'GDSherpaText-Bold':       require('./assets/fonts/GDSherpa-Text-Bold.otf'),
};

// ─── Experiment controls ──────────────────────────────────────────────────────

const VARIANTS: { key: NudgeVariant; label: string }[] = [
  { key: 'savings', label: 'Savings'  },
  { key: 'speed',   label: 'Speed'    },
  { key: 'rewards', label: 'Rewards'  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function App() {
  const [fontsLoaded] = useFonts(FONTS);

  const [dark,          setDark]          = useState(false);
  const [variant,       setVariant]       = useState<NudgeVariant>('savings');
  const [paymentActive, setPaymentActive] = useState(false);
  const [chargeAmount]                    = useState('$12.50');

  if (!fontsLoaded) return null;

  const handleCharge = () => setPaymentActive(true);
  const handleCancel = () => setPaymentActive(false);
  const handleComplete = (_method: string) => setPaymentActive(false);

  return (
    <View style={s.root}>
      <ExpoStatusBar style="light" />
      <StatusBar hidden />

      {/* ── Dev controls strip ──────────────────────────────────────────── */}
      <View style={s.controls}>
        <Text style={s.controlsTitle}>Debit Nudge Experiment</Text>

        <View style={s.controlsRight}>
          {/* Variant pills */}
          <View style={s.pills}>
            {VARIANTS.map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                onPress={() => setVariant(key)}
                style={[s.pill, variant === key && s.pillActive]}
              >
                <Text style={[s.pillLabel, variant === key && s.pillLabelActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dark toggle */}
          <TouchableOpacity onPress={() => setDark(!dark)} style={[s.pill, dark && s.pillActive]}>
            <Text style={[s.pillLabel, dark && s.pillLabelActive]}>
              {dark ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Duo device canvas ───────────────────────────────────────────── */}
      <ScrollView
        horizontal
        contentContainerStyle={s.canvas}
        showsHorizontalScrollIndicator={false}
      >
        {/* C1 — Merchant screen (600 × 912) */}
        <View style={s.deviceC1}>
          <Text style={s.deviceLabel}>Duo C1 — Merchant · 600 × 912</Text>
          <View style={[s.deviceFrame, s.deviceFrameC1]}>
            <RegisterDuoScreen
              dark={dark}
              nudgeVariant={variant}
              paymentActive={paymentActive}
              chargeAmount={chargeAmount}
              onCharge={handleCharge}
              onPaymentCancel={handleCancel}
            />
          </View>
        </View>

        {/* C2 — Customer screen (600 × 360) */}
        <View style={s.deviceC2}>
          <Text style={s.deviceLabel}>Duo C2 — Customer · 600 × 360</Text>
          <View style={[s.deviceFrame, s.deviceFrameC2]}>
            <RegisterDuoC2Screen
              dark={dark}
              nudgeVariant={variant}
              paymentActive={paymentActive}
              chargeAmount={chargeAmount}
              onPaymentComplete={handleComplete}
              onPaymentCancel={handleCancel}
            />
          </View>
          {/* Experiment info card */}
          <View style={s.experimentInfo}>
            <Text style={s.experimentInfoTitle}>Experiment — {variant}</Text>
            <Text style={s.experimentInfoBody}>
              {!paymentActive
                ? 'Press CHARGE on C1 to trigger the debit nudge on C2.'
                : 'DebitNudgeCard is live on the customer screen.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const ACCENT = '#1976D2';

const s = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: '#0A0A0A',
  },

  // Dev controls
  controls: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 24,
    paddingVertical:   12,
    backgroundColor:   '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  controlsTitle: {
    color:      '#ffffff',
    fontSize:   13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  controlsRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
  },
  pills: {
    flexDirection: 'row',
    gap:           6,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      999,
    borderWidth:       1,
    borderColor:       '#444444',
  },
  pillActive: {
    backgroundColor: ACCENT,
    borderColor:     ACCENT,
  },
  pillLabel: {
    color:      '#aaaaaa',
    fontSize:   11,
    fontWeight: '500',
  },
  pillLabelActive: {
    color: '#ffffff',
  },

  // Canvas
  canvas: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    padding:       32,
    gap:           40,
  },

  // Device wrappers
  deviceC1: {
    gap: 12,
  },
  deviceC2: {
    gap:       12,
    alignSelf: 'flex-start',
  },
  deviceLabel: {
    color:      '#666666',
    fontSize:   11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  deviceFrame: {
    overflow:     'hidden',
    borderRadius: 8,
    borderWidth:  1,
    borderColor:  '#222222',
    shadowColor:  '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation:    8,
  },
  deviceFrameC1: {
    width:  600,
    height: 912,
  },
  deviceFrameC2: {
    width:  600,
    height: 360,
  },

  // Experiment info
  experimentInfo: {
    backgroundColor: '#111111',
    borderRadius:    8,
    padding:         16,
    gap:             4,
    borderWidth:     1,
    borderColor:     '#222222',
  },
  experimentInfoTitle: {
    color:      '#ffffff',
    fontSize:   12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  experimentInfoBody: {
    color:      '#888888',
    fontSize:   11,
    lineHeight: 16,
  },
});
