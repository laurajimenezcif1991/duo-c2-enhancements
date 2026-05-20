/**
 * RegisterDuoC2Screen — ST Debit Nudge Experiment
 *
 * Duo C2 (600 × 360) — customer-facing landscape screen.
 *
 * Three states:
 *
 *   1. IDLE    — cart is empty
 *                Teal wave background + frosted-glass bottom banner
 *                Figma node 34:12949
 *
 *   2. ORDER   — cart has items (synced live from C1)
 *                Blue header "Total (N Items) / $XX.XX"  +  item list
 *                Figma node 34:7624
 *
 *   3. PAYMENT — paymentActive = true
 *                PaymentFragment full-screen (DebitNudgeCard experiment)
 *
 * Device: Duo C2 · 600 × 360 · Android OS
 */

import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { C2PaymentPrompt } from '../components/payment/PaymentFragment';
import type { CartState } from '../types/cart';
import type { C2Variant } from '../components/payment/PaymentFragment';
import type { VariantProduct } from '../types/variants';
import { FontFamily, FontSize } from '../theme/typography';

// ─── Local assets ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-require-imports
const BG_IMAGE     = require('../../assets/backgrounds/rectangle-bg.png');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const BANNER_IMAGE = require('../../assets/backgrounds/Customer_screen_title.png');

// ─── Design tokens (Figma 34:7624) ────────────────────────────────────────────

const HEADER_BG     = '#1E9AF7';
const HEADER_H      = 71;
const ITEM_ROW_H    = 76;   // py-20 (20+20) + line-height 36 = 76px

// ─── Props ────────────────────────────────────────────────────────────────────

type RegisterDuoC2ScreenProps = {
  dark?:              boolean;
  paymentActive?:     boolean;
  cart?:              CartState;
  c2Variant?:         C2Variant;
  onPaymentComplete?: (method: string) => void;
  onPaymentCancel?:   () => void;
  /** When set, C2 shows an item preview while the merchant browses variants on C1 */
  itemDetailProduct?: VariantProduct | null;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterDuoC2Screen({
  dark              = false,
  paymentActive     = false,
  cart,
  c2Variant         = 'A',
  onPaymentComplete,
  onPaymentCancel,
  itemDetailProduct = null,
}: RegisterDuoC2ScreenProps) {

  // ── PAYMENT state ────────────────────────────────────────────────────────
  if (paymentActive) {
    return (
      <View style={s.fill}>
        <C2PaymentPrompt
          chargeAmount={cart?.chargeAmount ?? '$0.00'}
          onComplete={onPaymentComplete}
          variant={c2Variant}
        />
      </View>
    );
  }

  // ── ITEM DETAIL state ────────────────────────────────────────────────────
  if (itemDetailProduct) {
    return (
      <View style={s.fill}>
        <Image source={BG_IMAGE} style={s.background} resizeMode="cover" />

        {/* Frosted overlay */}
        <View style={s.detailOverlay}>
          {/* Product image */}
          <View style={s.detailImageWrap}>
            <Image
              source={itemDetailProduct.imageSource}
              style={s.detailImage}
              resizeMode="contain"
            />
          </View>

          {/* Product name */}
          <Text style={s.detailName} numberOfLines={2}>
            {itemDetailProduct.name}
          </Text>

          {/* Variant prompt */}
          <Text style={s.detailPrompt}>
            Choose your variant
          </Text>

          {/* Price */}
          <Text style={s.detailPrice}>
            {itemDetailProduct.variants[0]?.price ?? ''}
          </Text>
        </View>
      </View>
    );
  }

  const hasItems = (cart?.items?.length ?? 0) > 0;

  // ── ORDER state ──────────────────────────────────────────────────────────
  if (hasItems && cart) {
    const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    return (
      <View style={s.fill}>

        {/* Blue header */}
        <View style={s.header}>
          <Text style={s.headerLeft} numberOfLines={1}>
            Total ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
          </Text>
          <Text style={s.headerRight} numberOfLines={1}>
            {cart.chargeAmount}
          </Text>
        </View>

        {/* Item list */}
        <ScrollView
          style={s.listScroll}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
        >
          {cart.items.map(item => (
            <View key={item.id} style={s.itemRow}>
              <View style={s.itemLeft}>
                <Text style={s.itemQty}>{item.quantity}X</Text>
                <Text style={s.itemName} numberOfLines={2}>{item.name}</Text>
              </View>
              <Text style={s.itemPrice}>
                {/* line total */}
                ${(item.priceValue * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ── IDLE state ───────────────────────────────────────────────────────────
  return (
    <View style={s.fill}>
      <Image source={BG_IMAGE} style={s.background} resizeMode="cover" />
      <View style={s.banner}>
        <Image source={BANNER_IMAGE} style={s.bannerImage} resizeMode="cover" />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  fill: {
    flex:            1,
    width:           600,
    height:          '100%' as any,
    overflow:        'hidden',
    backgroundColor: '#0a8fa8',
  },

  // ── Idle ──────────────────────────────────────────────────────────────────
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  banner: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    width:           600,
    height:          66,
    backgroundColor: 'rgba(255,255,255,0.10)',
    // @ts-ignore — backdropFilter is valid CSS passthrough for React Native Web
    backdropFilter:  'blur(4px)',
  },
  bannerImage: {
    width:  600,
    height: 66,
  },

  // ── Order header ──────────────────────────────────────────────────────────
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    backgroundColor:   HEADER_BG,
    height:            HEADER_H,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flex:       1,
    fontFamily: FontFamily.displayRegular,
    fontSize:   28,
    lineHeight: 36,
    color:      '#ffffff',
  },
  headerRight: {
    fontFamily: FontFamily.displayRegular,
    fontSize:   28,
    lineHeight: 36,
    color:      '#ffffff',
    textAlign:  'right',
  },

  // ── Item list ─────────────────────────────────────────────────────────────
  listScroll: {
    flex:            1,
    backgroundColor: '#ffffff',
  },
  listContent: {
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 16,
    paddingVertical:   20,
    minHeight:         ITEM_ROW_H,
    backgroundColor:   '#ffffff',
  },
  itemLeft: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           10,
    paddingRight:  12,
  },
  itemQty: {
    fontFamily:    FontFamily.displayMedium,
    fontSize:      FontSize.bodyXS,   // 16px
    lineHeight:    20,
    color:         '#767676',
    textTransform: 'uppercase',
    paddingTop:    8,                 // align to cap-height of 28px name
  },
  itemName: {
    flex:       1,
    fontFamily: FontFamily.textRegular,
    fontSize:   28,
    lineHeight: 36,
    color:      '#000000',
  },
  itemPrice: {
    fontFamily: FontFamily.textRegular,
    fontSize:   28,
    lineHeight: 36,
    color:      '#000000',
    textAlign:  'right',
  },

  // ── Item detail preview ───────────────────────────────────────────────────
  detailOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            8,
    paddingHorizontal: 32,
    paddingVertical:   24,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },

  detailImageWrap: {
    width:           180,
    height:          180,
    borderRadius:    12,
    overflow:        'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom:    4,
  },

  detailImage: {
    width:  '100%',
    height: '100%',
  },

  detailName: {
    fontFamily: FontFamily.displayMedium,
    fontSize:   28,
    lineHeight: 34,
    color:      '#ffffff',
    textAlign:  'center',
  },

  detailPrompt: {
    fontFamily: FontFamily.textRegular,
    fontSize:   18,
    lineHeight: 24,
    color:      'rgba(255,255,255,0.75)',
    textAlign:  'center',
  },

  detailPrice: {
    fontFamily: FontFamily.textMedium,
    fontSize:   24,
    lineHeight: 30,
    color:      '#ffffff',
    textAlign:  'center',
    marginTop:  4,
  },
});
