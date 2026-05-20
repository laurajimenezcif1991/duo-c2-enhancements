/**
 * RegisterDuoScreen — ST Debit Nudge Experiment
 *
 * Duo C1 (600 × 960) — merchant-facing portrait screen.
 *
 * Cart state is owned by App.tsx and passed in as props so that C2 can
 * mirror the order live. This screen handles UI callbacks only.
 *
 * Device: Duo C1 · 600 × 960 · Android OS
 */

import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ColorTokens } from '../theme/colors';
import { SystemStatusBar }   from '../components/ui/SystemStatusBar';
import { BottomNavBar }      from '../components/ui/BottomNavBar';
import { RegisterTopBar, type SelectedItemInfo } from '../components/register/RegisterTopBar';
import { RegisterTabBar, type RegisterTab } from '../components/register/RegisterTabBar';
import { ProductGrid, type GridProduct } from '../components/register/ProductGrid';
import { RegisterActionBar } from '../components/register/RegisterActionBar';
import { RegisterBottomBar } from '../components/register/RegisterBottomBar';
import { C1PaymentPanel }   from '../components/payment/PaymentFragment';
import { ItemDetailDrawer } from '../components/modals/ItemDetailDrawer';
import type { CartState, CartActions } from '../types/cart';
import type { VariantProduct, ProductVariant } from '../types/variants';
import { SAMPLE_PRODUCTS, VARIANT_PRODUCTS } from './sampleData';

// ─── Props ────────────────────────────────────────────────────────────────────

type RegisterDuoScreenProps = {
  dark?:              boolean;
  paymentActive?:     boolean;
  cart:               CartState;
  cartActions:        CartActions;
  onCharge?:          () => void;
  onPaymentCancel?:   () => void;
  /** Called when a product with variants is tapped — lifts state to App */
  onOpenItemDetail?:  (product: VariantProduct) => void;
  /** Called when the item detail drawer closes */
  onCloseItemDetail?: () => void;
  /** Currently open variant product (from App) */
  itemDetailProduct?: VariantProduct | null;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterDuoScreen({
  dark             = false,
  paymentActive    = false,
  cart,
  cartActions,
  onCharge,
  onPaymentCancel,
  onOpenItemDetail,
  onCloseItemDetail,
  itemDetailProduct = null,
}: RegisterDuoScreenProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  const [tab,        setTab]  = useState<RegisterTab>('products');
  const [taxEnabled, setTax]  = useState(true);

  // ── Product tap ───────────────────────────────────────────────────────────
  const handleProductPress = useCallback((product: GridProduct) => {
    if (product.status === 'out-of-stock') return;

    // If this product has variants, open the detail drawer
    if (product.hasVariants) {
      const variantProduct = VARIANT_PRODUCTS[String(product.id)];
      if (variantProduct) {
        onOpenItemDetail?.(variantProduct);
      }
      return;
    }

    // Standard products: add directly to cart
    if (product.seeAll || !product.price) return;
    const id = String(product.id);
    const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    if (isNaN(priceValue)) return;
    cartActions.addOrIncrement(id, product.name, product.price, priceValue);
  }, [cartActions, onOpenItemDetail]);

  // ── Variant selected from drawer ──────────────────────────────────────────
  const handleVariantSelect = useCallback((variant: ProductVariant) => {
    cartActions.addOrIncrement(
      variant.id,
      `${itemDetailProduct?.name} | ${variant.color} | ${variant.size}`,
      variant.price,
      variant.priceValue,
    );
    onCloseItemDetail?.();
  }, [cartActions, itemDetailProduct, onCloseItemDetail]);

  // ── Top-bar qty controls ──────────────────────────────────────────────────
  const selectedCartItem = cart.items.find(i => i.id === cart.selectedId) ?? null;
  const selectedItemInfo: SelectedItemInfo | null = selectedCartItem
    ? {
        id:       selectedCartItem.id,
        name:     selectedCartItem.name,
        price:    selectedCartItem.priceLabel,
        quantity: selectedCartItem.quantity,
      }
    : null;

  const handleIncrement = useCallback(() => {
    if (cart.selectedId) cartActions.changeQty(cart.selectedId, +1);
  }, [cart.selectedId, cartActions]);

  const handleDecrement = useCallback(() => {
    if (cart.selectedId) cartActions.changeQty(cart.selectedId, -1);
  }, [cart.selectedId, cartActions]);

  const handleDelete = useCallback(() => {
    if (cart.selectedId) cartActions.deleteItem(cart.selectedId);
  }, [cart.selectedId, cartActions]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={[s.root, { backgroundColor: palette.bgBase }]}>
      <SystemStatusBar variant={dark ? 'black' : 'white'} />

      <RegisterTopBar
        dark={dark}
        showOrderBadge
        orderCount={cart.orderCount}
        selectedItem={selectedItemInfo}
        onItemIncrement={handleIncrement}
        onItemDecrement={handleDecrement}
        onItemDelete={handleDelete}
        onItemEdit={() => { /* future */ }}
      />

      <RegisterTabBar
        activeTab={tab}
        onTabChange={setTab}
        dark={dark}
      />

      <ProductGrid
        products={SAMPLE_PRODUCTS as GridProduct[]}
        dark={dark}
        onProductPress={handleProductPress}
      />

      <RegisterActionBar
        taxEnabled={taxEnabled}
        onTaxToggle={() => setTax(t => !t)}
        showDrawer
        dark={dark}
      />

      <RegisterBottomBar
        chargeAmount={cart.chargeAmount}
        onCharge={onCharge}
        onCancel={() => {}}
        dark={dark}
      />

      <BottomNavBar />

      {/* C1 payment panel — floats above the register as an absolute overlay */}
      <C1PaymentPanel
        visible={paymentActive}
        chargeAmount={cart.chargeAmount}
        onCancel={onPaymentCancel}
      />

      {/* Item detail drawer — slides up when a variant product is tapped */}
      <ItemDetailDrawer
        visible={itemDetailProduct !== null}
        product={itemDetailProduct}
        onClose={onCloseItemDetail ?? (() => {})}
        onSelectVariant={handleVariantSelect}
        dark={dark}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex:  1,
    width: 600,
  },
});
