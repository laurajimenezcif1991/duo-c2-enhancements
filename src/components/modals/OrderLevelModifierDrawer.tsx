/**
 * OrderLevelModifierDrawer
 *
 * Bottom-sheet drawer for applying an order-level Discount or Fee.
 * Reuses the same visual pattern as the item-level discount/fee view in
 * ItemDetailDrawer, but with order-specific presets and layout.
 *
 * Figma: 6555:159041 (Discount) · 6557:161707 (Fee)
 *
 * Layout:
 *   ─ Dark header: title + Reset
 *   ─ Scrollable body:
 *       "Apply to All"             — 2 rows of 3 preset cards
 *       "Category & Product Level" — 1 row of 3 preset cards
 *       "Custom"                   — Tax toggle + $/% selector + amount input
 *   ─ Footer: Cancel | Confirm
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorTokens }           from '../../theme/colors';
import { FontFamily, FontSize }  from '../../theme/typography';
import { Radius, Spacing }       from '../../theme/spacing';
import { Icon }                  from '../ui/Icon';
import type { CartAppliedModifier } from '../../types/cart';

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAL       = '#00A4A6';
const TEAL_DARK  = '#09757A';
const SHEET_H    = 920;

// ─── Presets ──────────────────────────────────────────────────────────────────

type Preset = { id: string; value: string; label: string };

const DISCOUNT_ALL: Preset[] = [
  { id: 'd-flat-rate',    value: '10%', label: 'Flat Rate'     },
  { id: 'd-big',          value: '15%', label: 'Big Discount'  },
  { id: 'd-seasonal',     value: '7%',  label: 'Seasonal'      },
  { id: 'd-all-time',     value: '7%',  label: 'All Time'      },
  { id: 'd-flatrate2',    value: '10%', label: 'Flatrate'      },
  { id: 'd-summer',       value: '15%', label: 'Summer'        },
];
const DISCOUNT_CAT: Preset[] = [
  { id: 'd-local',        value: '10%', label: 'Local Discount' },
  { id: 'd-godaddy',      value: '15%', label: 'GoDaddy'       },
  { id: 'd-all-time-2',   value: '7%',  label: 'ALL TIME'      },
];

const FEE_ALL: Preset[] = [
  { id: 'f-small',        value: '5%',  label: 'Small Fee'     },
  { id: 'f-flat',         value: '10%', label: 'Flat Fee'      },
  { id: 'f-service',      value: '3%',  label: 'Service Fee'   },
  { id: 'f-processing',   value: '2%',  label: 'Processing'    },
  { id: 'f-handling',     value: '5%',  label: 'Handling'      },
  { id: 'f-delivery',     value: '8%',  label: 'Delivery'      },
];
const FEE_CAT: Preset[] = [
  { id: 'f-local',        value: '10%', label: 'Local Fee'     },
  { id: 'f-vip',          value: '5%',  label: 'VIP Fee'       },
  { id: 'f-event',        value: '15%', label: 'Event Fee'     },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export type OrderLevelModifierDrawerProps = {
  visible:     boolean;
  mode:        'discount' | 'fee';
  /** Currently applied value (pre-populate if editing) */
  initial?:    CartAppliedModifier | null;
  onConfirm:   (mod: CartAppliedModifier) => void;
  onClose:     () => void;
  dark?:       boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function OrderLevelModifierDrawer({
  visible,
  mode,
  initial = null,
  onConfirm,
  onClose,
  dark = false,
}: OrderLevelModifierDrawerProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  const isDiscount = mode === 'discount';
  const title      = isDiscount ? 'Discount' : 'Fee';
  const allPresets = isDiscount ? DISCOUNT_ALL : FEE_ALL;
  const catPresets = isDiscount ? DISCOUNT_CAT : FEE_CAT;
  const taxLabel   = isDiscount ? 'Tax after discount' : 'Tax after fee';

  // ── Local state ────────────────────────────────────────────────────────────
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [taxToggle,    setTaxToggle]     = useState(true);
  const [amountType,   setAmountType]    = useState<'$' | '%'>('%');
  const [amountText,   setAmountText]    = useState('');

  // Reset to initial when opened
  useEffect(() => {
    if (!visible) return;
    setSelectedId(null);
    setAmountText('');
    setAmountType('%');
    setTaxToggle(true);
  }, [visible]);

  // Slide-up animation
  const slideY = useRef(new Animated.Value(SHEET_H)).current;
  useEffect(() => {
    Animated.spring(slideY, {
      toValue:         visible ? 0 : SHEET_H,
      useNativeDriver: true,
      damping:         28,
      stiffness:       260,
      mass:            0.9,
    }).start();
  }, [visible, slideY]);

  if (!visible) return null;

  const hasCustomAmount = amountText.trim().length > 0 && amountText !== '0';
  const canConfirm      = selectedId !== null || hasCustomAmount;

  const handleConfirm = () => {
    if (!canConfirm) return;

    let label: string;
    let value: string;

    if (selectedId) {
      const preset = [...allPresets, ...catPresets].find(p => p.id === selectedId)!;
      const taxSuffix = taxToggle ? ' (Post Tax)' : ' (Pre Tax)';
      label = `${preset.label} ${preset.value}${taxSuffix}`;
      value = preset.value;
    } else {
      const taxSuffix = taxToggle ? ' (Post Tax)' : ' (Pre Tax)';
      label = `Custom ${amountText}${amountType}${taxSuffix}`;
      value = `${amountText}${amountType}`;
    }

    onConfirm({ label, value });
  };

  const handleReset = () => {
    setSelectedId(null);
    setAmountText('');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={s.overlay} pointerEvents="box-none">
      <Pressable style={s.scrim} onPress={onClose} />

      <Animated.View
        style={[s.sheet, { transform: [{ translateY: slideY }] }]}
      >
        {/* ── Dark header ───────────────────────────────────────────────── */}
        <View style={s.header}>
          <TouchableOpacity onPress={onClose} style={s.headerClose} activeOpacity={0.7}>
            <Icon name="chevron-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { fontFamily: FontFamily.textMedium }]}>{title}</Text>
          <TouchableOpacity onPress={handleReset} style={s.headerReset} activeOpacity={0.7}>
            <Icon name="refresh" size={20} color={palette.textSecondary} />
            <Text style={[s.headerResetLabel, { color: palette.textSecondary, fontFamily: FontFamily.textMedium }]}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Scrollable body ───────────────────────────────────────────── */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section: Apply to All */}
          <SectionBlock title="Apply to All">
            <PresetGrid
              presets={allPresets}
              selectedId={selectedId}
              onSelect={id => { setSelectedId(id); setAmountText(''); }}
            />
          </SectionBlock>

          <View style={[s.divider, { backgroundColor: palette.border }]} />

          {/* Section: Category and Product Level */}
          <SectionBlock title="Category and Product Level">
            <PresetGrid
              presets={catPresets}
              selectedId={selectedId}
              onSelect={id => { setSelectedId(id); setAmountText(''); }}
            />
          </SectionBlock>

          <View style={[s.divider, { backgroundColor: palette.border }]} />

          {/* Section: Custom */}
          <SectionBlock title="Custom">
            {/* Tax toggle */}
            <View style={[s.toggleRow, { backgroundColor: palette.bgLight }]}>
              <Text style={[s.toggleLabel, { color: palette.textPrimary, fontFamily: FontFamily.textRegular }]}>
                {taxLabel}
              </Text>
              <Switch
                value={taxToggle}
                onValueChange={setTaxToggle}
                trackColor={{ false: '#E5E5E5', true: '#61EDEA' }}
                thumbColor={'#ffffff'}
              />
            </View>

            {/* $/% selector + input */}
            <View style={s.inputRow}>
              {/* $ / % toggle */}
              <View style={s.typeSelector}>
                <TouchableOpacity
                  onPress={() => setAmountType('$')}
                  style={[
                    s.typeBtnLeft,
                    amountType === '$'
                      ? { backgroundColor: TEAL_DARK }
                      : { backgroundColor: '#ffffff', borderColor: palette.contentTertiary, borderWidth: 1 },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    s.typeBtnText,
                    { color: amountType === '$' ? '#ffffff' : palette.textPrimary, fontFamily: FontFamily.textMedium },
                  ]}>$</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAmountType('%')}
                  style={[
                    s.typeBtnRight,
                    amountType === '%'
                      ? { backgroundColor: TEAL_DARK }
                      : { backgroundColor: '#ffffff', borderColor: palette.contentTertiary, borderWidth: 1 },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    s.typeBtnText,
                    { color: amountType === '%' ? '#ffffff' : palette.textPrimary, fontFamily: FontFamily.textMedium },
                  ]}>%</Text>
                </TouchableOpacity>
              </View>

              {/* Amount input */}
              <TextInput
                style={[s.input, {
                  borderColor:        palette.contentTertiary,
                  color:              palette.textPrimary,
                  fontFamily:         FontFamily.textRegular,
                  backgroundColor:    '#ffffff',
                }]}
                placeholder="Enter amount"
                placeholderTextColor={palette.textSecondary}
                keyboardType="decimal-pad"
                value={amountText}
                onChangeText={t => { setAmountText(t); setSelectedId(null); }}
              />
            </View>
          </SectionBlock>
        </ScrollView>

        {/* ── Footer buttons ────────────────────────────────────────────── */}
        <View style={[s.footer, { borderTopColor: palette.border }]}>
          <TouchableOpacity
            onPress={onClose}
            style={[s.btn, s.btnCancel, { borderColor: palette.contentTertiary }]}
            activeOpacity={0.75}
          >
            <Text style={[s.btnLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={canConfirm ? handleConfirm : undefined}
            style={[s.btn, { backgroundColor: canConfirm ? '#111111' : palette.neutral }]}
            activeOpacity={canConfirm ? 0.85 : 1}
          >
            <Text style={[s.btnLabel, { color: '#ffffff', fontFamily: FontFamily.textMedium }]}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={[s.sectionTitle, { fontFamily: FontFamily.textMedium }]}>{title}</Text>
      {children}
    </View>
  );
}

function PresetGrid({ presets, selectedId, onSelect }: {
  presets:    Preset[];
  selectedId: string | null;
  onSelect:   (id: string) => void;
}) {
  const rows: Preset[][] = [];
  for (let i = 0; i < presets.length; i += 3) rows.push(presets.slice(i, i + 3));
  return (
    <View style={s.grid}>
      {rows.map((row, ri) => (
        <View key={ri} style={s.gridRow}>
          {row.map(preset => {
            const selected = selectedId === preset.id;
            return (
              <Pressable
                key={preset.id}
                onPress={() => onSelect(preset.id)}
                style={({ pressed }) => [
                  s.presetCard,
                  selected
                    ? { backgroundColor: TEAL }
                    : pressed
                      ? { backgroundColor: '#B2DFDF' }
                      : { backgroundColor: '#D8EFEF' },
                ]}
              >
                <Text style={[s.presetValue, {
                  fontFamily: FontFamily.textMedium,
                  color: selected ? '#ffffff' : '#111111',
                }]}>
                  {preset.value}
                </Text>
                <Text style={[s.presetLabel, {
                  fontFamily: FontFamily.textRegular,
                  color: selected ? '#ffffff' : '#111111',
                }]}>
                  {preset.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex:         300,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,17,17,0.5)',
  },
  sheet: {
    height:               SHEET_H,
    backgroundColor:      '#ffffff',
    borderTopLeftRadius:  16,
    borderTopRightRadius: 16,
    overflow:             'hidden',
  },

  // Header
  header: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    backgroundColor:  '#111111',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[20],
  },
  headerClose: { padding: Spacing[4] },
  headerTitle: {
    color:    '#ffffff',
    fontSize: FontSize.headingXS,
    flex:     1,
    textAlign:'center',
  },
  headerReset: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[4],
  },
  headerResetLabel: {
    fontSize: FontSize.headingXS,
  },

  // Body
  bodyContent: {
    paddingBottom: Spacing[16],
  },
  section: {
    paddingHorizontal: Spacing[16],
    paddingTop:        Spacing[16],
    gap:               Spacing[16],
  },
  sectionTitle: {
    fontSize: FontSize.headingXS,
    color:    '#111111',
  },
  divider: {
    height:           1,
    marginHorizontal: Spacing[16],
    marginTop:        Spacing[16],
  },

  // Preset grid
  grid:    { gap: Spacing[8] },
  gridRow: { flexDirection: 'row', gap: Spacing[8] },
  presetCard: {
    flex:           1,
    height:         120,
    borderRadius:   Radius.md,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            Spacing[8],
    paddingHorizontal: Spacing[4],
  },
  presetValue: { fontSize: FontSize.headingSM, textAlign: 'center' },
  presetLabel: { fontSize: FontSize.bodySM,    textAlign: 'center' },

  // Custom section
  toggleRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[16],
    borderRadius:      Radius.md,
  },
  toggleLabel: { fontSize: FontSize.bodyMD },
  inputRow: {
    flexDirection: 'row',
    gap:           Spacing[12],
    alignItems:    'stretch',
  },
  typeSelector: {
    flexDirection: 'row',
    borderRadius:  Radius.sm,
    overflow:      'hidden',
    height:        72,
  },
  typeBtnLeft: {
    width:          72,
    alignItems:     'center',
    justifyContent: 'center',
    borderTopLeftRadius:    Radius.sm,
    borderBottomLeftRadius: Radius.sm,
  },
  typeBtnRight: {
    width:          72,
    alignItems:     'center',
    justifyContent: 'center',
    borderTopRightRadius:    Radius.sm,
    borderBottomRightRadius: Radius.sm,
  },
  typeBtnText: { fontSize: FontSize.headingXS },
  input: {
    flex:         1,
    height:       72,
    borderWidth:  1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing[16],
    fontSize:     FontSize.bodyMD,
  },

  // Footer
  footer: {
    flexDirection:  'row',
    gap:            Spacing[16],
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[16],
    borderTopWidth: 1,
  },
  btn: {
    flex:           1,
    height:         64,
    borderRadius:   Radius.md,
    alignItems:     'center',
    justifyContent: 'center',
  },
  btnCancel: { borderWidth: 2, backgroundColor: 'transparent' },
  btnLabel:  { fontSize: FontSize.headingXS },
});
