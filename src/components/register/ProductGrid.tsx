/**
 * ProductGrid — Register App
 *
 * Figma source: Smart-Terminal-Glass-2.0
 *   node 3759:969 — "POS Plan with Sales Price + Quantity" item container
 *
 * Grid spec (from Figma auto-layout):
 *   • 4 columns, equal width
 *   • Column (horizontal) gap : 8 px
 *   • Row    (vertical)   gap : 8 px
 *   • Side padding              : 4 px each side (container = 592 px inside 600 px screen)
 *   • Card height               : 172 px
 *
 * Background:
 *   The grid container fills with Colors/Background-Border/bgBase (#111111 light,
 *   #2B2B2B dark) so the 8 px gutters read as a dark grid line between white cards.
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ColorTokens } from '../../theme/colors';
import { ProductCard, type ProductCardProps } from './ProductCard';

// ─── Grid geometry (matches Figma node 3759:969) ──────────────────────────────

const COLS      = 4;
const H_PAD     = 4;    // horizontal padding each side → grid is 592 px inside 600 px screen
const H_GAP     = 8;    // horizontal gap between columns
const V_GAP     = 8;    // vertical gap between rows
const CARD_H    = 172;  // card height (Figma h-[172px])
const SCREEN_W  = 600;

/** Pixel-perfect card width: (592 - 3 × 8) / 4 = 142 px */
export const CARD_W = (SCREEN_W - H_PAD * 2 - H_GAP * (COLS - 1)) / COLS;

// ─── Types ────────────────────────────────────────────────────────────────────

export type GridProduct = Omit<ProductCardProps, 'cardWidth' | 'cardHeight' | 'dark'> & {
  id: string | number;
};

type ProductGridProps = {
  products: GridProduct[];
  dark?:    boolean;
  onProductPress?: (product: GridProduct) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductGrid({ products, dark = false, onProductPress }: ProductGridProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  return (
    <ScrollView
      style={[s.scroll, { backgroundColor: palette.bgBase }]}
      contentContainerStyle={s.grid}
      showsVerticalScrollIndicator={false}
    >
      {products.map((product) => {
        const { id, ...cardProps } = product;
        return (
          <ProductCard
            key={id}
            {...cardProps}
            cardWidth={CARD_W}
            cardHeight={CARD_H}
            dark={dark}
            onPress={onProductPress ? () => onProductPress(product) : cardProps.onPress}
          />
        );
      })}

      {/* Invisible filler cards to keep the last row left-aligned */}
      {Array.from({ length: (COLS - (products.length % COLS)) % COLS }).map((_, i) => (
        <View key={`spacer-${i}`} style={s.spacer} />
      ))}
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  grid: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    columnGap:      H_GAP,
    rowGap:         V_GAP,
    paddingHorizontal: H_PAD,
    paddingVertical:   V_GAP,
  },
  spacer: {
    width:  CARD_W,
    height: 0,
  },
});
