import React, { useState } from 'react';
import { View, Switch, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, Card, Row, ScreenScroll, Btn, BtnRow } from '../../components/atoms';
import { Colors, Spacing, Radius, TierConfig } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../auth/AuthContext';
import { XIcon } from '../../icons';

interface SettingsScreenProps {
  onClose: () => void;
  onSelectTier: () => void;
  onOpenBrandStudio: () => void;
}

export const SettingsScreen = ({ onClose, onSelectTier, onOpenBrandStudio }: SettingsScreenProps) => {
  const { user, signOut } = useAuth();
  const { colors, isDark, toggleMode } = useTheme();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;
  const cfg = TierConfig[user.tier];

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      onClose();
    } finally {
      setSigningOut(false);
      setConfirmSignOut(false);
    }
  };

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

        {confirmSignOut ? (
          <Card style={{ borderWidth: 1.5, borderColor: colors.error }}>
            <T size="sm" weight="semibold" style={{ marginBottom: Spacing.sm }}>আপনি কি সাইন আউট করতে চান?</T>
            <BtnRow>
              <Btn label="না" onPress={() => setConfirmSignOut(false)} variant="ghost" flex disabled={signingOut} />
              <Btn label="হ্যাঁ, সাইন আউট" onPress={handleSignOut} variant="danger" flex loading={signingOut} />
            </BtnRow>
          </Card>
        ) : (
          <Card onPress={() => setConfirmSignOut(true)} effect="slideX">
            <Row gap={Spacing.md}>
              <T size="xl">🚪</T>
              <T size="sm" color={colors.error} weight="bold">সাইন আউট</T>
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
