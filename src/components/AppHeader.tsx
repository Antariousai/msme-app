import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, Badge } from '../components/atoms';
import { Colors, Spacing } from '../theme';
import { BellIcon } from '../icons';
import { getGreeting } from '../utils/helpers';
import { useAuth } from '../auth/AuthContext';
import { TierBadge } from '../components/atoms';

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

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + Spacing.sm }]}>
      <Row justify="space-between" align="flex-start">
        <View style={{ flex: 1 }}>
          {showGreeting && user && (
            <T size="sm" color={Colors.textSecondary}>{getGreeting()}, {user.name.split(' ')[0]}</T>
          )}
          <T size="xl" weight="bold">{title ?? user?.businessName ?? 'Antarious'}</T>
          {subtitle && <T size="sm" color={Colors.textTertiary}>{subtitle}</T>}
          {user && (
            <View style={{ marginTop: Spacing.xs }}>
              <TierBadge tier={user.tier} compact />
            </View>
          )}
        </View>
        <Pressable onPress={onNotificationPress} style={styles.bellBtn}>
          <BellIcon size={22} color={Colors.textPrimary} />
          {notificationCount > 0 && (
            <View style={styles.badgeWrap}>
              <Badge count={notificationCount} />
            </View>
          )}
        </Pressable>
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.bg,
  },
  bellBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeWrap: { position: 'absolute', top: 2, right: 2 },
});
