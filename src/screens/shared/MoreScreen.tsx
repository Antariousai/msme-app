import React, { useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, TierBadge, Divider, Btn, BtnRow } from '../../components/atoms';
import { FeatureLauncherList } from '../../components/FeatureToolsSection';
import { ScreenFrame } from '../../components/ScreenFrame';
import { Spacing, Gradients } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../auth/AuthContext';
import { userHasLoan } from '../../auth/onboarding';
import { getLauncherFeatures } from '../../navigation/features';
import { useFeatureNav } from '../../navigation/FeatureNavContext';
import { AccountCreditScoreRow } from './CreditScoreScreen';

interface MoreScreenProps {
  onOpenSettings: () => void;
}

export const MoreScreen = ({ onOpenSettings }: MoreScreenProps) => {
  const { user, signOut } = useAuth();
  const { openFeature } = useFeatureNav();
  const { colors } = useTheme();
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
  const featureCount = getLauncherFeatures(user.tier).length;

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

          {userHasLoan(user) ? (
            <AccountCreditScoreRow onPress={() => openFeature('creditScore')} />
          ) : null}
        </Card>

        <Card onPress={onOpenSettings} effect="slideX" style={{ marginBottom: Spacing.base }}>
          <Row justify="space-between" fill>
            <Row gap={Spacing.md} style={{ flex: 1, minWidth: 0 }}>
              <T size="xl">⚙️</T>
              <View style={{ flex: 1, minWidth: 0 }}>
                <T size="sm" weight="bold">সেটিংস</T>
                <T size="xs" color={colors.textTertiary}>ডার্ক মোড · প্যাকেজ · ঋণ</T>
              </View>
            </Row>
            <T size="sm" color={colors.textTertiary}>›</T>
          </Row>
        </Card>

        <Divider style={{ marginVertical: Spacing.base }} />

        <T size="sm" weight="bold" style={{ marginBottom: Spacing.xs }}>
          🧰 আপনার সরঞ্জাম ({featureCount})
        </T>
        <T size="xs" color={colors.textSecondary} style={{ marginBottom: Spacing.md }}>
          ব্যবসার প্রয়োজন অনুযায়ী সব ফিচার এক জায়গায়
        </T>

        <FeatureLauncherList />

        {confirmSignOut ? (
          <Card style={{ marginTop: Spacing.base, borderWidth: 1.5, borderColor: colors.error }}>
            <T size="sm" weight="semibold" style={{ marginBottom: Spacing.sm }}>
              আপনি কি সাইন আউট করতে চান?
            </T>
            <BtnRow>
              <Btn label="না" onPress={() => setConfirmSignOut(false)} variant="ghost" flex disabled={signingOut} />
              <Btn label="হ্যাঁ, সাইন আউট" onPress={handleSignOut} variant="danger" flex loading={signingOut} />
            </BtnRow>
          </Card>
        ) : (
          <Card onPress={() => setConfirmSignOut(true)} effect="slideX" style={{ marginTop: Spacing.base }}>
            <Row gap={Spacing.md} align="center">
              <T size="xl">🚪</T>
              <T size="sm" color={colors.error} weight="bold">সাইন আউট</T>
            </Row>
          </Card>
        )}

        <T size="xs" color={colors.textTertiary} align="center" style={{ marginTop: Spacing.base }}>
          Antarious MSME v1.0 · Bangladesh
        </T>
      </ScreenScroll>
    </ScreenFrame>
  );
};
