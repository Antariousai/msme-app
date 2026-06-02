import React from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, Badge, TierBadge } from '../components/atoms';
import { Spacing, Radius, TierConfig } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { getGreeting } from '../utils/helpers';
import { useAuth } from '../auth/AuthContext';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export const AppHeader = ({
  title, subtitle, showGreeting = true,
  notificationCount = 0, onNotificationPress,
}: AppHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { colors } = useTheme();
  const tierTagline = user ? TierConfig[user.tier].tagline : undefined;
  const displaySubtitle = subtitle ?? (showGreeting && user ? tierTagline : undefined);

  return (
    <View style={{
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing.md,
      paddingTop: insets.top + Spacing.sm,
      backgroundColor: colors.bg2,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    }}>
      <Row justify="space-between" align="flex-start">
        <View style={{ flex: 1, minWidth: 0, paddingRight: Spacing.sm }}>
          {showGreeting && user && (
            <T size="sm" color={colors.textSecondary}>{getGreeting()}, {user.name.split(' ')[0]}</T>
          )}
          <T size="2xl" weight="bold" numberOfLines={2}>
            {title ?? user?.businessName ?? 'Antarious'}
          </T>
          {displaySubtitle && (
            <T size="sm" color={colors.textSecondary} style={{ marginTop: 2 }}>{displaySubtitle}</T>
          )}
          {user && showGreeting && (
            <View style={{ marginTop: Spacing.sm }}>
              <TierBadge tier={user.tier} compact />
            </View>
          )}
        </View>
        <Pressable
          onPress={onNotificationPress}
          style={{
            width: 44,
            height: 44,
            borderRadius: Radius.lg,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.borderLight,
          }}
        >
          <T size="lg">🔔</T>
          {notificationCount > 0 && (
            <View style={{ position: 'absolute', top: 2, right: 2 }}>
              <Badge count={notificationCount} />
            </View>
          )}
        </Pressable>
      </Row>
    </View>
  );
};
