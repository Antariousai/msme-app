import React, { useState } from 'react';
import { View, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, TierBadge, Divider, Btn, BtnRow } from '../../components/atoms';
import { FeatureLauncherList } from '../../components/FeatureToolsSection';
import { ScreenFrame } from '../../components/ScreenFrame';
import { Spacing, Gradients, TierConfig } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../auth/AuthContext';
import { getAccessibleFeatures } from '../../navigation/features';
import { useFeatureNav } from '../../navigation/FeatureNavContext';
import { AccountCreditScoreRow } from './CreditScoreScreen';

interface MoreScreenProps {
  onSelectTier: () => void;
  onOpenBrandStudio: () => void;
}

export const MoreScreen = ({ onSelectTier, onOpenBrandStudio }: MoreScreenProps) => {
  const { user, signOut } = useAuth();
  const { openFeature } = useFeatureNav();
  const { colors, isDark, toggleMode } = useTheme();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
      setConfirmSignOut(false);
    }
  };

  if (!user) return null;
  const cfg = TierConfig[user.tier];
  const featureCount = getAccessibleFeatures(user.tier).length;

  return (
    <ScreenFrame>
      <AppHeader title="অ্যাকাউন্ট" subtitle={user.businessName} showGreeting={false} />
      <ScreenScroll>
        <Card style={{ marginBottom: Spacing.base, overflow: 'hidden' }}>
          <Row gap={Spacing.base}>
            <View style={{
              width: 60, height: 60, borderRadius: 30,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <LinearGradient
                colors={[...Gradients.hero]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: 'absolute', width: 60, height: 60, borderRadius: 30,
                }}
              />
              <T size="2xl" color="#ffffff">👤</T>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <T size="lg" weight="bold">{user.name}</T>
              <T size="sm" color={colors.textSecondary}>{user.businessName}</T>
              <T size="xs" color={colors.textTertiary}>{user.phone} · {user.location}</T>
              <View style={{ marginTop: Spacing.sm }}>
                <TierBadge tier={user.tier} />
              </View>
            </View>
          </Row>

          <AccountCreditScoreRow onPress={() => openFeature('creditScore')} />
        </Card>

        <T size="xs" weight="semibold" color={colors.textTertiary} style={{ marginBottom: Spacing.sm, marginLeft: Spacing.xs }}>
          সেটিংস
        </T>

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
                <T size="xs" color={colors.textTertiary} numberOfLines={2}>বর্তমান: টায়ার {user.tier} — ৳{cfg.price}/মাস</T>
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
                {user.addOns.brandStudio ? 'চালু ›' : `অ্যাড-অন ›`}
              </T>
            </Row>
          </Card>
        )}

        {confirmSignOut ? (
          <Card style={{ marginBottom: Spacing.base, borderWidth: 1.5, borderColor: colors.error }}>
            <T size="sm" weight="semibold" style={{ marginBottom: Spacing.sm }}>আপনি কি সাইন আউট করতে চান?</T>
            <BtnRow>
              <Btn
                label="না"
                onPress={() => setConfirmSignOut(false)}
                variant="ghost"
                flex
                disabled={signingOut}
              />
              <Btn
                label="হ্যাঁ, সাইন আউট"
                onPress={handleSignOut}
                variant="danger"
                flex
                loading={signingOut}
              />
            </BtnRow>
          </Card>
        ) : (
          <Card onPress={() => setConfirmSignOut(true)} effect="slideX" style={{ marginBottom: Spacing.base }}>
            <Row gap={Spacing.md}>
              <T size="xl">🚪</T>
              <T size="sm" color={colors.error} weight="bold">সাইন আউট</T>
            </Row>
          </Card>
        )}

        <Divider style={{ marginVertical: Spacing.base }} />

        <T size="sm" weight="bold" style={{ marginTop: Spacing.base, marginBottom: Spacing.xs }}>
          🧰 আপনার সরঞ্জাম ({featureCount})
        </T>
        <T size="xs" color={colors.textSecondary} style={{ marginBottom: Spacing.md }}>
          ব্যবসার প্রয়োজন অনুযায়ী সব ফিচার এক জায়গায়
        </T>

        <FeatureLauncherList />

        <T size="xs" color={colors.textTertiary} align="center" style={{ marginTop: Spacing.base }}>
          Antarious MSME v1.0 · Bangladesh
        </T>
      </ScreenScroll>
    </ScreenFrame>
  );
};
