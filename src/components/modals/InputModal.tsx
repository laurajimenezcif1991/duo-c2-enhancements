/**
 * InputModal
 *
 * Full-screen overlay used for "Add Customer Name" and "Add Note" in Order Details.
 *
 * Layout (Figma 6653:152481 / 6653:153255):
 *   ┌── Dimmed scrim ───────────────────────────────────────────────────────┐
 *   │ (tappable area above the card to cancel)                              │
 *   ├── White card ─────────────────────────────────────────────────────────┤
 *   │ ┌─────────────────────────────────────────────────────────────────┐   │
 *   │ │ {label}                                              (secondary) │   │
 *   │ │ typed text here|                                                 │   │
 *   │ │                                              {count}/{maxLength} │   │
 *   │ └─────────────────────────────────────────────────────────────────┘   │
 *   │  [  Cancel  ]   [  Confirm  ]                                         │
 *   ├── Custom keyboard ────────────────────────────────────────────────────┤
 *   │  Q W E R T Y U I O P                                                  │
 *   │   A S D F G H J K L                                                   │
 *   │  ⇧ Z X C V B N M ⌫                                                    │
 *   │  ?123  ,  [       space      ]  .  ✓                                  │
 *   └───────────────────────────────────────────────────────────────────────┘
 *
 * No native TextInput is used — all text is driven by the TouchKeyboard
 * so no OS keyboard appears.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorTokens }          from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';
import { Radius, Spacing }      from '../../theme/spacing';
import { TouchKeyboard }        from './TouchKeyboard';

// ─── Props ────────────────────────────────────────────────────────────────────

export type InputModalProps = {
  visible:       boolean;
  label:         string;       // "Customer Name" or "Note"
  maxLength:     number;       // 64 for name, 200 for note
  initialValue?: string;
  onConfirm:     (value: string) => void;
  onCancel:      () => void;
  dark?:         boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function InputModal({
  visible,
  label,
  maxLength,
  initialValue = '',
  onConfirm,
  onCancel,
  dark = false,
}: InputModalProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;
  const [text,          setText]          = useState(initialValue);
  const [keyboardShown, setKeyboardShown] = useState(true);

  // Cursor blink (only when keyboard is hidden — shows user can still edit)
  const cursorAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(cursorAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.delay(500),
        Animated.timing(cursorAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [cursorAnim]);

  // Keyboard slide animation
  const kbSlideY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(kbSlideY, {
      toValue:         keyboardShown ? 0 : 400,
      useNativeDriver: true,
      damping:         28,
      stiffness:       260,
      mass:            0.9,
    }).start();
  }, [keyboardShown, kbSlideY]);

  // Sheet slide-up when modal opens
  const slideY = useRef(new Animated.Value(800)).current;
  useEffect(() => {
    Animated.spring(slideY, {
      toValue:         visible ? 0 : 800,
      useNativeDriver: true,
      damping:         28,
      stiffness:       260,
      mass:            0.9,
    }).start();
    if (visible) {
      setText(initialValue);
      setKeyboardShown(true);
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  const canConfirm = text.trim().length > 0;

  return (
    <View style={s.overlay} pointerEvents="box-none">
      {/* Dim scrim — tap to cancel */}
      <Pressable style={s.scrim} onPress={onCancel} />

      {/* Bottom sheet: card + keyboard */}
      <Animated.View style={[s.sheet, { transform: [{ translateY: slideY }] }]}>

        {/* ── White card ────────────────────────────────────────────────── */}
        <View style={[s.card, {
          backgroundColor: palette.bgSurface,
          shadowColor:     '#1A2024',
          shadowOffset:    { width: 0, height: 4 },
          shadowOpacity:   0.18,
          shadowRadius:    8,
          elevation:       8,
        }]}>
          {/* Text area — tap to re-show keyboard */}
          <Pressable
            style={[s.textArea, { borderColor: keyboardShown ? palette.bgBase : palette.neutral }]}
            onPress={() => setKeyboardShown(true)}
          >
            {/* Label */}
            <Text style={[s.fieldLabel, { color: palette.textSecondary, fontFamily: FontFamily.textRegular }]}>
              {label}
            </Text>
            {/* Display text + cursor — cursor nested inline so it never jumps to its own line */}
            <Text style={[s.textDisplay, { color: palette.textPrimary, fontFamily: FontFamily.textRegular }]}>
              {text}
              <Animated.Text style={[s.cursor, { opacity: cursorAnim, color: palette.textPrimary }]}>
                {'|'}
              </Animated.Text>
            </Text>
            {/* Character count */}
            <View style={s.charCountRow}>
              <Text style={[s.charCount, { color: palette.neutral, fontFamily: FontFamily.textRegular }]}>
                {`${text.length}/${maxLength}`}
              </Text>
            </View>
          </Pressable>

          {/* Cancel / Confirm buttons */}
          <View style={s.btnRow}>
            <TouchableOpacity
              onPress={onCancel}
              style={[s.btn, s.btnCancel, { borderColor: palette.contentTertiary }]}
              activeOpacity={0.75}
            >
              <Text style={[s.btnLabel, { color: palette.textPrimary, fontFamily: FontFamily.textMedium }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={canConfirm ? () => onConfirm(text.trim()) : undefined}
              style={[s.btn, s.btnConfirm, { backgroundColor: canConfirm ? palette.bgBase : palette.neutral }]}
              activeOpacity={canConfirm ? 0.85 : 1}
            >
              <Text style={[s.btnLabel, { color: '#ffffff', fontFamily: FontFamily.textMedium }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Custom keyboard — slides down when ✓ is pressed ─────────── */}
        <Animated.View style={{ transform: [{ translateY: kbSlideY }], overflow: 'hidden' }}>
          <TouchKeyboard
            value={text}
            maxLength={maxLength}
            onChange={setText}
            onDismiss={() => setKeyboardShown(false)}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,17,17,0.50)',
  },
  sheet: {
    paddingBottom: Spacing[16],
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    marginHorizontal: Spacing[16],
    marginBottom:     Spacing[8],
    borderRadius:     Radius.md,
    padding:          Spacing[24],
    gap:              Spacing[24],
  },

  // Text area (bordered box)
  textArea: {
    borderWidth:      1,
    borderRadius:     Radius.sm,
    paddingHorizontal: Spacing[16],
    paddingTop:       Spacing[6],
    paddingBottom:    Spacing[10],
    minHeight:        112,
    justifyContent:   'space-between',
    gap:              4,
  },
  fieldLabel: {
    fontSize:   FontSize.bodySM,
    lineHeight: FontSize.bodySM * 1.5,
  },
  textDisplay: {
    fontSize:   FontSize.bodyMD,
    lineHeight: FontSize.bodyMD * 1.5,
  },
  cursor: {
    fontSize:   FontSize.bodyMD,
    lineHeight: FontSize.bodyMD * 1.5,
    marginLeft: 1,
  },
  charCountRow: {
    alignItems: 'flex-end',
    marginTop:  Spacing[4],
  },
  charCount: {
    fontSize:   FontSize.bodyXS,
    lineHeight: FontSize.bodyXS * 1.5,
  },

  // Buttons
  btnRow: {
    flexDirection: 'row',
    gap:           Spacing[24],
  },
  btn: {
    flex:           1,
    height:         64,
    borderRadius:   Radius.md,
    alignItems:     'center',
    justifyContent: 'center',
  },
  btnCancel: {
    borderWidth: 2,
  },
  btnConfirm: {},
  btnLabel: {
    fontSize:   FontSize.headingXS,
    lineHeight: FontSize.headingXS * 1.2,
  },
});
