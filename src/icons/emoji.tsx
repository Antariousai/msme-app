import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { FeatureId, FeatureCategory } from '../navigation/features';

interface EmojiIconProps {
  size?: number;
  color?: string;
}

export const FEATURE_EMOJI: Record<FeatureId, string> = {
  bookkeeping: '📒',
  messages: '💬',
  comments: '🗨️',
  calendar: '📅',
  orders: '📋',
  inventory: '📦',
  courier: '🛵',
  website: '🌐',
  leads: '🎯',
  dashboard: '📊',
  reports: '📋',
  complaints: '⚠️',
};

export const NAV_EMOJI = {
  home: '🏠',
  more: '⚙️',
};

export const CATEGORY_EMOJI: Record<FeatureCategory, string> = {
  accounting: '💰',
  sales: '🛍️',
  operations: '🚚',
  customers: '🤝',
  insights: '📊',
};

export function makeEmojiIcon(emoji: string) {
  return function EmojiIcon({ size = 22 }: EmojiIconProps) {
    return (
      <Text style={[styles.emoji, { fontSize: Math.round(size * 0.95) }]} allowFontScaling={false}>
        {emoji}
      </Text>
    );
  };
}

export const EmojiIcon = ({ emoji, size = 22 }: { emoji: string; size?: number }) => (
  <Text style={[styles.emoji, { fontSize: Math.round(size * 0.95) }]} allowFontScaling={false}>
    {emoji}
  </Text>
);

const styles = StyleSheet.create({
  emoji: { textAlign: 'center', lineHeight: undefined },
});
