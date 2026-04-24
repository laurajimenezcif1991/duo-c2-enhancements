/**
 * Chip — Smart Terminal Glass 2.0
 *
 * Figma: Smart-Terminal-Glass-2.0 · node 3402:1957
 *
 * Spec:
 *   paddingHorizontal : 12 px
 *   paddingVertical   : 16 px
 *   borderRadius      : full (pill)
 *   overflow          : hidden
 *
 *   Active   → background neutralSubdued (rgba(175,175,175,0.20))
 *              font heading/XS : textMedium · 20 px · lineHeight 1.2
 *   Inactive → background transparent
 *              font body/MD    : textRegular · 20 px · lineHeight 1.5
 *
 *   Text color is always textPrimary regardless of active state.
 *   Optional `icon` name renders a 24 px leading icon (Icon component).
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ColorTokens } from '../../theme/colors';
import { FontFamily, FontSize, LineHeight } from '../../theme/typography';
import { Radius, Spacing } from '../../theme/spacing';
import { Icon, type IconName } from './Icon';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChipProps = {
  label:    string;
  active?:  boolean;
  /** Optional leading icon name from the shared Icon library */
  icon?:    IconName;
  onPress?: () => void;
  dark?:    boolean;
  style?:   ViewStyle;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Chip({
  label,
  active = false,
  icon,
  onPress,
  dark    = false,
  style,
}: ChipProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        s.chip,
        active && { backgroundColor: palette.bgLight },
        style,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          size={24}
          color={palette.textPrimary}
          style={s.icon}
        />
      )}
      <Text
        style={[
          s.label,
          {
            color:      palette.textPrimary,
            fontFamily: active ? FontFamily.textMedium : FontFamily.textRegular,
            lineHeight: FontSize.headingXS * (active ? LineHeight.tight : LineHeight.normal),
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  chip: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: Spacing[12],
    paddingVertical:   Spacing[16],
    borderRadius:      Radius.full,
    overflow:          'hidden',
  },
  icon: {
    marginRight: 0,
  },
  label: {
    fontSize: FontSize.headingXS,
  },
});
