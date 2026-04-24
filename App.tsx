/**
 * App — ST Debit Nudge Experiment
 *
 * Renders both Duo screens inside the physical STD device frame:
 *
 *   ┌────────────────────────────────┐
 *   │  STD device shell (681 × 1643) │
 *   │  ┌──────────────────────────┐  │
 *   │  │  C2 — Customer  600×360  │  │  y=35
 *   │  └──────────────────────────┘  │
 *   │  ┌──────────────────────────┐  │
 *   │  │  C1 — Merchant  600×960  │  │  y=597
 *   │  │    ↑ DebitNudgeModal     │  │  ← overlaid inside C1 bounds
 *   │  └──────────────────────────┘  │
 *   └────────────────────────────────┘
 *
 * Cart state lives here so C1 (merchant adds items) and
 * C2 (customer sees live order) stay in sync.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFonts } from 'expo-font';

import { RegisterDuoScreen }   from './src/screens/RegisterDuoScreen';
import { RegisterDuoC2Screen } from './src/screens/RegisterDuoC2Screen';
import { DebitNudgeModal }     from './src/components/modals/DebitNudgeModal';
import type { CartItem, CartState, CartActions } from './src/types/cart';
import type { C2Variant } from './src/components/payment/PaymentFragment';

// ─── Fonts ────────────────────────────────────────────────────────────────────

const FONTS = {
  'GDSherpaDisplay-Regular': require('./assets/fonts/GDSherpaDisplay-Regular.otf'),
  'GDSherpaDisplay-Medium':  require('./assets/fonts/GDSherpaDisplay-Medium.otf'),
  'GDSherpaText-Regular':    require('./assets/fonts/GDSherpaText-Regular.otf'),
  'GDSherpaText-Medium':     require('./assets/fonts/GDSherpaText-Medium.otf'),
  'GDSherpaText-Bold':       require('./assets/fonts/GDSherpaText-Bold.otf'),
};

// ─── Device frame geometry (matches std-device.png, node 32:7569) ─────────────

const DEVICE_W = 681;
const DEVICE_H = 1643;

const C2_X = 40;
const C2_Y = 35;
const C2_W = 600;
const C2_H = 360;

const C1_X = 42;
const C1_Y = 597;
const C1_W = 600;
const C1_H = 960;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTotal(value: number): string {
  return `$${value.toFixed(2)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function App() {
  const [fontsLoaded] = useFonts(FONTS);
  const { width: winW, height: winH } = useWindowDimensions();

  // Scale the device frame to fit the browser viewport — full canvas, no sidebar
  const V_PAD = 48;
  const H_PAD = 32;
  const deviceScale = Math.min(
    (winW - H_PAD) / DEVICE_W,
    (winH - V_PAD) / DEVICE_H,
    1,
  );

  const [dark]          = useState(false);
  const [paymentActive, setPaymentActive] = useState(false);
  const [debitModal,    setDebitModal]    = useState(false);
  const [c2Variant,     setC2Variant]     = useState<C2Variant>('A');

  // ── Shared cart state ─────────────────────────────────────────────────────
  const [cartItems,  setCartItems]  = useState<CartItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── Derived values ────────────────────────────────────────────────────────
  const total = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.priceValue * i.quantity, 0),
    [cartItems],
  );

  const cart: CartState = useMemo(() => ({
    items:        cartItems,
    selectedId,
    total,
    chargeAmount: formatTotal(total),
    orderCount:   cartItems.length,
  }), [cartItems, selectedId, total]);

  // ── Cart actions ──────────────────────────────────────────────────────────
  const addOrIncrement = useCallback((
    id: string, name: string, priceLabel: string, priceValue: number,
  ) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { id, name, priceLabel, priceValue, quantity: 1 }];
    });
    setSelectedId(id);
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx < 0) return prev;
      const newQty = prev[idx].quantity + delta;
      if (newQty <= 0) {
        const next = prev.filter(i => i.id !== id);
        setSelectedId(cur => cur !== id ? cur : (next.length > 0 ? next[next.length - 1].id : null));
        return next;
      }
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: newQty };
      return next;
    });
  }, []);

  const deleteItem = useCallback((id: string) => {
    setCartItems(prev => {
      const next = prev.filter(i => i.id !== id);
      setSelectedId(cur => cur !== id ? cur : (next.length > 0 ? next[next.length - 1].id : null));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setSelectedId(null);
  }, []);

  const cartActions: CartActions = useMemo(() => ({
    addOrIncrement, changeQty, deleteItem, setSelectedId, clearCart,
  }), [addOrIncrement, changeQty, deleteItem, clearCart]);

  // ── Payment handlers ──────────────────────────────────────────────────────
  const handleCharge   = useCallback(() => setPaymentActive(true),  []);
  const handleCancel   = useCallback(() => setPaymentActive(false), []);
  const handleComplete = useCallback(() => { setPaymentActive(false); clearCart(); }, [clearCart]);

  const closeModal = useCallback(() => setDebitModal(false), []);

  if (!fontsLoaded) return null;

  const scaledW = DEVICE_W * deviceScale;
  const scaledH = DEVICE_H * deviceScale;

  return (
    <View style={s.root}>
      <View style={s.canvas}>

        {/* ── Controls panel — top-left, outside device ────────────────────── */}
        <View style={s.controlsPanel}>
          <Text style={s.controlsLabel}>C1 bottom drawer</Text>
          <TouchableOpacity
            style={s.chip}
            activeOpacity={0.75}
            onPress={() => setDebitModal(true)}
          >
            <View style={s.chipDot} />
            <Text style={s.chipText}>Method #2 · Debit Nudge</Text>
          </TouchableOpacity>

          {paymentActive && (
            <>
              <View style={s.controlsDivider} />

              <Text style={s.controlsLabel}>C2 PF Variants</Text>
              {(['A', 'B', 'C'] as const).map(v => (
                <TouchableOpacity
                  key={v}
                  style={[s.chip, c2Variant === v && s.chipActive]}
                  onPress={() => setC2Variant(v)}
                  activeOpacity={0.75}
                >
                  <View style={[s.chipDot, c2Variant === v ? s.chipDotActive : s.chipDotInactive]} />
                  <Text style={[s.chipText, c2Variant === v ? s.chipTextActive : s.chipTextInactive]}>
                    {`Variant ${v}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        {/* ── Device — centered, scaled to fit viewport ─────────────────────── */}
        <View style={{ width: scaledW, height: scaledH }}>
          <View style={[s.device, {
            // transform-origin: top-left via translate trick
            transform: [
              { translateX: -(DEVICE_W - scaledW) / 2 },
              { translateY: -(DEVICE_H - scaledH) / 2 },
              { scale: deviceScale },
            ],
          }]}>

            {/* C2 — Customer screen */}
            <View style={s.c2}>
              <RegisterDuoC2Screen
                dark={dark}
                paymentActive={paymentActive}
                cart={cart}
                c2Variant={c2Variant}
                onPaymentComplete={handleComplete}
                onPaymentCancel={handleCancel}
              />
            </View>

            {/* C1 — Merchant screen + modal overlay */}
            <View style={s.c1}>
              <RegisterDuoScreen
                dark={dark}
                paymentActive={paymentActive}
                cart={cart}
                cartActions={cartActions}
                onCharge={handleCharge}
                onPaymentCancel={handleCancel}
              />

              <DebitNudgeModal
                visible={debitModal}
                onClose={closeModal}
                onMaybeLater={closeModal}
                onSetDefault={closeModal}
                dark={dark}
              />
            </View>

            {/* Device shell overlay */}
            <Image
              source={require('./assets/backgrounds/std-device.png')}
              style={s.shell}
              pointerEvents="none"
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: '#1A1A1A',
  },

  canvas: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
  },

  // ── Controls panel — absolutely positioned top-left ───────────────────────
  controlsPanel: {
    position:  'absolute',
    top:       24,
    left:      24,
    gap:       8,
    alignItems: 'flex-start',
  },

  controlsDivider: {
    height:          1,
    width:           '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical:  4,
  },

  // ── Experiment control row (unused keys kept for reference) ──────────────
  controls: {
    flexDirection:  'row',
    alignItems:     'flex-end',
    justifyContent: 'space-between',
    gap:            16,
  },

  controlsLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           12,
  },

  controlsLabel: {
    fontSize:      11,
    fontWeight:    '600' as const,
    letterSpacing: 1.1,
    textTransform: 'uppercase' as const,
    color:         'rgba(255,255,255,0.4)',
  },

  chipRow: {
    flexDirection: 'row',
    gap:           8,
  },

  // ── Chip variants (active / inactive states) ──────────────────────────────
  chipActive: {
    backgroundColor: 'rgba(30,154,247,0.18)',
    borderColor:     'rgba(30,154,247,0.55)',
  },
  chipDotInactive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  chipDotActive: {
    backgroundColor: '#1E9AF7',
  },
  chipTextInactive: {
    color: 'rgba(255,255,255,0.4)',
  },
  chipTextActive: {
    color: '#1E9AF7',
  },

  // Chip pill button
  chip: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    backgroundColor:   'rgba(30,154,247,0.15)',
    borderWidth:       1,
    borderColor:       'rgba(30,154,247,0.45)',
    borderRadius:      20,
    paddingVertical:   6,
    paddingHorizontal: 12,
  },

  chipDot: {
    width:           7,
    height:          7,
    borderRadius:    4,
    backgroundColor: '#1E9AF7',
  },

  chipText: {
    fontSize:   12,
    fontWeight: '500' as const,
    color:      '#1E9AF7',
    letterSpacing: 0.1,
  },

  // ── Device frame ──────────────────────────────────────────────────────────
  device: {
    width:    DEVICE_W,
    height:   DEVICE_H,
    position: 'relative',
  },

  c2: {
    position: 'absolute',
    left:     C2_X,
    top:      C2_Y,
    width:    C2_W,
    height:   C2_H,
    overflow: 'hidden',
  },

  c1: {
    position: 'absolute',
    left:     C1_X,
    top:      C1_Y,
    width:    C1_W,
    height:   C1_H,
    overflow: 'hidden',   // clips the DebitNudgeModal to C1 bounds
  },

  shell: {
    position: 'absolute',
    top:      0,
    left:     0,
    width:    DEVICE_W,
    height:   DEVICE_H,
  },
});
