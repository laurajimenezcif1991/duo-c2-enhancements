/**
 * ItemModifierDrawer — Item Modifier / Detail Bottom Drawer (Level 2)
 *
 * Opens when the merchant taps a specific variant row in the ItemDetailDrawer.
 * Sits on top of the variant list using the same spring slide-up pattern.
 *
 * Figma: Register-App-2025 · node 6539:116905 → "Register Drawer Patterns"
 *
 * Layout (top → bottom):
 *   Top bar (76px)  — ← Back  |  ↺ Reset Modifier
 *   ScrollView body
 *     · Modifier groups  (checkbox / radio)
 *     · Select Quantity  (− n +)
 *     · Discount         (+ Add  — placeholder, next iteration)
 *     · Fee              (+ Add  — placeholder, next iteration)
 *     · Note             (TextArea, max 200 chars)
 *   Button bar (96px) — "Add to order"
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
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

const C1_H    = 960;
const SHEET_H = C1_H;
const TEAL    = '#00A4A6';
const NOTE_MAX = 200;

// ─── Props ────────────────────────────────────────────────────────────────────

export type ItemModifierDrawerProps = {
  visible:          boolean;
  variant:          ProductVariant | null;
  product:          VariantProduct | null;
  onBack:           () => void;
  onAddToOrder:     (variant: ProductVariant, qty: number, note: string) => void;
  dark?:            boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ItemModifierDrawer({
  visible,
  variant,
  product,
  onBack,
  onAddToOrder,
  dark = false,
}: ItemModifierDrawerProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  // ── Animation ─────────────────────────────────────────────────────────────
  const slideY   = useRef(new Animated.Value(SHEET_H)).current;
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
        toValue: SHEET_H, useNativeDriver: true,
        damping: 28, stiffness: 280, mass: 0.8,
      }).start(() => scrimRef.setValue(0));
    }
  }, [visible, slideY, scrimRef]);

  // ── Form state ────────────────────────────────────────────────────────────
  const [checkSelections, setCheckSelections] = useState<Record<string, Set<string>>>({});
  const [radioSelections, setRadioSelections] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote]         = useState('');

  // Reset form when a new variant is loaded
  useEffect(() => {
    if (visible) {
      setCheckSelections({});
      setRadioSelections({});
      setQuantity(1);
      setNote('');
    }
  }, [variant?.id, visible]);

  const handleReset = () => {
    setCheckSelections({});
    setRadioSelections({});
    setQuantity(1);
    setNote('');
  };

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

  const handleAddToOrder = () => {
    if (!variant) return;
    onAddToOrder(variant, quantity, note.trim());
  };

  const titleText = variant
    ? `${product?.name} (${variant.color}, ${variant.size})`
    : '';

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[s.overlay, { opacity: scrimRef }]}
    >
      <Pressable style={s.scrim} onPress={onBack} />

      <Animated.View
        style={[s.sheet, { backgroundColor: palette.bgSurface }, { transform: [{ translateY: slideY }] }]}
      >
        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <View style={[s.topBar, { borderBottomColor: palette.border }]}>
          <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.7}>
            <Icon name="chevron-left" size={24} color={palette.textPrimary} />
            <Text style={[s.topBarTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]} numberOfLines={1}>
              {titleText}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleReset} style={s.resetBtn} activeOpacity={0.7}>
            <Icon name="refresh" size={22} color={TEAL} />
            <Text style={[s.resetLabel, { fontFamily: FontFamily.textMedium }]}>
              Reset Modifier
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Scrollable body ──────────────────────────────────────────────── */}
        <ScrollView
          style={s.scroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
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
          <View style={[s.section, { borderTopColor: palette.border }]}>
            <Text style={[s.sectionLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
              Select Quantity
            </Text>
            <View style={s.quantityRow}>
              <TouchableOpacity
                onPress={() => setQuantity(q => Math.max(1, q - 1))}
                style={[s.qtyBtn, s.qtyBtnMinus, { borderColor: palette.neutral }]}
                activeOpacity={0.7}
              >
                <Icon name="minus" size={20} color={palette.textPrimary} />
              </TouchableOpacity>
              <View style={s.qtyValueWrap}>
                <Text style={[s.qtyValue, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
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
          <View style={[s.section, { borderTopColor: palette.border }]}>
            <Text style={[s.sectionLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
              Discount
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[s.addLink, { fontFamily: FontFamily.textMedium }]}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {/* Fee */}
          <View style={[s.section, { borderTopColor: palette.border }]}>
            <Text style={[s.sectionLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
              Fee
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[s.addLink, { fontFamily: FontFamily.textMedium }]}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {/* Note */}
          <View style={[s.noteSection, { borderTopColor: palette.border }]}>
            <Text style={[s.sectionLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
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

          {/* Bottom breathing room */}
          <View style={{ height: Spacing[16] }} />
        </ScrollView>

        {/* ── Button bar ───────────────────────────────────────────────────── */}
        <View style={[s.buttonBar, { borderTopColor: palette.border }]}>
          <TouchableOpacity
            onPress={handleAddToOrder}
            style={s.addBtn}
            activeOpacity={0.85}
          >
            <Text style={[s.addBtnLabel, { fontFamily: FontFamily.textMedium }]}>
              Add to order
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Modifier Section ─────────────────────────────────────────────────────────

type Palette = typeof ColorTokens.light | typeof ColorTokens.dark;

type ModifierSectionProps = {
  group:          ModifierGroup;
  checkValue:     Set<string>;
  radioValue:     string;
  onToggleCheck:  (optId: string) => void;
  onSelectRadio:  (optId: string) => void;
  palette:        Palette;
};

function ModifierSection({ group, checkValue, radioValue, onToggleCheck, onSelectRadio, palette }: ModifierSectionProps) {
  // Render options in pairs (2 columns) + any overflow on its own row
  const options = group.options;
  const rows: typeof options[] = [];
  for (let i = 0; i < options.length; i += 2) {
    rows.push(options.slice(i, i + 2));
  }

  return (
    <View style={[s.modifierGroup, { borderTopColor: palette.border }]}>
      {/* Section header */}
      <View style={s.modifierHeader}>
        <Text style={[s.modifierTitle, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
          {group.title}
        </Text>
        <Text style={[s.modifierHint, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
          {'  '}({group.hint})
        </Text>
      </View>

      {/* Options rows */}
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
                {/* Input control */}
                {group.type === 'checkbox' ? (
                  <View style={[s.checkbox, { borderColor: palette.contentTertiary }, selected && { backgroundColor: palette.bgBase, borderColor: palette.bgBase }]}>
                    {selected && <Icon name="checkmark" size={12} color="#ffffff" />}
                  </View>
                ) : (
                  <View style={[s.radio, { borderColor: palette.borderDisabled }, selected && { borderColor: palette.bgBase, borderWidth: 6 }]} />
                )}
                {/* Label */}
                <Text style={[s.optionLabel, { fontFamily: FontFamily.textRegular }]} numberOfLines={2}>
                  <Text style={{ color: palette.textPrimary }}>{opt.label} </Text>
                  <Text style={{ color: palette.textSecondary }}>{opt.price}</Text>
                </Text>
              </TouchableOpacity>
            );
          })}
          {/* Fill empty cell if odd number */}
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

  // ── Top bar ─────────────────────────────────────────────────────────────────
  topBar: {
    height:            76,
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[16],
    borderBottomWidth: 1,
  },
  backBtn: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            Spacing[8],
    flex:           1,
    paddingRight:   Spacing[8],
  },
  topBarTitle: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
    flex:       1,
  },
  resetBtn: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            Spacing[8],
    flexShrink:     0,
  },
  resetLabel: {
    fontSize:   FontSize.bodySM,
    lineHeight: FontSize.bodySM * 1.5,
    color:      TEAL,
  },

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },

  // ── Generic section row ──────────────────────────────────────────────────────
  section: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[20],
    borderTopWidth:    1,
  },
  sectionLabel: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
  },
  addLink: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
    color:      TEAL,
  },

  // ── Quantity ─────────────────────────────────────────────────────────────────
  quantityRow: {
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
  qtyBtnMinus: {},
  qtyValueWrap: {
    width:          60,
    alignItems:     'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize:   FontSize.headingMD,
    lineHeight: FontSize.headingMD * 1.2,
    textAlign:  'center',
  },

  // ── Note ─────────────────────────────────────────────────────────────────────
  noteSection: {
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[20],
    gap:               Spacing[16],
    borderTopWidth:    1,
  },
  textAreaWrap: {
    borderWidth:    1,
    borderRadius:   Radius.sm,
    backgroundColor: '#ffffff',
    minHeight:      112,
    paddingTop:     Spacing[6],
    paddingHorizontal: Spacing[16],
    paddingBottom:  Spacing[10],
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

  // ── Button bar ───────────────────────────────────────────────────────────────
  buttonBar: {
    height:            96,
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[16],
    borderTopWidth:    1,
  },
  addBtn: {
    flex:           1,
    height:         64,
    backgroundColor: '#111111',
    borderRadius:   Radius.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },
  addBtnLabel: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
    color:      '#ffffff',
  },

  // ── Modifier group ───────────────────────────────────────────────────────────
  modifierGroup: {
    borderTopWidth: 1,
  },
  modifierHeader: {
    flexDirection:     'row',
    alignItems:        'center',
    flexWrap:          'wrap',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[16],
  },
  modifierTitle: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
  },
  modifierHint: {
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
