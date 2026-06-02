import React from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, Badge, TierBadge } from '../components/atoms';
import { Spacing, Radius } from '../theme';
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
        <View style={{ flex: 1 }}>
          {showGreeting && user && (
            <T size="sm" color={colors.textSecondary}>{getGreeting()}, {user.name.split(' ')[0]}</T>
          )}
          <T size="xl" weight="bold">{title ?? user?.businessName ?? 'Antarious'}</T>
          {subtitle && <T size="sm" color={colors.textTertiary}>{subtitle}</T>}
          {user && (
            <View style={{ marginTop: Spacing.xs }}>
              <TierBadge tier={user.tier} compact />
            </View>
          )}
        </View>
        <Pressable
          onPress={onNotificationPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: Radius.lg,
            backgroundColor: colors.chip,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.borderLight,
          }}
        >
          <T size="md">🔔</T>
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
