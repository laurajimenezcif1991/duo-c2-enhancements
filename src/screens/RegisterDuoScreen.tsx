/**
 * RegisterDuoScreen — ST Debit Nudge Experiment
 *
 * Duo C1 (600 × 912) — merchant-facing portrait screen.
 *
 * This is the starting template for the debit nudge experiment.
 * The standard Register App layout is preserved exactly; the only
 * experiment-specific addition is the PaymentFragment overlay that
 * replaces the bottom bar area when the cashier presses CHARGE.
 *
 * Flow:
 *  1. Cashier adds items → standard RegisterBottomBar shows "CHARGE $X.XX"
 *  2. Cashier presses CHARGE → paymentActive = true
 *     • Bottom bar switches to PaymentFragment (c1 compact status bar)
 *     • Simultaneously, RegisterDuoC2Screen (customer screen) shows
 *       the DebitNudgeCard full-screen experiment
 *  3. Customer interacts on C2 → payment completes
 *  4. paymentActive = false → bottom bar restores
 *
 * Device: Duo C1 · 600 × 912 · Android OS
 */

import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { DeviceContext, createScaleUtils } from '../theme/devices';
import { ColorTokens } from '../theme/colors';
import { SystemStatusBar }   from '../components/ui/SystemStatusBar';
import { BottomNavBar }      from '../components/ui/BottomNavBar';
import { RegisterTopBar }    from '../components/register/RegisterTopBar';
import { RegisterTabBar, RegisterTab } from '../components/register/RegisterTabBar';
import { ProductCard }       from '../components/register/ProductCard';
import { RegisterActionBar } from '../components/register/RegisterActionBar';
import { RegisterBottomBar } from '../components/register/RegisterBottomBar';
import { PaymentFragment }   from '../components/payment/PaymentFragment';
import type { NudgeVariant } from '../components/payment/DebitNudgeCard';
import { SAMPLE_PRODUCTS }   from './sampleData';

const { scaleW, scaleH } = createScaleUtils(DeviceContext.DuoC1);

const COLS        = 4;
const GRID_GUTTER = 1;
const CARD_W      = (600 - GRID_GUTTER * (COLS + 1)) / COLS;
const CARD_H      = 161;

// ─── Props ────────────────────────────────────────────────────────────────────

type RegisterDuoScreenProps = {
  dark?:         boolean;
  nudgeVariant?: NudgeVariant;
  /** Shared payment active state (lifted if using alongside C2) */
  paymentActive?:  boolean;
  chargeAmount?:   string;
  onCharge?:       (amount: string) => void;
  onPaymentCancel?: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterDuoScreen({
  dark           = false,
  nudgeVariant   = 'savings',
  paymentActive,
  chargeAmount   = '$12.50',
  onCharge,
  onPaymentCancel,
}: RegisterDuoScreenProps) {
  const palette  = dark ? ColorTokens.dark : ColorTokens.light;

  // Local payment state (used when not lifted by parent)
  const [localPayment, setLocalPayment] = useState(false);
  const [tab, setTab]         = useState<RegisterTab>('products');
  const [taxEnabled, setTax]  = useState(true);

  const isPaymentActive = paymentActive !== undefined ? paymentActive : localPayment;

  const handleCharge = () => {
    if (onCharge) {
      onCharge(chargeAmount);
    } else {
      setLocalPayment(true);
    }
  };

  const handleCancel = () => {
    if (onPaymentCancel) {
      onPaymentCancel();
    } else {
      setLocalPayment(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: palette.bgBase }]}>
      {/* OS status bar */}
      <SystemStatusBar variant={dark ? 'black' : 'white'} />

      {/* Top bar */}
      <RegisterTopBar
        dark={dark}
        showOrderBadge
        orderCount={1}
        showPrint={false}
      />

      {/* Tab bar */}
      <RegisterTabBar
        activeTab={tab}
        onTabChange={setTab}
        dark={dark}
      />

      {/* Product grid */}
      <ScrollView
        style={[styles.grid, { backgroundColor: palette.bgLight }]}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      >
        {SAMPLE_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            cardWidth={CARD_W}
            cardHeight={CARD_H}
            dark={dark}
          />
        ))}
      </ScrollView>

      {/* Action chips */}
      {!isPaymentActive && (
        <RegisterActionBar
          taxEnabled={taxEnabled}
          onTaxToggle={() => setTax(!taxEnabled)}
          showDrawer
          dark={dark}
        />
      )}

      {/* Bottom bar — switches to PaymentFragment when active */}
      {isPaymentActive ? (
        <PaymentFragment
          screen="c1"
          chargeAmount={chargeAmount}
          nudgeVariant={nudgeVariant}
          dark={dark}
          onCancel={handleCancel}
          onComplete={handleCancel}
        />
      ) : (
        <RegisterBottomBar
          chargeAmount={chargeAmount}
          onCharge={handleCharge}
          onCancel={() => {}}
          dark={dark}
        />
      )}

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
  grid: {
    flex: 1,
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           GRID_GUTTER,
    padding:       GRID_GUTTER,
  },
});
