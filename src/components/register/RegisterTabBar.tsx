/**
 * RegisterTabBar — Register App
 *
 * Figma: "Chip bar" in the Tabs frame.
 * Four tabs: Products | Favorites | Categories | Keypad
 * The active tab gets a filled pill; inactive tabs are ghost text.
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
import { FontFamily, FontSize } from '../../theme/typography';
import { Radius, Spacing } from '../../theme/spacing';
import { Icon } from '../ui/Icon';

export type RegisterTab = 'products' | 'favorites' | 'categories' | 'keypad';

const TAB_LABELS: Record<RegisterTab, string> = {
  products:   'Products',
  favorites:  'Favorites',
  categories: 'Categories',
  keypad:     'Keypad',
};

export type RegisterTabBarProps = {
  activeTab:      RegisterTab;
  onTabChange:    (tab: RegisterTab) => void;
  dark?:          boolean;
  style?:         ViewStyle;
};

export function RegisterTabBar({
  activeTab,
  onTabChange,
  dark  = false,
  style,
}: RegisterTabBarProps) {
  const palette = dark ? ColorTokens.dark : ColorTokens.light;

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: palette.bgSurface, borderBottomColor: palette.border },
        style,
      ]}
    >
      {(Object.keys(TAB_LABELS) as RegisterTab[]).map((tab) => {
        const active = tab === activeTab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            style={[
              styles.tab,
              active && [styles.tabActive, { backgroundColor: palette.bgBase }],
            ]}
            activeOpacity={0.7}
          >
            {tab === 'keypad' && (
              <Icon
                name="calculator"
                size={16}
                color={active ? '#fff' : palette.textPrimary}
                style={{ marginRight: Spacing[6] }}
              />
            )}
            <Text
              style={[
                styles.label,
                {
                  color:      active ? '#fff' : palette.textPrimary,
                  fontFamily: active ? FontFamily.textMedium : FontFamily.textRegular,
                  fontSize:   FontSize.bodySM,
                },
              ]}
            >
              {TAB_LABELS[tab]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection:    'row',
    alignItems:       'center',
    paddingHorizontal: Spacing[16],
    paddingVertical:   Spacing[12],
    borderBottomWidth: 1,
    gap:              Spacing[8],
  },
  tab: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'center',
    paddingHorizontal: Spacing[16],
    paddingVertical:  Spacing[8],
    borderRadius:     Radius.full,
    minWidth:         88,
  },
  tabActive: {
    // filled dark pill
  },
  label: {
    lineHeight: FontSize.bodySM * 1.4,
  },
});
