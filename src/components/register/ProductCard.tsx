/**
 * ProductCard — Register App
 *
 * Figma: Register-App-2025 — POS Plan with Sales Price + Quantity
 * Item tile used inside the scrollable product grid.
 *
 * Variants:
 *  - image product  : shows a photo thumbnail
 *  - label product  : solid colour background with abbreviated name
 *  - out-of-stock   : greyed out with "OUT OF STOCK" badge
 *  - low-in-stock   : "LOW IN STOCK" badge top-right
 *  - category tile  : "See All" label, no price/qty
 */

import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ColorTokens } from '../../theme/colors';
import { FontFamily, FontSize, FontWeight } from '../../theme/typography';
import { Radius, Spacing } from '../../theme/spacing';

export type ProductCardProps = {
  name:          string;
  price:         string;
  originalPrice?: string;
  quantity?:     number;
  imageSource?:  ImageSourcePropType;
  labelColor?:   string;
  labelText?:    string;
  seeAll?:       boolean;
  /** When true the card opens a variant-selection drawer instead of adding directly to cart */
  hasVariants?:  boolean;
  status?:       'in-stock' | 'out-of-stock' | 'low-in-stock';
  onPress?:      () => void;
  cardWidth?:    number;
  cardHeight?:   number;
  dark?:         boolean;
  style?:        ViewStyle;
};

export function ProductCard({
  name,
  price,
  originalPrice,
  quantity,
  imageSource,
  labelColor,
  labelText,
  seeAll       = false,
  hasVariants  = false,
  status       = 'in-stock',
  onPress,
  cardWidth    = 140,
  cardHeight   = 172,
  dark         = false,
  style,
}: ProductCardProps) {
  const palette  = dark ? ColorTokens.dark : ColorTokens.light;
  const isOos    = status === 'out-of-stock';
  const isLow    = status === 'low-in-stock';
  const imgH     = Math.round(cardHeight * 0.349); // ~60px at 172px card height (Figma spec)

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        {
          width:           cardWidth,
          height:          cardHeight,
          backgroundColor: isOos ? palette.bgLight : palette.bgSurface,
          opacity:         isOos ? 0.85 : 1,
        },
        style,
      ]}
    >
      {/* ── Image or colour-label thumbnail ──────────────────────────────── */}
      <View style={[styles.thumb, { height: imgH, backgroundColor: labelColor ?? palette.bgLevel1 }]}>
        {imageSource ? (
          <Image source={imageSource} style={styles.img} resizeMode="cover" />
        ) : labelText ? (
          <Text style={[styles.labelText, { color: '#fff' }]} numberOfLines={1}>
            {labelText}
          </Text>
        ) : null}

        {/* Status badges */}
        {isOos && (
          <View style={[styles.badgeCentered, { backgroundColor: palette.critical }]}>
            <Text style={styles.badgeText}>OUT OF STOCK</Text>
          </View>
        )}
        {isLow && (
          <View style={[styles.badge, styles.badgeTopRight, { backgroundColor: palette.bgBase }]}>
            <Text style={styles.badgeText}>LOW IN STOCK</Text>
          </View>
        )}
      </View>

      {/* ── Product info ──────────────────────────────────────────────────── */}
      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            {
              color: isOos ? palette.textSecondary : palette.textPrimary,
              fontFamily: FontFamily.textRegular,
              fontSize: FontSize.bodyXS,
            },
          ]}
          numberOfLines={2}
        >
          {name}
        </Text>

        {seeAll || hasVariants ? (
          <Text style={[styles.seeAll, { color: palette.textPrimary, fontFamily: FontFamily.textRegular, fontSize: FontSize.bodySM }]}>
            See All
          </Text>
        ) : (
          <View style={styles.priceRow}>
            <View>
              {originalPrice ? (
                <Text style={[styles.originalPrice, { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.label }]}>
                  {originalPrice}
                </Text>
              ) : null}
              <Text style={[styles.price, { color: isOos ? palette.textSecondary : palette.textPrimary, fontFamily: FontFamily.textMedium, fontSize: FontSize.bodyXS }]}>
                {price}
              </Text>
            </View>
            {quantity !== undefined && (
              <Text style={[styles.qty, { color: palette.textSecondary, fontFamily: FontFamily.textRegular, fontSize: FontSize.label }]}>
                {quantity}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius:  Radius.xs,
    overflow:      'hidden',
    flexDirection: 'column',
  },
  thumb: {
    width:          '100%',
    justifyContent: 'center',
    alignItems:     'center',
    overflow:       'hidden',
    position:       'relative',
  },
  img: {
    ...StyleSheet.absoluteFillObject,
  },
  labelText: {
    fontFamily:  FontFamily.textBold,
    fontSize:    FontSize.headingMD,
    fontWeight:  FontWeight.bold,
    letterSpacing: 1,
    textAlign:   'center',
    paddingHorizontal: Spacing[8],
  },
  badgeCentered: {
    position:         'absolute',
    bottom:           Spacing[8],
    alignSelf:        'center',
    paddingHorizontal: Spacing[8],
    paddingVertical:  Spacing[4],
    borderRadius:     Radius.xs,
  },
  badge: {
    position:         'absolute',
    paddingHorizontal: Spacing[8],
    paddingVertical:  Spacing[4],
    borderRadius:     Radius.xs,
  },
  badgeTopRight: {
    top:   Spacing[4],
    right: Spacing[4],
  },
  badgeText: {
    fontFamily:  FontFamily.textBold,
    fontSize:    9,
    fontWeight:  FontWeight.bold,
    color:       '#fff',
    letterSpacing: 0.3,
  },
  info: {
    flex:    1,
    padding: Spacing[8],
    justifyContent: 'space-between',
  },
  name: {
    lineHeight: FontSize.bodyXS * 1.4,
    marginBottom: Spacing[4],
  },
  seeAll: {
    marginTop: 'auto',
  },
  priceRow: {
    flexDirection:  'row',
    alignItems:     'flex-end',
    justifyContent: 'space-between',
    marginTop:      'auto',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    lineHeight: FontSize.label * 1.4,
  },
  price: {
    lineHeight: FontSize.bodyXS * 1.4,
  },
  qty: {
    lineHeight: FontSize.label * 1.4,
  },
});
