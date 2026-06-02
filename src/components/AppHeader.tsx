import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, Row, Badge, TierBadge } from '../components/atoms';
import { Spacing, Shadow, TierConfig } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { getGreeting } from '../utils/helpers';
import { useAuth } from '../auth/AuthContext';

const LOGO_MAIN  = require('../../assets/logos/antarious-main.png');
const LOGO_WHITE = require('../../assets/logos/antarious-white.png');

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
  const { colors, isDark } = useTheme();
  const tierTagline = user ? TierConfig[user.tier].tagline : undefined;
  const displaySubtitle = subtitle ?? (showGreeting && user ? tierTagline : undefined);

  return (
    <View style={{
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.sm,
      paddingTop: insets.top + Spacing.sm,
    }}>
      {showGreeting && user && (
        <T size="sm" color={colors.textSecondary} style={{ marginBottom: 2 }}>
          {getGreeting()}, {user.name.split(' ')[0]}
        </T>
      )}
      <Row justify="space-between" align="flex-start">
        <View style={{ flex: 1, minWidth: 0, paddingRight: Spacing.sm }}>
          <Image
            source={isDark ? LOGO_WHITE : LOGO_MAIN}
            style={{ height: 28, width: 160 }}
            resizeMode="contain"
          />
          {(title ?? user?.businessName) && (
            <T size="sm" weight="semibold" style={{ marginTop: 4 }} numberOfLines={1}>
              {title ?? user?.businessName}
            </T>
          )}
          {displaySubtitle && (
            <T size="xs" color={colors.textSecondary} style={{ marginTop: 2 }}>{displaySubtitle}</T>
          )}
        </View>
        <Pressable
          onPress={onNotificationPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            ...Shadow.card,
          }}
        >
          <T size="lg">🔔</T>
          {notificationCount > 0 && (
            <View style={{ position: 'absolute', top: -2, right: -2 }}>
              <Badge count={notificationCount} />
            </View>
          )}
        </Pressable>
      </Row>
      {user && showGreeting && (
        <View style={{ marginTop: Spacing.sm }}>
          <TierBadge tier={user.tier} />
        </View>
      )}
    </View>
  );
};
