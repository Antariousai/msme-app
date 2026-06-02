import React from 'react';
import { View } from 'react-native';
import { T, Card, Row, Btn } from './atoms';
import { Spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';

interface HomeQuickLinkProps {
  emoji: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  onPress: () => void;
}

/** Shortcut card used on tier home screens (inventory, orders, etc.) */
export const HomeQuickLink = ({
  emoji,
  title,
  subtitle,
  actionLabel,
  onPress,
}: HomeQuickLinkProps) => {
  const { colors } = useTheme();

  return (
    <Card onPress={onPress} style={{ marginBottom: Spacing.base }} effect="slideX">
      <Row justify="space-between" align="center" fill>
        <View style={{ flex: 1, minWidth: 0 }}>
          <T size="sm" weight="bold">{emoji} {title}</T>
          <T size="xs" color={colors.textSecondary} style={{ marginTop: 2 }} numberOfLines={2}>
            {subtitle}
          </T>
        </View>
        <Btn label={actionLabel} onPress={onPress} variant="ghost" size="sm" />
      </Row>
    </Card>
  );
};
