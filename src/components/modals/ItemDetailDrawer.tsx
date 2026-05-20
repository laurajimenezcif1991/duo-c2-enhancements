/**
 * ItemDetailDrawer — Item / Product Detail Bottom Drawer
 *
 * C1 (merchant-facing) overlay that slides up when the merchant taps a
 * product that has colour × size variants.  Selecting a variant adds it
 * to the shared cart and closes the drawer; C2 mirrors the update live.
 *
 * Figma: Register-App-2025 · node 6539:116671 (Product List View Pattern)
 *
 * Architecture:
 *   Same absolute-positioned spring animation pattern as DebitNudgeModal.
 *   Rendered inside the C1 screen <View> so it is clipped to device bounds.
 *
 * Layout per Figma:
 *   • Header  — black (#111) bg, product name (text/medium 20px, white) + X
 *   • Rows    — white, border-bottom E5E5E5, py-18 px-20, gap-16
 *     · Thumbnail 60×60, border E5E5E5, radius-4
 *     · Name: "Polo T-Shirt | Blue | XL"  (text/medium 20px)
 *     · Price + stock count  (body/regular 20px)
 *     · "OUT OF STOCK" badge (red) / "LOW IN STOCK" badge (black)
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
import type { ProductVariant, VariantProduct } from '../../types/variants';

// ─── Constants ────────────────────────────────────────────────────────────────

const C1_H    = 960;
const SHEET_H = C1_H;

// ─── Props ────────────────────────────────────────────────────────────────────

export type ItemDetailDrawerProps = {
  visible:         boolean;
  product:         VariantProduct | null;
  onClose:         () => void;
  onSelectVariant: (variant: ProductVariant) => void;
  dark?:           boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ItemDetailDrawer({
  visible,
  product,
  onClose,
  onSelectVariant,
  dark = false,
}: ItemDetailDrawerProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  const slideY   = useRef(new Animated.Value(SHEET_H)).current;
  const scrimRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scrimRef.setValue(1);
      Animated.spring(slideY, {
        toValue:         0,
        useNativeDriver: true,
        damping:         28,
        stiffness:       260,
        mass:            0.9,
      }).start();
    } else {
      Animated.spring(slideY, {
        toValue:         SHEET_H,
        useNativeDriver: true,
        damping:         28,
        stiffness:       280,
        mass:            0.8,
      }).start(() => scrimRef.setValue(0));
    }
  }, [visible, slideY, scrimRef]);

  const handleSelect = (variant: ProductVariant) => {
    if (variant.status === 'out-of-stock') return;
    onSelectVariant(variant);
  };

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[s.overlay, { opacity: scrimRef }]}
    >
      <Pressable style={s.scrim} onPress={onClose} />

      <Animated.View
        style={[
          s.sheet,
          { backgroundColor: palette.bgSurface },
          { transform: [{ translateY: slideY }] },
        ]}
      >
        {/* ── Dark header ──────────────────────────────────────────────────── */}
        <View style={s.header}>
          <Text
            style={[s.headerTitle, { fontFamily: FontFamily.textMedium }]}
            numberOfLines={1}
          >
            {product?.name ?? ''}
          </Text>
          <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
            <Icon name="x" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* ── Variant list ─────────────────────────────────────────────────── */}
        <ScrollView
          style={s.list}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {product?.variants.map(variant => (
            <VariantRow
              key={variant.id}
              productName={product.name}
              variant={variant}
              palette={palette}
              onPress={() => handleSelect(variant)}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Variant Row ──────────────────────────────────────────────────────────────

type Palette = typeof ColorTokens.light | typeof ColorTokens.dark;

type VariantRowProps = {
  productName: string;
  variant:     ProductVariant;
  palette:     Palette;
  onPress:     () => void;
};

function VariantRow({ productName, variant, palette, onPress }: VariantRowProps) {
  const isOos = variant.status === 'out-of-stock';
  const isLow = variant.status === 'low-in-stock';

  const nameColor  = isOos ? palette.borderDisabled : palette.textPrimary;
  const priceColor = isOos ? palette.neutral        : palette.textPrimary;
  const stockColor = isOos ? palette.neutral        : palette.textSecondary;

  return (
    <Pressable
      onPress={isOos ? undefined : onPress}
      style={({ pressed }) => [
        s.row,
        { borderBottomColor: palette.border },
        pressed && !isOos && { backgroundColor: '#F6F6F6' },
      ]}
    >
      {/* Thumbnail */}
      <View style={[s.thumb, { borderColor: palette.border }]}>
        <Image
          source={variant.imageSource}
          style={s.thumbImg}
          resizeMode="cover"
        />
      </View>

      {/* Info */}
      <View style={s.rowInfo}>
        {/* Name */}
        <Text
          style={[s.variantName, { color: nameColor, fontFamily: FontFamily.textMedium }]}
          numberOfLines={1}
        >
          {productName} | {variant.color} | {variant.size}
        </Text>

        {/* Bottom row: price + stock + badge */}
        <View style={s.rowBottom}>
          <View style={s.itemInfo}>
            <Text style={[s.price, { color: priceColor, fontFamily: FontFamily.textRegular }]}>
              {variant.price}
            </Text>
            <Text style={[s.stock, { color: stockColor, fontFamily: FontFamily.textRegular }]}>
              {variant.stock}
            </Text>
          </View>

          {isOos && (
            <View style={[s.badge, { backgroundColor: palette.critical }]}>
              <Text style={s.badgeText}>Out of Stock</Text>
            </View>
          )}
          {isLow && (
            <View style={[s.badge, { backgroundColor: palette.bgBase }]}>
              <Text style={s.badgeText}>Low in Stock</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },

  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  sheet: {
    width:                600,
    maxHeight:            C1_H - 40,
    borderTopLeftRadius:  Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow:             'hidden',
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    backgroundColor:   '#111111',
    paddingHorizontal: Spacing[20],
    paddingVertical:   Spacing[20],
  },

  headerTitle: {
    flex:       1,
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
    color:      '#ffffff',
  },

  closeBtn: {
    width:          36,
    height:         36,
    borderRadius:   Radius.full,
    alignItems:     'center',
    justifyContent: 'center',
    marginLeft:     Spacing[8],
  },

  // ── List ────────────────────────────────────────────────────────────────────
  list: {
    flex: 1,
  },

  // ── Variant Row ─────────────────────────────────────────────────────────────
  row: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               Spacing[16],
    paddingHorizontal: Spacing[20],
    paddingVertical:   Spacing[16],
    borderBottomWidth: 1,
    backgroundColor:   '#ffffff',
  },

  thumb: {
    width:        60,
    height:       60,
    borderRadius: Radius.xs,
    borderWidth:  1,
    overflow:     'hidden',
    flexShrink:   0,
  },

  thumbImg: {
    width:  '100%',
    height: '100%',
  },

  rowInfo: {
    flex:           1,
    gap:            Spacing[8],
    justifyContent: 'space-between',
    alignSelf:      'stretch',
  },

  variantName: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
  },

  rowBottom: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },

  itemInfo: {
    flexDirection: 'row',
    gap:           Spacing[24],
  },

  price: {
    fontSize:   FontSize.bodyMD,
    lineHeight: FontSize.bodyMD * 1.5,
  },

  stock: {
    fontSize:   FontSize.bodyMD,
    lineHeight: FontSize.bodyMD * 1.5,
  },

  badge: {
    paddingHorizontal: Spacing[8],
    paddingVertical:   Spacing[6],
    borderRadius:      Radius.xs,
  },

  badgeText: {
    fontFamily:    FontFamily.textBold,
    fontSize:      FontSize.labelSM,
    lineHeight:    FontSize.labelSM * 1.2,
    color:         '#ffffff',
    textTransform: 'uppercase',
  },
});
