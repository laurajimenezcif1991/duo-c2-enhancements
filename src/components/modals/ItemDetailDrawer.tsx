/**
 * ItemDetailDrawer — three-view bottom drawer for variant products
 *
 * In-place navigation — one animated sheet, content replaces instantly:
 *
 *   VIEW: 'variants'
 *     Dark header: Product name + X close
 *     → tap variant row → 'modifier'
 *
 *   VIEW: 'modifier'
 *     Dark header: ← Product (Color, Size) | ↺ Reset Modifier
 *     Modifier groups · Quantity · Discount · Fee · Note
 *     → tap Discount "+ Add" → 'discount'
 *     → tap "Add to order" → commits cart + closes
 *     ← back → 'variants'
 *
 *   VIEW: 'discount'
 *     Dark header: ← Discount | ↺ Reset
 *     Preset cards · Custom toggle + type selector + amount input
 *     Cancel → 'modifier'  |  Confirm → applies discount, → 'modifier'
 *
 * Figma refs:
 *   Variant list  — 6539:116441
 *   Modifier form — 6539:116905
 *   Discount form — 6539:117601
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

const C1_H      = 960;
const TEAL      = '#00A4A6';
const TEAL_LITE = '#61EDEA';
const TEAL_DARK = '#09757A';
const NOTE_MAX  = 200;

const DISCOUNT_PRESETS = [
  { id: 'p1', value: '10%', label: 'Local Discount' },
  { id: 'p2', value: '15%', label: 'Rush'           },
  { id: 'p3', value: '7%',  label: 'Seasonal'       },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type DrawerView = 'variants' | 'modifier' | 'discount';

type AppliedDiscount = {
  type:  '$' | '%';
  value: string;
  label: string;
};

// ─── Props ────────────────────────────────────────────────────────────────────

export type ItemDetailDrawerProps = {
  visible:      boolean;
  product:      VariantProduct | null;
  onClose:      () => void;
  onAddToOrder: (variant: ProductVariant, qty: number, note: string) => void;
  dark?:        boolean;
};

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

  // ── Navigation state ──────────────────────────────────────────────────────
  const [view,       setView]       = useState<DrawerView>('variants');
  const [modVariant, setModVariant] = useState<ProductVariant | null>(null);

  // Modifier form
  const [checkSelections, setCheckSelections] = useState<Record<string, Set<string>>>({});
  const [radioSelections, setRadioSelections] = useState<Record<string, string>>({});
  const [quantity,        setQuantity]        = useState(1);
  const [note,            setNote]            = useState('');

  // Applied discount (shown in Discount row of modifier)
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);

  // Discount form
  const [discountPreset,     setDiscountPreset]     = useState<string | null>(null);
  const [taxAfterDiscount,   setTaxAfterDiscount]   = useState(true);
  const [discountType,       setDiscountType]       = useState<'$' | '%'>('%');
  const [discountAmount,     setDiscountAmount]     = useState('');

  // Reset all when drawer closes
  useEffect(() => {
    if (!visible) {
      setView('variants');
      setModVariant(null);
      setAppliedDiscount(null);
    }
  }, [visible]);

  // ── Navigation handlers ───────────────────────────────────────────────────
  const handleVariantPress = (variant: ProductVariant) => {
    if (variant.status === 'out-of-stock') return;
    setCheckSelections({});
    setRadioSelections({});
    setQuantity(1);
    setNote('');
    setAppliedDiscount(null);
    setModVariant(variant);
    setView('modifier');
  };

  const handleBack = () => {
    if (view === 'modifier') {
      setView('variants');
      setModVariant(null);
    } else if (view === 'discount') {
      setView('modifier');
    }
  };

  const handleAddToOrder = () => {
    if (!modVariant) return;
    onAddToOrder(modVariant, quantity, note.trim());
  };

  // Modifier helpers
  const toggleCheckbox = (groupId: string, optId: string) => {
    setCheckSelections(prev => {
      const cur = new Set(prev[groupId] ?? []);
      cur.has(optId) ? cur.delete(optId) : cur.add(optId);
      return { ...prev, [groupId]: cur };
    });
  };
  const selectRadio = (groupId: string, optId: string) =>
    setRadioSelections(prev => ({ ...prev, [groupId]: optId }));

  // Discount handlers
  const openDiscountView = () => {
    setDiscountPreset(null);
    setDiscountAmount('');
    setDiscountType('%');
    setTaxAfterDiscount(true);
    setView('discount');
  };

  const handleDiscountReset = () => {
    setDiscountPreset(null);
    setDiscountAmount('');
    setDiscountType('%');
    setTaxAfterDiscount(true);
  };

  const handleDiscountConfirm = () => {
    // Build label from preset or custom input
    if (discountPreset) {
      const preset = DISCOUNT_PRESETS.find(p => p.id === discountPreset);
      if (preset) {
        setAppliedDiscount({ type: '%', value: preset.value, label: preset.label });
      }
    } else if (discountAmount) {
      setAppliedDiscount({
        type:  discountType,
        value: `${discountType === '%' ? '' : '$'}${discountAmount}${discountType === '%' ? '%' : ''}`,
        label: 'Custom',
      });
    }
    setView('modifier');
  };

  const handleRemoveDiscount = () => setAppliedDiscount(null);

  // ── Derived ──────────────────────────────────────────────────────────────
  const isModifier = view === 'modifier';
  const isDiscount = view === 'discount';

  // ── Header title ─────────────────────────────────────────────────────────
  let headerLeft = '';
  let headerRightLabel = '';
  let headerRightAction: (() => void) | null = null;

  if (isModifier && modVariant) {
    headerLeft = `${product?.name} (${modVariant.color}, ${modVariant.size})`;
    headerRightLabel = 'Reset Modifier';
    headerRightAction = () => {
      setCheckSelections({});
      setRadioSelections({});
      setQuantity(1);
      setNote('');
    };
  } else if (isDiscount) {
    headerLeft = 'Discount';
    headerRightLabel = 'Reset';
    headerRightAction = handleDiscountReset;
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[s.overlay, { opacity: scrimRef }]}
    >
      <Pressable style={s.scrim} onPress={onClose} />

      <Animated.View
        style={[s.sheet, { backgroundColor: palette.bgSurface }, { transform: [{ translateY: slideY }] }]}
      >
        {/* ── Header ───────────────────────────────────────────────────── */}
        {!isModifier && !isDiscount ? (

          /* Variant list header */
          <View style={s.darkHeader}>
            <Text style={[s.darkHeaderTitle, { fontFamily: FontFamily.textMedium }]} numberOfLines={1}>
              {product?.name ?? ''}
            </Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
              <Icon name="x" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

        ) : (

          /* Modifier / Discount shared header */
          <View style={s.darkHeader}>
            <TouchableOpacity onPress={handleBack} style={s.backBtn} activeOpacity={0.7}>
              <Icon name="chevron-left" size={24} color="#ffffff" />
              <Text style={[s.darkHeaderTitle, { fontFamily: FontFamily.textMedium }]} numberOfLines={1}>
                {headerLeft}
              </Text>
            </TouchableOpacity>
            {headerRightAction && (
              <TouchableOpacity onPress={headerRightAction} style={s.resetBtn} activeOpacity={0.7}>
                <Icon name="refresh" size={22} color={TEAL_LITE} />
                <Text style={[s.resetLabel, { fontFamily: FontFamily.textMedium }]}>
                  {headerRightLabel}
                </Text>
              </TouchableOpacity>
            )}
          </View>

        )}

        {/* ── Body ───────────────────────────────────────────────────── */}
        {view === 'variants' && (
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
        )}

        {view === 'modifier' && (
          <>
            <ScrollView style={s.list} showsVerticalScrollIndicator={false} bounces={false} keyboardShouldPersistTaps="handled">
              {/* Modifier groups */}
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
                  <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))} style={[s.qtyBtn, { borderColor: palette.neutral }]} activeOpacity={0.7}>
                    <Icon name="minus" size={20} color={palette.textPrimary} />
                  </TouchableOpacity>
                  <View style={s.qtyValWrap}>
                    <Text style={[s.qtyVal, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>{quantity}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setQuantity(q => q + 1)} style={[s.qtyBtn, { borderColor: palette.textSecondary }]} activeOpacity={0.7}>
                    <Icon name="plus" size={20} color={palette.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Discount */}
              <View style={[s.modSection, { borderTopColor: palette.border }]}>
                <Text style={[s.modSectionLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                  Discount
                </Text>
                {appliedDiscount ? (
                  <View style={s.appliedRow}>
                    <Text style={[s.appliedValue, { color: palette.textPrimary, fontFamily: FontFamily.textRegular }]}>
                      {appliedDiscount.value}
                    </Text>
                    <TouchableOpacity onPress={handleRemoveDiscount} activeOpacity={0.7} style={s.trashBtn}>
                      <Icon name="trash" size={20} color={palette.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={openDiscountView} activeOpacity={0.7}>
                    <Text style={[s.addLink, { fontFamily: FontFamily.textMedium }]}>+ Add</Text>
                  </TouchableOpacity>
                )}
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
                <Text style={[s.modSectionLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>Note</Text>
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

            {(() => {
              const hasCheckSel  = Object.values(checkSelections).some(set => set.size > 0);
              const hasRadioSel  = Object.values(radioSelections).some(v => !!v);
              const hasModGroups = (product?.modifierGroups?.length ?? 0) > 0;
              // If no modifier groups exist, always enable; otherwise require at least one selection
              const canAdd = !hasModGroups || hasCheckSel || hasRadioSel;
              return (
                <View style={[s.buttonBar, { borderTopColor: palette.border }]}>
                  <TouchableOpacity
                    onPress={canAdd ? handleAddToOrder : undefined}
                    style={[s.addBtn, { backgroundColor: canAdd ? '#111111' : palette.neutral }]}
                    activeOpacity={canAdd ? 0.85 : 1}
                  >
                    <Text style={[s.addBtnLabel, { fontFamily: FontFamily.textMedium }]}>Add to order</Text>
                  </TouchableOpacity>
                </View>
              );
            })()}
          </>
        )}

        {view === 'discount' && (
          <>
            <ScrollView style={s.list} showsVerticalScrollIndicator={false} bounces={false} keyboardShouldPersistTaps="handled">

              {/* Category and Product Level */}
              <View style={[s.discSection, { borderBottomColor: palette.border }]}>
                <Text style={[s.discSectionTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                  Category and Product Level
                </Text>
                <View style={s.presetRow}>
                  {DISCOUNT_PRESETS.map(preset => {
                    const isSelected = discountPreset === preset.id;
                    return (
                      <TouchableOpacity
                        key={preset.id}
                        onPress={() => setDiscountPreset(isSelected ? null : preset.id)}
                        style={[
                          s.presetCard,
                          { backgroundColor: isSelected ? TEAL_LITE : palette.bgAccent },
                          isSelected && s.presetCardSelected,
                        ]}
                        activeOpacity={0.8}
                      >
                        <Text style={[s.presetValue, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                          {preset.value}
                        </Text>
                        <Text style={[s.presetLabel, { color: palette.textPrimary, fontFamily: FontFamily.textRegular }]}>
                          {preset.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Custom */}
              <View style={s.discSection}>
                <Text style={[s.discSectionTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                  Custom
                </Text>

                {/* Tax after discount toggle */}
                <TouchableOpacity
                  onPress={() => setTaxAfterDiscount(t => !t)}
                  style={[s.toggleRow, { backgroundColor: palette.bgLight }]}
                  activeOpacity={0.8}
                >
                  <Text style={[s.toggleLabel, { color: palette.textPrimary, fontFamily: FontFamily.textRegular }]}>
                    Tax after discount
                  </Text>
                  <View style={[
                    s.togglePill,
                    taxAfterDiscount
                      ? { backgroundColor: TEAL_LITE, paddingLeft: 26, paddingRight: 6, borderWidth: 0 }
                      : { backgroundColor: '#ffffff', paddingLeft: 6, paddingRight: 26, borderWidth: 2, borderColor: '#767676' },
                  ]}>
                    <View style={[s.toggleThumb, { backgroundColor: taxAfterDiscount ? '#ffffff' : '#767676' }]} />
                  </View>
                </TouchableOpacity>

                {/* Type selector + amount input */}
                <View style={s.discInputRow}>
                  {/* $ / % horizontal toggle */}
                  <View style={s.typeSelector}>
                    <TouchableOpacity
                      onPress={() => setDiscountType('$')}
                      style={[
                        s.typeBtnLeft,
                        discountType === '$'
                          ? { backgroundColor: TEAL_DARK, borderColor: TEAL_DARK }
                          : { backgroundColor: '#ffffff', borderColor: palette.contentTertiary },
                      ]}
                      activeOpacity={0.8}
                    >
                      <Icon name="dollar" size={22} color={discountType === '$' ? '#ffffff' : palette.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setDiscountType('%')}
                      style={[
                        s.typeBtnRight,
                        discountType === '%'
                          ? { backgroundColor: TEAL_DARK, borderColor: TEAL_DARK }
                          : { backgroundColor: '#ffffff', borderColor: palette.contentTertiary },
                      ]}
                      activeOpacity={0.8}
                    >
                      <Icon name="percent" size={22} color={discountType === '%' ? '#ffffff' : palette.textPrimary} />
                    </TouchableOpacity>
                  </View>

                  <View style={[s.discInputWrap, { borderColor: palette.contentTertiary }]}>
                    <Text style={[s.discInputFloatLabel, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
                      Enter discount amount
                    </Text>
                    <TextInput
                      style={[s.discInput, { color: palette.textPrimary, fontFamily: FontFamily.textRegular }]}
                      value={discountAmount}
                      onChangeText={v => setDiscountAmount(v.replace(/[^0-9.]/g, ''))}
                      keyboardType="numeric"
                      placeholder={discountType === '%' ? '0%' : '0.00'}
                      placeholderTextColor={palette.textPrimary}
                    />
                  </View>
                </View>
              </View>

              <View style={{ height: Spacing[32] }} />
            </ScrollView>

            {/* Cancel + Confirm */}
            <View style={[s.twoButtonBar, { borderTopColor: palette.border }]}>
              <TouchableOpacity onPress={() => setView('modifier')} style={[s.cancelBtn, { borderColor: palette.contentTertiary }]} activeOpacity={0.8}>
                <Text style={[s.cancelBtnLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              {(() => {
                const canConfirm = !!(discountPreset || discountAmount.trim());
                return (
                  <TouchableOpacity
                    onPress={canConfirm ? handleDiscountConfirm : undefined}
                    style={[s.confirmBtn, { backgroundColor: canConfirm ? palette.bgBase : palette.neutral }]}
                    activeOpacity={canConfirm ? 0.85 : 1}
                  >
                    <Text style={[s.confirmBtnLabel, { fontFamily: FontFamily.textMedium }]}>Confirm</Text>
                  </TouchableOpacity>
                );
              })()}
            </View>
          </>
        )}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Variant Row ──────────────────────────────────────────────────────────────

type Palette = typeof ColorTokens.light | typeof ColorTokens.dark;

function VariantRow({ productName, variant, palette, onPress }: {
  productName: string;
  variant:     ProductVariant;
  palette:     Palette;
  onPress:     () => void;
}) {
  const isOos = variant.status === 'out-of-stock';
  const isLow = variant.status === 'low-in-stock';
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
        <Text style={[s.variantName, { color: isOos ? palette.borderDisabled : palette.textPrimary, fontFamily: FontFamily.textMedium }]} numberOfLines={1}>
          {productName} | {variant.color} | {variant.size}
        </Text>
        <View style={s.rowBottom}>
          <View style={s.itemInfo}>
            <Text style={[s.price, { color: isOos ? palette.neutral : palette.textPrimary, fontFamily: FontFamily.textRegular }]}>{variant.price}</Text>
            <Text style={[s.stock, { color: isOos ? palette.neutral : palette.textSecondary, fontFamily: FontFamily.textRegular }]}>{variant.stock}</Text>
          </View>
          {isOos && <View style={[s.badge, { backgroundColor: palette.critical }]}><Text style={s.badgeText}>Out of Stock</Text></View>}
          {isLow && <View style={[s.badge, { backgroundColor: palette.bgBase }]}><Text style={s.badgeText}>Low in Stock</Text></View>}
        </View>
      </View>
    </Pressable>
  );
}

// ─── Modifier Section ─────────────────────────────────────────────────────────

function ModifierSection({ group, checkValue, radioValue, onToggleCheck, onSelectRadio, palette }: {
  group:         ModifierGroup;
  checkValue:    Set<string>;
  radioValue:    string;
  onToggleCheck: (optId: string) => void;
  onSelectRadio: (optId: string) => void;
  palette:       Palette;
}) {
  const rows: (typeof group.options)[] = [];
  for (let i = 0; i < group.options.length; i += 2) rows.push(group.options.slice(i, i + 2));

  return (
    <View style={[s.modGroup, { borderTopColor: palette.border }]}>
      <View style={s.modGroupHeader}>
        <Text style={[s.modGroupTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>{group.title}</Text>
        <Text style={[s.modGroupHint, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>{'  '}({group.hint})</Text>
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={[s.optionRow, ri === rows.length - 1 && s.optionRowLast]}>
          {row.map(opt => {
            const selected = group.type === 'checkbox' ? checkValue.has(opt.id) : radioValue === opt.id;
            return (
              <TouchableOpacity key={opt.id} style={s.optionItem} activeOpacity={0.7}
                onPress={() => group.type === 'checkbox' ? onToggleCheck(opt.id) : onSelectRadio(opt.id)}>
                {group.type === 'checkbox' ? (
                  <View style={[s.checkbox, { borderColor: palette.contentTertiary }, selected && { backgroundColor: TEAL_LITE, borderColor: TEAL_LITE }]}>
                    {selected && <Icon name="checkmark" size={12} color="#111111" />}
                  </View>
                ) : (
                  <View style={[s.radio, { borderColor: palette.borderDisabled, borderWidth: 1 }, selected && { borderColor: TEAL_LITE, borderWidth: 6, backgroundColor: '#ffffff' }]} />
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
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  scrim:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    width: 600, height: C1_H - 40,
    borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
  },

  // ── Shared dark header ───────────────────────────────────────────────────
  darkHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#111111',
    paddingHorizontal: Spacing[16], height: 76,
  },
  darkHeaderTitle: {
    flex: 1, fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2, color: '#ffffff',
  },
  closeBtn: { width: 36, height: 36, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing[8] },
  backBtn:  { flexDirection: 'row', alignItems: 'center', gap: Spacing[8], flex: 1, paddingRight: Spacing[8] },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing[8], flexShrink: 0 },
  resetLabel: { fontSize: FontSize.bodySM, lineHeight: FontSize.bodySM * 1.5, color: TEAL_LITE },

  // ── List ────────────────────────────────────────────────────────────────
  list: { flex: 1 },

  // ── Variant Row ──────────────────────────────────────────────────────────
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[16], paddingHorizontal: Spacing[20], paddingVertical: Spacing[16], borderBottomWidth: 1, backgroundColor: '#ffffff' },
  thumb: { width: 60, height: 60, borderRadius: Radius.xs, borderWidth: 1, overflow: 'hidden', flexShrink: 0 },
  thumbImg: { width: '100%', height: '100%' },
  rowInfo: { flex: 1, gap: Spacing[8], justifyContent: 'space-between', alignSelf: 'stretch' },
  variantName: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },
  rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemInfo: { flexDirection: 'row', gap: Spacing[24] },
  price: { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.5 },
  stock: { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.5 },
  badge: { paddingHorizontal: Spacing[8], paddingVertical: Spacing[6], borderRadius: Radius.xs },
  badgeText: { fontFamily: FontFamily.textBold, fontSize: FontSize.labelSM, lineHeight: FontSize.labelSM * 1.2, color: '#ffffff', textTransform: 'uppercase' },

  // ── Modifier rows ────────────────────────────────────────────────────────
  modSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing[16], height: 84, borderTopWidth: 1 },
  modSectionLabel: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },
  addLink: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2, color: TEAL },
  appliedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[12] },
  appliedValue: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },
  trashBtn: { padding: Spacing[4] },

  // ── Quantity ─────────────────────────────────────────────────────────────
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  qtyBtn: { width: 44, height: 44, borderRadius: Radius.full, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyValWrap: { width: 60, alignItems: 'center', justifyContent: 'center' },
  qtyVal: { fontSize: FontSize.headingMD, lineHeight: FontSize.headingMD * 1.2, textAlign: 'center' },

  // ── Note ─────────────────────────────────────────────────────────────────
  noteSection: { paddingHorizontal: Spacing[16], paddingVertical: Spacing[20], gap: Spacing[16], borderTopWidth: 1 },
  textAreaWrap: { borderWidth: 1, borderRadius: Radius.sm, backgroundColor: '#ffffff', minHeight: 112, paddingTop: Spacing[6], paddingHorizontal: Spacing[16], paddingBottom: Spacing[8] },
  textArea: { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.5, minHeight: 60, flex: 1 },
  noteFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: Spacing[4] },
  noteCounter: { fontSize: FontSize.bodyXS, lineHeight: FontSize.bodyXS * 1.5 },

  // ── Modifier button bar ───────────────────────────────────────────────────
  buttonBar: { height: 96, paddingHorizontal: Spacing[16], paddingVertical: Spacing[16], borderTopWidth: 1, backgroundColor: '#ffffff' },
  addBtn: { flex: 1, height: 64, backgroundColor: '#111111', borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  addBtnLabel: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2, color: '#ffffff' },

  // ── Modifier groups ───────────────────────────────────────────────────────
  modGroup: { borderTopWidth: 1 },
  modGroupHeader: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', paddingHorizontal: Spacing[16], paddingVertical: Spacing[16] },
  modGroupTitle: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },
  modGroupHint: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },
  optionRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  optionRowLast: { marginBottom: Spacing[8] },
  optionItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[8], paddingHorizontal: Spacing[16], paddingVertical: Spacing[16], width: '50%' },
  checkbox: { width: 20, height: 20, borderRadius: Radius.xs, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 3, flexShrink: 0 },
  radio: { width: 20, height: 20, borderRadius: Radius.full, marginTop: 3, flexShrink: 0 },
  optionLabel: { flex: 1, fontSize: FontSize.bodySM, lineHeight: FontSize.bodySM * 1.5 },

  // ── Discount view ─────────────────────────────────────────────────────────
  discSection: {
    paddingHorizontal: Spacing[16], paddingTop: Spacing[20], paddingBottom: Spacing[16],
    gap: Spacing[16],
  },
  discSectionTitle: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },

  // Preset cards row
  presetRow: { flexDirection: 'row', gap: Spacing[8] },
  presetCard: {
    flex: 1, height: 120, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center', gap: Spacing[8],
  },
  presetCardSelected: { borderWidth: 2, borderColor: TEAL_DARK, borderRadius: Radius.md },
  presetValue: { fontSize: FontSize.headingSM, lineHeight: FontSize.headingSM * 1.2, textAlign: 'center' },
  presetLabel: { fontSize: FontSize.bodySM, lineHeight: FontSize.bodySM * 1.5, textAlign: 'center', paddingHorizontal: Spacing[4] },

  // Tax toggle
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: Radius.md, paddingHorizontal: Spacing[16], paddingVertical: Spacing[16] },
  toggleLabel: { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.5 },
  // Pill sizing only — bg, padding, border are set dynamically per ON/OFF state
  togglePill: { width: 52, height: 32, borderRadius: Radius.full, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' },
  toggleThumb: { width: 20, height: 20, borderRadius: Radius.full },

  // Type selector + input
  discInputRow: { flexDirection: 'row', gap: Spacing[8], alignItems: 'stretch' },
  // Horizontal $ / % toggle — each button owns its own border
  typeSelector: { width: 160, height: 72, flexDirection: 'row' },
  typeBtnLeft: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderTopLeftRadius: Radius.sm, borderBottomLeftRadius: Radius.sm,
    borderWidth: 1,
  },
  typeBtnRight: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderTopRightRadius: Radius.sm, borderBottomRightRadius: Radius.sm,
    borderWidth: 1, borderLeftWidth: 0,
  },
  discInputWrap: { flex: 1, borderWidth: 1, borderRadius: Radius.sm, height: 72, paddingHorizontal: Spacing[16], justifyContent: 'center', gap: 4 },
  discInputFloatLabel: { fontSize: FontSize.bodyXS, lineHeight: FontSize.bodyXS * 1.5 },
  discInput: { fontSize: FontSize.bodyMD, lineHeight: FontSize.bodyMD * 1.5 },

  // Cancel + Confirm button bar
  twoButtonBar: {
    flexDirection: 'row', gap: Spacing[8],
    paddingHorizontal: Spacing[16], paddingVertical: Spacing[16],
    borderTopWidth: 1, backgroundColor: '#ffffff', height: 96,
  },
  cancelBtn: { flex: 1, height: 64, borderRadius: Radius.md, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  cancelBtnLabel: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2 },
  confirmBtn: { flex: 1, height: 64, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  confirmBtnLabel: { fontSize: FontSize.headingXS, lineHeight: FontSize.headingXS * 1.2, color: '#ffffff' },
});
