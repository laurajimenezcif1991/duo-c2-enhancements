/**
 * TouchKeyboard
 *
 * Fully-functional custom on-screen QWERTY keyboard.
 * Matches the Smart Terminal Glass 2.0 keyboard design (Figma 6539:2353).
 *
 * Key design:
 *   Default   — white bg, 5px radius, soft shadow
 *   Pressed   — #ACAEB5 bg (darker gray)
 *   Special   — #AEB4B8 bg (shift, delete, ?123)
 *   OK key    — #00A4A6 teal circle, checkmark
 *   Numbers above letters shown as small hints on QWERTY row 1
 *
 * Modes: QWERTY → lower / upper (shift), ?123 → numbers/symbols
 */

import React, { useState, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../ui/Icon';

// ─── Design tokens ────────────────────────────────────────────────────────────

const KBG           = '#CDD1D5';  // keyboard container background
const KEY_BG        = '#FFFFFF';  // regular key default
const KEY_PRESSED   = '#A8ABB2';  // any key pressed
const SPEC_BG       = '#AEB4B8';  // shift / delete / ?123 keys default
const SPEC_PRESSED  = '#909498';  // special key pressed
const OK_BG         = '#00A4A6';  // OK done key
const OK_PRESSED    = '#008385';  // OK pressed
const HINT_COLOR    = '#72797E';  // number hint above letter
const LABEL_COLOR   = '#363D44';  // main key label

// Expo Google Fonts loaded names
const ROBOTO_REG = 'Roboto_400Regular';
const ROBOTO_MED = 'Roboto_500Medium';

// Key height fixed per Figma
const KH = 72;
const K_RADIUS = 5;

// ─── Key Definitions ──────────────────────────────────────────────────────────

type KType = 'char' | 'shift' | 'delete' | 'ok' | 'space' | 'mode-switch';

interface KDef {
  label: string;
  hint?: string;
  type:  KType;
  val:   string;
  flex?: number;
}

const HINTS = ['1','2','3','4','5','6','7','8','9','0'];

const QWERTY_ROW1: KDef[] = ['q','w','e','r','t','y','u','i','o','p']
  .map((c, i) => ({ label: c, hint: HINTS[i], type: 'char', val: c }));

const QWERTY_ROW2: KDef[] = ['a','s','d','f','g','h','j','k','l']
  .map(c => ({ label: c, type: 'char', val: c }));

const QWERTY_ROW3: KDef[] = [
  { label: '⇧', type: 'shift', val: 'SHIFT', flex: 1.5 },
  ...['z','x','c','v','b','n','m'].map(c => ({ label: c, type: 'char' as KType, val: c })),
  { label: '⌫', type: 'delete', val: 'DELETE', flex: 1.5 },
];

const QWERTY_ROW4: KDef[] = [
  { label: '?123', type: 'mode-switch', val: 'NUM', flex: 1.6 },
  { label: ',',    type: 'char',        val: ',' },
  { label: ' ',    type: 'space',       val: ' ', flex: 4 },
  { label: '.',    type: 'char',        val: '.' },
  { label: '✓',   type: 'ok',          val: 'OK', flex: 1.2 },
];

const NUM_ROW1: KDef[] = ['1','2','3','4','5','6','7','8','9','0']
  .map(c => ({ label: c, type: 'char', val: c }));

const NUM_ROW2: KDef[] = ['-','/',':', ';','(',')',  '$','&','@','"']
  .map(c => ({ label: c, type: 'char', val: c }));

const NUM_ROW3: KDef[] = [
  { label: '#+=', type: 'mode-switch', val: 'SYM', flex: 1.6 },
  ...['.', ',', '?', '!', "'"].map(c => ({ label: c, type: 'char' as KType, val: c })),
  { label: '⌫', type: 'delete', val: 'DELETE', flex: 1.6 },
];

const NUM_ROW4: KDef[] = [
  { label: 'ABC', type: 'mode-switch', val: 'QWERTY', flex: 1.6 },
  { label: ',',   type: 'char',        val: ',' },
  { label: ' ',   type: 'space',       val: ' ',       flex: 4 },
  { label: '.',   type: 'char',        val: '.' },
  { label: '✓',  type: 'ok',          val: 'OK', flex: 1.2 },
];

const SYM_ROW1: KDef[] = ['[',']','{','}','#','%','^','*','+','=']
  .map(c => ({ label: c, type: 'char', val: c }));
const SYM_ROW2: KDef[] = ['_','\\','|','~','<','>','€','£','¥','•']
  .map(c => ({ label: c, type: 'char', val: c }));
const SYM_ROW3: KDef[] = [
  { label: '123', type: 'mode-switch', val: 'NUM', flex: 1.6 },
  ...['.', ',', '?', '!', "'"].map(c => ({ label: c, type: 'char' as KType, val: c })),
  { label: '⌫', type: 'delete', val: 'DELETE', flex: 1.6 },
];
const SYM_ROW4 = NUM_ROW4;

// ─── Props ────────────────────────────────────────────────────────────────────

export type TouchKeyboardProps = {
  value:        string;
  maxLength?:   number;
  onChange:     (v: string) => void;
  /** Called when the ✓ (OK) key is pressed — caller hides the keyboard */
  onDismiss?:   () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

type Mode = 'qwerty' | 'qwerty-upper' | 'num' | 'sym';

export function TouchKeyboard({ value, maxLength, onChange, onDismiss }: TouchKeyboardProps) {
  const [mode, setMode] = useState<Mode>('qwerty');

  const handleKey = useCallback((key: KDef) => {
    if (key.type === 'delete') {
      onChange(value.slice(0, -1));
      return;
    }
    if (key.type === 'ok') {
      // Hide keyboard so user can review text and tap Confirm or Cancel
      onDismiss?.();
      return;
    }
    if (key.type === 'shift') {
      setMode(m => m === 'qwerty-upper' ? 'qwerty' : 'qwerty-upper');
      return;
    }
    if (key.type === 'mode-switch') {
      if (key.val === 'NUM')    { setMode('num');   return; }
      if (key.val === 'QWERTY') { setMode('qwerty'); return; }
      if (key.val === 'SYM')    { setMode('sym');   return; }
    }
    if (maxLength && value.length >= maxLength) return;
    const char = (mode === 'qwerty-upper' && key.type === 'char') ? key.val.toUpperCase() : key.val;
    onChange(value + char);
    // Auto-revert to lower after a single capital
    if (mode === 'qwerty-upper') setMode('qwerty');
  }, [value, maxLength, mode, onChange, onDismiss]);

  // Pick rows based on mode
  let rows: KDef[][];
  if (mode === 'qwerty' || mode === 'qwerty-upper') {
    rows = [QWERTY_ROW1, QWERTY_ROW2, QWERTY_ROW3, QWERTY_ROW4];
  } else if (mode === 'num') {
    rows = [NUM_ROW1, NUM_ROW2, NUM_ROW3, NUM_ROW4];
  } else {
    rows = [SYM_ROW1, SYM_ROW2, SYM_ROW3, SYM_ROW4];
  }

  const isUpper = mode === 'qwerty-upper';

  return (
    <View style={s.keyboard}>
      {rows.map((row, ri) => (
        <View key={ri} style={s.row}>
          {row.map((key, ki) => (
            <KeyButton
              key={ki}
              keyDef={key}
              upper={isUpper}
              onPress={() => handleKey(key)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── Key Button ──────────────────────────────────────────────────────────────

function KeyButton({ keyDef, upper, onPress }: { keyDef: KDef; upper: boolean; onPress: () => void }) {
  const isSpecial = keyDef.type === 'shift' || keyDef.type === 'delete' || keyDef.type === 'mode-switch';
  const isOK      = keyDef.type === 'ok';
  const isSpace   = keyDef.type === 'space';
  const displayLabel = (upper && keyDef.type === 'char')
    ? keyDef.label.toUpperCase()
    : keyDef.label;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.key,
        keyDef.flex ? { flex: keyDef.flex } : { flex: 1 },
        isOK && s.keyOK,
        isSpecial && s.keySpecial,
        pressed && (isOK ? s.keyOKPressed : isSpecial ? s.keySpecialPressed : s.keyPressed),
      ]}
    >
      {({ pressed }) => (
        <>
          {/* Number hint (only on QWERTY row 1 letter keys) */}
          {keyDef.hint && (
            <Text style={s.hint}>{keyDef.hint}</Text>
          )}

          {/* Delete key icon */}
          {keyDef.type === 'delete' && (
            <Icon name="delete" size={22} color={pressed ? '#fff' : LABEL_COLOR} />
          )}

          {/* OK key checkmark */}
          {isOK && (
            <Icon name="checkmark" size={24} color="#ffffff" />
          )}

          {/* Space / normal label */}
          {keyDef.type !== 'delete' && !isOK && (
            <Text style={[
              s.label,
              isSpecial && s.labelSpecial,
              isSpace   && s.labelSpace,
            ]}>
              {isSpace ? '' : displayLabel}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  keyboard: {
    backgroundColor:  KBG,
    paddingHorizontal: 4,
    paddingTop:        8,
    paddingBottom:     10,
    gap:               6,
  },
  row: {
    flexDirection: 'row',
    gap:           5,
    justifyContent: 'center',
  },

  // Base key
  key: {
    height:          KH,
    backgroundColor: KEY_BG,
    borderRadius:    K_RADIUS,
    alignItems:      'center',
    justifyContent:  'center',
    // iOS-style shadow
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.18,
    shadowRadius:    1,
    elevation:       2,
    minWidth:        30,
  },
  keyPressed:        { backgroundColor: KEY_PRESSED },
  keySpecial:        { backgroundColor: SPEC_BG },
  keySpecialPressed: { backgroundColor: SPEC_PRESSED },
  keyOK: {
    backgroundColor: OK_BG,
    borderRadius:    KH / 2,
    width:           KH,
    flex:            undefined,
    aspectRatio:     1,
  },
  keyOKPressed: { backgroundColor: OK_PRESSED },

  // Labels
  label: {
    fontFamily: ROBOTO_REG,
    fontSize:   22,
    color:      LABEL_COLOR,
    textAlign:  'center',
    lineHeight: 26,
  },
  labelSpecial: {
    fontSize:   16,
    fontFamily: ROBOTO_MED,
    color:      '#2D333A',
  },
  labelSpace: {
    fontSize: 14,
  },
  hint: {
    position:   'absolute',
    top:        6,
    right:      8,
    fontSize:   12,
    fontFamily: ROBOTO_REG,
    color:      HINT_COLOR,
    lineHeight: 14,
  },
});
