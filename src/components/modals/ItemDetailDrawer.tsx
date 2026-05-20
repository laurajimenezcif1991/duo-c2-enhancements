/**
 * ItemDetailDrawer — two-view bottom drawer for variant products
 *
 * Single animated sheet with in-place navigation:
 *
 *   VIEW: 'variants'
 *     ┌─ Dark header: Product name + X close ──────────────────────┐
 *     │ Scrollable variant list                                     │
 *     └─────────────────────────────────────────────────────────────┘
 *
 *   VIEW: 'modifier'  (replaces content instantly on variant tap)
 *     ┌─ Light header: ← Product (Color, Size) | ↺ Reset Modifier ─┐
 *     │ Scrollable modifier form                                    │
 *     │   • Modifier groups (checkbox / radio)                      │
 *     │   • Select Quantity  (− n +)                                │
 *     │   • Discount / Fee  (+ Add placeholders)                   │
 *     │   • Note  (TextArea, max 200 chars)                         │
 *     ├─ Button bar: "Add to order" ───────────────────────────────┤
 *     └─────────────────────────────────────────────────────────────┘
 *
 * Pressing ← returns to the variant list; pressing X closes the drawer.
 *
 * Figma refs:
 *   Variant list  — Register-App-2025 · node 6539:116441
 *   Modifier form — Register-App-2025 · node 6539:116905
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorTokens }          from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';
import { Radius, Spacing }      from '../../theme/spacing';
import { Icon }                 from '../ui/Icon';
import type { ProductVariant, VariantProduct, ModifierGroup } from '../../types/variants';

// ─── Constants ────────────────────────────────────────────────────────────────

const C1_H     = 960;
const TEAL     = '#00A4A6';
const NOTE_MAX = 200;

// ─── Props ────────────────────────────────────────────────────────────────────

export type ItemDetailDrawerProps = {
  visible:      boolean;
  product:      VariantProduct | null;
  onClose:      () => void;
  /** Called when "Add to order" is confirmed in the modifier view */
  onAddToOrder: (variant: ProductVariant, qty: number, note: string) => void;
  dark?:        boolean;
};

type DrawerView = 'variants' | 'modifier';

// ─── Component ────────────────────────────────────────────────────────────────

export function ItemDetailDrawer({
  visible,
  product,
  onClose,
  onAddToOrder,
  dark = false,
}: ItemDetailDrawerProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  // ── Animation ─────────────────────────────────────────────────────────────
  const slideY   = useRef(new Animated.Value(C1_H)).current;
  const scrimRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scrimRef.setValue(1);
      Animated.spring(slideY, {
        toValue: 0, useNativeDriver: true,
        damping: 28, stiffness: 260, mass: 0.9,
      }).start();
    } else {
      Animated.spring(slideY, {
        toValue: C1_H, useNativeDriver: true,
        damping: 28, stiffness: 280, mass: 0.8,
      }).start(() => scrimRef.setValue(0));
    }
  }, [visible, slideY, scrimRef]);

  // ── In-drawer navigation ──────────────────────────────────────────────────
  const [view,            setView]            = useState<DrawerView>('variants');
  const [modVariant,      setModVariant]      = useState<ProductVariant | null>(null);

  // Modifier form state
  const [checkSelections, setCheckSelections] = useState<Record<string, Set<string>>>({});
  const [radioSelections, setRadioSelections] = useState<Record<string, string>>({});
  const [quantity,        setQuantity]        = useState(1);
  const [note,            setNote]            = useState('');

  // Reset to variant list whenever the drawer closes or a new product opens
  useEffect(() => {
    if (!visible) {
      setView('variants');
      setModVariant(null);
    }
  }, [visible]);

  const resetModifierForm = () => {
    setCheckSelections({});
    setRadioSelections({});
    setQuantity(1);
    setNote('');
  };

  const handleVariantPress = (variant: ProductVariant) => {
    if (variant.status === 'out-of-stock') return;
    resetModifierForm();
    setModVariant(variant);
    setView('modifier');
  };

  const handleBack = () => {
    setView('variants');
    setModVariant(null);
  };

  const handleAddToOrder = () => {
    if (!modVariant) return;
    onAddToOrder(modVariant, quantity, note.trim());
  };

  // Modifier form helpers
  const toggleCheckbox = (groupId: string, optionId: string) => {
    setCheckSelections(prev => {
      const current = new Set(prev[groupId] ?? []);
      current.has(optionId) ? current.delete(optionId) : current.add(optionId);
      return { ...prev, [groupId]: current };
    });
  };

  const selectRadio = (groupId: string, optionId: string) => {
    setRadioSelections(prev => ({ ...prev, [groupId]: optionId }));
  };

  // ── Render ───────────────────────────────────────────────────────────────
  const isModifier = view === 'modifier';

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[s.overlay, { opacity: scrimRef }]}
    >
      <Pressable style={s.scrim} onPress={onClose} />

      <Animated.View
        style={[s.sheet, { backgroundColor: palette.bgSurface }, { transform: [{ translateY: slideY }] }]}
      >
        {/* ── Header — switches between dark (variants) and light (modifier) ── */}
        {!isModifier ? (

          /* Variant list header — dark */
          <View style={s.darkHeader}>
            <Text style={[s.darkHeaderTitle, { fontFamily: FontFamily.textMedium }]} numberOfLines={1}>
              {product?.name ?? ''}
            </Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
              <Icon name="x" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

        ) : (

          /* Modifier header — light */
          <View style={[s.lightHeader, { borderBottomColor: palette.border }]}>
            <TouchableOpacity onPress={handleBack} style={s.backBtn} activeOpacity={0.7}>
              <Icon name="chevron-left" size={24} color={palette.textPrimary} />
              <Text
                style={[s.lightHeaderTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}
                numberOfLines={1}
              >
                {modVariant ? `${product?.name} (${modVariant.color}, ${modVariant.size})` : ''}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetModifierForm} style={s.resetBtn} activeOpacity={0.7}>
              <Icon name="refresh" size={22} color={TEAL} />
              <Text style={[s.resetLabel, { fontFamily: FontFamily.textMedium }]}>Reset Modifier</Text>
            </TouchableOpacity>
          </View>

        )}

        {/* ── Body ───────────────────────────────────────────────────────── */}
        {!isModifier ? (

          /* ── Variant list ─────────────────────────────────────────────── */
          <ScrollView style={s.list} showsVerticalScrollIndicator={false} bounces={false}>
            {product?.variants.map(variant => (
              <VariantRow
                key={variant.id}
                productName={product.name}
                variant={variant}
                palette={palette}
                onPress={() => handleVariantPress(variant)}
              />
            ))}
          </ScrollView>

        ) : (

          /* ── Modifier form ────────────────────────────────────────────── */
          <>
            <ScrollView
              style={s.list}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Modifier groups (checkbox / radio) */}
              {(product?.modifierGroups ?? []).map(group => (
                <ModifierSection
                  key={group.id}
                  group={group}
                  checkValue={checkSelections[group.id] ?? new Set()}
                  radioValue={radioSelections[group.id] ?? ''}
                  onToggleCheck={optId => toggleCheckbox(group.id, optId)}
                  onSelectRadio={optId => selectRadio(group.id, optId)}
                  palette={palette}
                />
              ))}

              {/* Select Quantity */}
              <View style={[s.modSection, { borderTopColor: palette.border }]}>
                <Text style={[s.modSectionLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                  Select Quantity
                </Text>
                <View style={s.qtyRow}>
                  <TouchableOpacity
                    onPress={() => setQuantity(q => Math.max(1, q - 1))}
                    style={[s.qtyBtn, { borderColor: palette.neutral }]}
                    activeOpacity={0.7}
                  >
                    <Icon name="minus" size={20} color={palette.textPrimary} />
                  </TouchableOpacity>
                  <View style={s.qtyValWrap}>
                    <Text style={[s.qtyVal, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                      {quantity}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setQuantity(q => q + 1)}
                    style={[s.qtyBtn, { borderColor: palette.textSecondary }]}
                    activeOpacity={0.7}
                  >
                    <Icon name="plus" size={20} color={palette.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Discount */}
              <View style={[s.modSection, { borderTopColor: palette.border }]}>
                <Text style={[s.modSectionLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                  Discount
                </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={[s.addLink, { fontFamily: FontFamily.textMedium }]}>+ Add</Text>
                </TouchableOpacity>
              </View>

              {/* Fee */}
              <View style={[s.modSection, { borderTopColor: palette.border }]}>
                <Text style={[s.modSectionLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                  Fee
                </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={[s.addLink, { fontFamily: FontFamily.textMedium }]}>+ Add</Text>
                </TouchableOpacity>
              </View>

              {/* Note */}
              <View style={[s.noteSection, { borderTopColor: palette.border }]}>
                <Text style={[s.modSectionLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                  Note
                </Text>
                <View style={[s.textAreaWrap, { borderColor: palette.neutral }]}>
                  <TextInput
                    style={[s.textArea, { color: palette.textPrimary, fontFamily: FontFamily.textRegular }]}
                    placeholder="Add Notes"
                    placeholderTextColor={palette.neutral}
                    multiline
                    maxLength={NOTE_MAX}
                    value={note}
                    onChangeText={setNote}
                    textAlignVertical="top"
                  />
                  <View style={s.noteFooter}>
                    <Text style={[s.noteCounter, { color: palette.neutral, fontFamily: FontFamily.textRegular }]}>
                      {note.length}/{NOTE_MAX}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ height: Spacing[16] }} />
            </ScrollView>

            {/* Add to order button */}
            <View style={[s.buttonBar, { borderTopColor: palette.border }]}>
              <TouchableOpacity onPress={handleAddToOrder} style={s.addBtn} activeOpacity={0.85}>
                <Text style={[s.addBtnLabel, { fontFamily: FontFamily.textMedium }]}>
                  Add to order
                </Text>
              </TouchableOpacity>
            </View>
          </>

        )}
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
      <View style={[s.thumb, { borderColor: palette.border }]}>
        <Image source={variant.imageSource} style={s.thumbImg} resizeMode="cover" />
      </View>

      <View style={s.rowInfo}>
        <Text style={[s.variantName, { color: nameColor, fontFamily: FontFamily.textMedium }]} numberOfLines={1}>
          {productName} | {variant.color} | {variant.size}
        </Text>

        <View style={s.rowBottom}>
          <View style={s.itemInfo}>
            <Text style={[s.price, { color: priceColor, fontFamily: FontFamily.textRegular }]}>{variant.price}</Text>
            <Text style={[s.stock, { color: stockColor, fontFamily: FontFamily.textRegular }]}>{variant.stock}</Text>
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

// ─── Modifier Section ─────────────────────────────────────────────────────────

type ModifierSectionProps = {
  group:         ModifierGroup;
  checkValue:    Set<string>;
  radioValue:    string;
  onToggleCheck: (optId: string) => void;
  onSelectRadio: (optId: string) => void;
  palette:       Palette;
};

function ModifierSection({ group, checkValue, radioValue, onToggleCheck, onSelectRadio, palette }: ModifierSectionProps) {
  const options = group.options;
  const rows: (typeof options)[] = [];
  for (let i = 0; i < options.length; i += 2) rows.push(options.slice(i, i + 2));

  return (
    <View style={[s.modGroup, { borderTopColor: palette.border }]}>
      {/* Section header */}
      <View style={s.modGroupHeader}>
        <Text style={[s.modGroupTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
          {group.title}
        </Text>
        <Text style={[s.modGroupHint, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
          {'  '}({group.hint})
        </Text>
      </View>

      {rows.map((row, ri) => (
        <View key={ri} style={[s.optionRow, ri === rows.length - 1 && s.optionRowLast]}>
          {row.map(opt => {
            const selected = group.type === 'checkbox'
              ? checkValue.has(opt.id)
              : radioValue === opt.id;

            return (
              <TouchableOpacity
                key={opt.id}
                style={s.optionItem}
                activeOpacity={0.7}
                onPress={() => group.type === 'checkbox' ? onToggleCheck(opt.id) : onSelectRadio(opt.id)}
              >
                {group.type === 'checkbox' ? (
                  <View style={[
                    s.checkbox,
                    { borderColor: palette.contentTertiary },
                    selected && { backgroundColor: '#61EDEA', borderColor: '#61EDEA' },
                  ]}>
                    {selected && <Icon name="checkmark" size={12} color="#111111" />}
                  </View>
                ) : (
                  <View style={[
                    s.radio,
                    { borderColor: palette.borderDisabled, borderWidth: 1 },
                    selected && { borderColor: '#61EDEA', borderWidth: 6, backgroundColor: '#ffffff' },
                  ]} />
                )}
                <Text style={[s.optionLabel, { fontFamily: FontFamily.textRegular }]} numberOfLines={2}>
                  <Text style={{ color: palette.textPrimary }}>{opt.label} </Text>
                  <Text style={{ color: palette.textSecondary }}>{opt.price}</Text>
                </Text>
              </TouchableOpacity>
            );
          })}
          {row.length === 1 && <View style={s.optionItem} />}
        </View>
      ))}
    </View>
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

  // ── Variant-list header (dark) ─────────────────────────────────────────────
  darkHeader: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    backgroundColor:   '#111111',
    paddingHorizontal: Spacing[20],
    paddingVertical:   Spacing[20],
  },
  darkHeaderTitle: {
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

  // ── Modifier header (light) ───────────────────────────────────────────────
  lightHeader: {
    height:            76,
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[16],
    borderBottomWidth: 1,
    backgroundColor:   '#ffffff',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[8],
    flex:          1,
    paddingRight:  Spacing[8],
  },
  lightHeaderTitle: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
    flex:       1,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[8],
    flexShrink:    0,
  },
  resetLabel: {
    fontSize:   FontSize.bodySM,
    lineHeight: FontSize.bodySM * 1.5,
    color:      TEAL,
  },

  // ── Shared list / scroll ──────────────────────────────────────────────────
  list: {
    flex: 1,
  },

  // ── Variant Row ──────────────────────────────────────────────────────────
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

  // ── Modifier section row ─────────────────────────────────────────────────
  modSection: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[20],
    borderTopWidth:    1,
  },
  modSectionLabel: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
  },
  addLink: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
    color:      TEAL,
  },

  // ── Quantity ─────────────────────────────────────────────────────────────
  qtyRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           2,
  },
  qtyBtn: {
    width:          44,
    height:         44,
    borderRadius:   Radius.full,
    borderWidth:    1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  qtyValWrap: {
    width:          60,
    alignItems:     'center',
    justifyContent: 'center',
  },
  qtyVal: {
    fontSize:   FontSize.headingMD,
    lineHeight: FontSize.headingMD * 1.2,
    textAlign:  'center',
  },

  // ── Note ─────────────────────────────────────────────────────────────────
  noteSection: {
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[20],
    gap:               Spacing[16],
    borderTopWidth:    1,
  },
  textAreaWrap: {
    borderWidth:       1,
    borderRadius:      Radius.sm,
    backgroundColor:   '#ffffff',
    minHeight:         112,
    paddingTop:        Spacing[6],
    paddingHorizontal: Spacing[16],
    paddingBottom:     Spacing[8],
  },
  textArea: {
    fontSize:   FontSize.bodyMD,
    lineHeight: FontSize.bodyMD * 1.5,
    minHeight:  60,
    flex:       1,
  },
  noteFooter: {
    flexDirection:  'row',
    justifyContent: 'flex-end',
    marginTop:      Spacing[4],
  },
  noteCounter: {
    fontSize:   FontSize.bodyXS,
    lineHeight: FontSize.bodyXS * 1.5,
  },

  // ── Button bar ───────────────────────────────────────────────────────────
  buttonBar: {
    height:            96,
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[16],
    borderTopWidth:    1,
    backgroundColor:   '#ffffff',
  },
  addBtn: {
    flex:            1,
    height:          64,
    backgroundColor: '#111111',
    borderRadius:    Radius.sm,
    alignItems:      'center',
    justifyContent:  'center',
  },
  addBtnLabel: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
    color:      '#ffffff',
  },

  // ── Modifier groups ──────────────────────────────────────────────────────
  modGroup: {
    borderTopWidth: 1,
  },
  modGroupHeader: {
    flexDirection:     'row',
    alignItems:        'center',
    flexWrap:          'wrap',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[16],
  },
  modGroupTitle: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
  },
  modGroupHint: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
  },
  optionRow: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
  },
  optionRowLast: {
    marginBottom: Spacing[8],
  },
  optionItem: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    gap:               Spacing[8],
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[16],
    width:             '50%',
  },
  checkbox: {
    width:          20,
    height:         20,
    borderRadius:   Radius.xs,
    borderWidth:    1,
    alignItems:     'center',
    justifyContent: 'center',
    marginTop:      3,
    flexShrink:     0,
  },
  radio: {
    width:        20,
    height:       20,
    borderRadius: Radius.full,
    borderWidth:  1,
    marginTop:    3,
    flexShrink:   0,
  },
  optionLabel: {
    flex:       1,
    fontSize:   FontSize.bodySM,
    lineHeight: FontSize.bodySM * 1.5,
  },
});
