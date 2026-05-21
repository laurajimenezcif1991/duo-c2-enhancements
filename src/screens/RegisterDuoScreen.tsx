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
import { ItemDetailDrawer }            from '../components/modals/ItemDetailDrawer';
import { InputModal }                  from '../components/modals/InputModal';
import { OrderLevelModifierDrawer }    from '../components/modals/OrderLevelModifierDrawer';
import { OrderDetailsScreen }          from './OrderDetailsScreen';
import type { CartItem, CartState, CartActions, CartAddOn, CartAppliedModifier, UpdateItemPayload } from '../types/cart';
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

  const [tab,                 setTab]                = useState<RegisterTab>('products');
  const [taxEnabled,          setTax]                = useState(true);
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
  /** Cart item currently open in the edit modifier drawer */
  const [editingCartItem,     setEditingCartItem]    = useState<CartItem | null>(null);

  // ── Order-level state (shared with action bar + order details) ────────────
  const [customerName,           setCustomerName]           = useState('');
  const [orderNote,              setOrderNote]              = useState('');
  const [orderDiscount,          setOrderDiscount]          = useState<CartAppliedModifier | null>(null);
  const [orderFee,               setOrderFee]               = useState<CartAppliedModifier | null>(null);
  const [customerNameVisible,    setCustomerNameVisible]    = useState(false);
  const [orderNoteVisible,       setOrderNoteVisible]       = useState(false);
  const [orderDiscountVisible,   setOrderDiscountVisible]   = useState(false);
  const [orderFeeVisible,        setOrderFeeVisible]        = useState(false);

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
    cartActions.addOrIncrement({ id, name: product.name, priceLabel: product.price, priceValue });
  }, [cartActions, onOpenItemDetail]);

  // ── Open the edit modifier drawer for an existing cart item ──────────────
  const openEditDrawer = useCallback((item: CartItem) => {
    setOrderDetailsVisible(false); // close order details if open
    setEditingCartItem(item);
  }, []);

  // Convenience handler wired from OrderDetails onEditItem
  const handleEditOrderItem = useCallback((item: CartItem) => {
    openEditDrawer(item);
  }, [openEditDrawer]);

  // ── "Add to order" confirmed inside drawer → add to cart, close drawer ────
  const handleAddToOrder = useCallback((
    variant:  ProductVariant,
    qty:      number,
    note:     string,
    addOns:   CartAddOn[],
    discount: CartAppliedModifier | null,
    fee:      CartAppliedModifier | null,
  ) => {
    const label = `${itemDetailProduct?.name} (${variant.color}, ${variant.size})`;
    for (let i = 0; i < qty; i++) {
      cartActions.addOrIncrement({
        id:         variant.id,
        name:       label,
        priceLabel: variant.price,
        priceValue: variant.priceValue,
        note:       note || undefined,
        addOns:     addOns.length > 0 ? addOns : undefined,
        discount:   discount ?? undefined,
        fee:        fee ?? undefined,
      });
    }
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

      {/* Shared top bar — Order pill swaps to X when order details is open */}
      <RegisterTopBar
        dark={dark}
        showOrderBadge
        orderCount={cart.orderCount}
        orderDetailsOpen={orderDetailsVisible}
        onOrderPress={orderDetailsVisible
          ? () => setOrderDetailsVisible(false)
          : () => setOrderDetailsVisible(true)
        }
        selectedItem={orderDetailsVisible ? null : selectedItemInfo}
        onItemIncrement={handleIncrement}
        onItemDecrement={handleDecrement}
        onItemDelete={handleDelete}
        onItemEdit={() => { if (selectedCartItem) openEditDrawer(selectedCartItem); }}
      />

      {/* ── Content area: swaps between register grid and order details ───── */}
      {orderDetailsVisible ? (
        <OrderDetailsScreen
          cart={cart}
          cartActions={cartActions}
          taxEnabled={taxEnabled}
          onTaxToggle={() => setTax(t => !t)}
          onCancel={() => setOrderDetailsVisible(false)}
          onCharge={() => { setOrderDetailsVisible(false); onCharge?.(); }}
          onEditItem={handleEditOrderItem}
          dark={dark}
          customerName={customerName}
          onEditCustomerName={() => setCustomerNameVisible(true)}
          orderNote={orderNote}
          onEditOrderNote={() => setOrderNoteVisible(true)}
          orderDiscount={orderDiscount}
          onAddOrderDiscount={() => setOrderDiscountVisible(true)}
          onRemoveOrderDiscount={() => setOrderDiscount(null)}
          orderFee={orderFee}
          onAddOrderFee={() => setOrderFeeVisible(true)}
          onRemoveOrderFee={() => setOrderFee(null)}
        />
      ) : (
        <>
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
            onCustomer={() => setCustomerNameVisible(true)}
            onAddNotes={() => setOrderNoteVisible(true)}
            onDiscount={() => setOrderDiscountVisible(true)}
            onFee={() => setOrderFeeVisible(true)}
            showDrawer
            dark={dark}
          />

          <RegisterBottomBar
            chargeAmount={cart.chargeAmount}
            onCharge={onCharge}
            onCancel={() => {}}
            dark={dark}
          />
        </>
      )}

      <BottomNavBar />

      {/* C1 payment panel — floats above as an absolute overlay */}
      <C1PaymentPanel
        visible={paymentActive}
        chargeAmount={cart.chargeAmount}
        onCancel={onPaymentCancel}
      />

      {/* ── Order-level Customer Name modal ─────────────────────────────────── */}
      <InputModal
        visible={customerNameVisible}
        label="Customer Name"
        maxLength={64}
        initialValue={customerName}
        onConfirm={v => { setCustomerName(v); setCustomerNameVisible(false); }}
        onCancel={() => setCustomerNameVisible(false)}
        dark={dark}
      />

      {/* ── Order-level Note modal ────────────────────────────────────────────── */}
      <InputModal
        visible={orderNoteVisible}
        label="Note"
        maxLength={200}
        initialValue={orderNote}
        onConfirm={v => { setOrderNote(v); setOrderNoteVisible(false); }}
        onCancel={() => setOrderNoteVisible(false)}
        dark={dark}
      />

      {/* ── Order-level Discount drawer ───────────────────────────────────────── */}
      <OrderLevelModifierDrawer
        visible={orderDiscountVisible}
        mode="discount"
        initial={orderDiscount}
        onConfirm={mod => { setOrderDiscount(mod); setOrderDiscountVisible(false); }}
        onClose={() => setOrderDiscountVisible(false)}
        dark={dark}
      />

      {/* ── Order-level Fee drawer ────────────────────────────────────────────── */}
      <OrderLevelModifierDrawer
        visible={orderFeeVisible}
        mode="fee"
        initial={orderFee}
        onConfirm={mod => { setOrderFee(mod); setOrderFeeVisible(false); }}
        onClose={() => setOrderFeeVisible(false)}
        dark={dark}
      />

      {/* Item detail drawer — add mode (variant selection) OR edit mode (modifier editing) */}
      {(() => {
        const isEditMode = editingCartItem !== null;
        // In edit mode: find the variant product and variant for this cart item
        const editVariantProduct = isEditMode
          ? (Object.values(VARIANT_PRODUCTS).find(p => p.variants.some(v => v.id === editingCartItem!.id)) ?? null)
          : null;
        const editVariant = isEditMode && editVariantProduct
          ? (editVariantProduct.variants.find(v => v.id === editingCartItem!.id) ?? null)
          : null;

        return (
          <ItemDetailDrawer
            visible={itemDetailProduct !== null || isEditMode}
            product={isEditMode ? editVariantProduct : itemDetailProduct}
            onClose={() => {
              setEditingCartItem(null);
              onCloseItemDetail?.();
            }}
            onAddToOrder={handleAddToOrder}
            editCartItem={editingCartItem}
            editVariant={editVariant}
            onUpdateItem={(id, updates) => {
              cartActions.updateItem(id, updates);
              setEditingCartItem(null);
            }}
            dark={dark}
          />
        );
      })()}
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
