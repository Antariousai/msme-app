import React, { useState } from 'react';
import { View, Switch } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, TierBadge, Divider, Btn, BtnRow } from '../../components/atoms';
import { FeatureLauncherList } from '../../components/FeatureToolsSection';
import { ScreenFrame } from '../../components/ScreenFrame';
import { Spacing, TierConfig, BrandStudioAddOn } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { ChevronRightIcon } from '../../icons';
import { useAuth } from '../../auth/AuthContext';
import { getAccessibleFeatures } from '../../navigation/features';

interface MoreScreenProps {
  onSelectTier: () => void;
  onOpenBrandStudio: () => void;
}

export const MoreScreen = ({ onSelectTier, onOpenBrandStudio }: MoreScreenProps) => {
  const { user, signOut } = useAuth();
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
      <AppHeader title="আরও" showGreeting={false} />
      <ScreenScroll>
        <Card style={{ marginBottom: Spacing.base }}>
          <Row gap={Spacing.md}>
            <View style={{
              width: 52, height: 52, borderRadius: 26,
              backgroundColor: colors.primary + '15',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <T size="2xl">👤</T>
            </View>
            <View style={{ flex: 1 }}>
              <T size="md" weight="bold">{user.name}</T>
              <T size="sm" color={colors.textSecondary}>{user.businessName}</T>
              <T size="xs" color={colors.textTertiary}>{user.phone} · {user.location}</T>
              <View style={{ marginTop: Spacing.sm }}>
                <TierBadge tier={user.tier} />
              </View>
            </View>
          </Row>
        </Card>

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

        <Card onPress={onSelectTier} style={{ marginBottom: Spacing.sm }}>
          <Row justify="space-between" fill>
            <Row gap={Spacing.sm} style={{ flex: 1, minWidth: 0 }}>
              <T size="md">👑</T>
              <View style={{ flex: 1, minWidth: 0 }}>
                <T size="sm" weight="semibold">প্যাকেজ পরিবর্তন</T>
                <T size="xs" color={colors.textTertiary} numberOfLines={2}>বর্তমান: টায়ার {user.tier} — ৳{cfg.price}/মাস</T>
              </View>
            </Row>
            <ChevronRightIcon size={18} color={colors.textTertiary} />
          </Row>
        </Card>

        {user.tier >= 1 && (
          <Card onPress={onOpenBrandStudio} style={{ marginBottom: Spacing.base }}>
            <Row justify="space-between" fill>
              <Row gap={Spacing.sm} style={{ flex: 1, minWidth: 0 }}>
                <T size="md">🎨</T>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <T size="sm" weight="semibold">Brand Studio</T>
                  <T size="xs" color={colors.textTertiary} numberOfLines={2}>লোগো · ক্যাপশন · ওয়েব টেমপ্লেট</T>
                </View>
              </Row>
              <Row gap={Spacing.sm}>
                <T size="xs" weight="bold" color={colors.brandStudio}>
                  {user.addOns.brandStudio ? 'চালু' : `অ্যাড-অন · ৳${BrandStudioAddOn.price}/মাস`}
                </T>
                <ChevronRightIcon size={18} color={colors.textTertiary} />
              </Row>
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
          <Card onPress={() => setConfirmSignOut(true)} style={{ marginBottom: Spacing.base }}>
            <Row gap={Spacing.sm}>
              <T size="md">🚪</T>
              <T size="sm" color={colors.error} weight="medium">সাইন আউট</T>
            </Row>
          </Card>
        )}

        <Divider style={{ marginVertical: Spacing.base }} />

        <T size="sm" weight="semibold" color={colors.textSecondary} style={{ marginBottom: Spacing.xs }}>
          আপনার সরঞ্জাম ({featureCount})
        </T>
        <T size="xs" color={colors.textTertiary} style={{ marginBottom: Spacing.md }}>
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
