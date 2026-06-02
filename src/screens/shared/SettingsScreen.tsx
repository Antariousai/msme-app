import React from 'react';
import { View, Switch, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, Card, Row, ScreenScroll } from '../../components/atoms';
import { Colors, Spacing, Radius, TierConfig } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../auth/AuthContext';
import { XIcon } from '../../icons';
import { LoanProfileSettings } from '../../components/LoanProfileSettings';

interface SettingsScreenProps {
  onClose: () => void;
  onSelectTier: () => void;
  onOpenBrandStudio: () => void;
}

export const SettingsScreen = ({ onClose, onSelectTier, onOpenBrandStudio }: SettingsScreenProps) => {
  const { user, resetTierGuidance, resetTierTutorial } = useAuth();
  const { colors, isDark, toggleMode } = useTheme();

  if (!user) return null;
  const cfg = TierConfig[user.tier];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <Row justify="space-between" align="center" style={styles.header}>
        <T size="xl" weight="bold">⚙️ সেটিংস</T>
        <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.chip, borderColor: colors.borderLight }]}>
          <XIcon size={18} color={colors.textPrimary} />
        </Pressable>
      </Row>

      <ScreenScroll>
        <Card style={{ marginBottom: Spacing.sm }}>
          <Row justify="space-between" fill>
            <Row gap={Spacing.sm} style={{ flex: 1, minWidth: 0 }}>
              <T size="md">🌙</T>
              <View style={{ flex: 1, minWidth: 0 }}>
                <T size="sm" weight="semibold">ডার্ক মোড</T>
                <T size="xs" color={colors.textTertiary}>Ocean থিম · {isDark ? 'চালু' : 'বন্ধ'}</T>
              </View>
            </Row>
            <Switch
              value={isDark}
              onValueChange={toggleMode}
              trackColor={{ false: colors.border, true: colors.primary2 }}
              thumbColor={colors.surface}
            />
          </Row>
        </Card>

        <LoanProfileSettings />

        <Card onPress={onSelectTier} effect="slideX" style={{ marginBottom: Spacing.sm }}>
          <Row justify="space-between" fill>
            <Row gap={Spacing.md} style={{ flex: 1, minWidth: 0 }}>
              <T size="xl">👑</T>
              <View style={{ flex: 1, minWidth: 0 }}>
                <T size="sm" weight="bold">প্যাকেজ পরিবর্তন</T>
                <T size="xs" color={colors.textTertiary} numberOfLines={2}>
                  বর্তমান: টায়ার {user.tier} — ৳{cfg.price}/মাস
                </T>
              </View>
            </Row>
            <T size="sm" color={colors.textTertiary}>›</T>
          </Row>
        </Card>

        <Card
          onPress={() => { resetTierTutorial(); onClose(); }}
          effect="slideX"
          style={{ marginBottom: Spacing.sm }}
        >
          <Row gap={Spacing.md}>
            <T size="xl">📱</T>
            <View style={{ flex: 1 }}>
              <T size="sm" weight="bold">অ্যাপ টিউটোরিয়াল আবার দেখুন</T>
              <T size="xs" color={colors.textTertiary}>নিচের কোচ কার্ড — প্রতিটি পেজ</T>
            </View>
          </Row>
        </Card>

        <Card
          onPress={() => { resetTierGuidance(); onClose(); }}
          effect="slideX"
          style={{ marginBottom: Spacing.sm }}
        >
          <Row gap={Spacing.md}>
            <T size="xl">👋</T>
            <View style={{ flex: 1 }}>
              <T size="sm" weight="bold">গ্রাহক সেটআপ + টিউটোরিয়াল</T>
              <T size="xs" color={colors.textTertiary}>সম্পূর্ণ অনবোর্ডিং পুনরায় শুরু</T>
            </View>
          </Row>
        </Card>

        {user.tier >= 1 && (
          <Card onPress={onOpenBrandStudio} effect="slideX" style={{ marginBottom: Spacing.base }}>
            <Row justify="space-between" fill>
              <Row gap={Spacing.md} style={{ flex: 1, minWidth: 0 }}>
                <T size="xl">🎨</T>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <T size="sm" weight="bold">Brand Studio</T>
                  <T size="xs" color={colors.textTertiary} numberOfLines={2}>লোগো · ক্যাপশন · ওয়েব টেমপ্লেট</T>
                </View>
              </Row>
              <T size="xs" weight="bold" color={colors.success}>
                {user.addOns.brandStudio ? 'চালু ›' : 'অ্যাড-অন ›'}
              </T>
            </Row>
          </Card>
        )}

      </ScreenScroll>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
