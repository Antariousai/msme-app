import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, TierBadge, Divider, Btn } from '../../components/atoms';
import { FeatureLauncherList } from '../../components/FeatureToolsSection';
import { Colors, Spacing, TierConfig } from '../../theme';
import {
  ProfileIcon, LogoutIcon, CrownIcon, BrandIcon, ChevronRightIcon,
} from '../../icons';
import { useAuth } from '../../auth/AuthContext';
import { getAccessibleFeatures } from '../../navigation/features';

interface MoreScreenProps {
  onSelectTier: () => void;
  onOpenBrandStudio: () => void;
}

export const MoreScreen = ({ onSelectTier, onOpenBrandStudio }: MoreScreenProps) => {
  const { user, signOut } = useAuth();
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
    <View style={styles.container}>
      <AppHeader title="আরও" showGreeting={false} />
      <ScreenScroll>
        <Card style={{ marginBottom: Spacing.base }}>
          <Row gap={Spacing.md}>
            <View style={styles.avatar}>
              <ProfileIcon size={28} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <T size="md" weight="bold">{user.name}</T>
              <T size="sm" color={Colors.textSecondary}>{user.businessName}</T>
              <T size="xs" color={Colors.textTertiary}>{user.phone} · {user.location}</T>
              <View style={{ marginTop: Spacing.sm }}>
                <TierBadge tier={user.tier} />
              </View>
            </View>
          </Row>
        </Card>

        <Card onPress={onSelectTier} style={{ marginBottom: Spacing.sm }}>
          <Row justify="space-between">
            <Row gap={Spacing.sm}>
              <CrownIcon size={20} color={cfg.color} />
              <View>
                <T size="sm" weight="semibold">প্যাকেজ পরিবর্তন</T>
                <T size="xs" color={Colors.textTertiary}>বর্তমান: টায়ার {user.tier} — ৳{cfg.price}/মাস</T>
              </View>
            </Row>
            <ChevronRightIcon size={18} color={Colors.textTertiary} />
          </Row>
        </Card>

        <Card onPress={onOpenBrandStudio} style={{ marginBottom: Spacing.base }}>
          <Row justify="space-between">
            <Row gap={Spacing.sm}>
              <BrandIcon size={20} color={Colors.brandStudio} />
              <View>
                <T size="sm" weight="semibold">Brand Studio</T>
                <T size="xs" color={Colors.textTertiary}>লোগো · ক্যাপশন · কপিরাইটিং</T>
              </View>
            </Row>
            <ChevronRightIcon size={18} color={Colors.textTertiary} />
          </Row>
        </Card>

        <T size="sm" weight="semibold" color={Colors.textSecondary} style={{ marginBottom: Spacing.xs }}>
          সব ফিচার ({featureCount})
        </T>
        <T size="xs" color={Colors.textTertiary} style={{ marginBottom: Spacing.md }}>
          টায়ার ০–{user.tier} এর সব ফিচার · ট্যাবে নেই এমনগুলো এখান থেকে খুলুন
        </T>

        <FeatureLauncherList />

        <Divider style={{ marginVertical: Spacing.base }} />

        {confirmSignOut ? (
          <Card style={{ marginBottom: Spacing.base, borderWidth: 1.5, borderColor: Colors.error }}>
            <T size="sm" weight="semibold" style={{ marginBottom: Spacing.sm }}>আপনি কি সাইন আউট করতে চান?</T>
            <Row gap={Spacing.sm}>
              <Btn
                label="না"
                onPress={() => setConfirmSignOut(false)}
                variant="ghost"
                fullWidth
                disabled={signingOut}
              />
              <Btn
                label="হ্যাঁ"
                onPress={handleSignOut}
                variant="danger"
                fullWidth
                loading={signingOut}
              />
            </Row>
          </Card>
        ) : (
          <Card onPress={() => setConfirmSignOut(true)} style={{ marginBottom: Spacing.base }}>
            <Row gap={Spacing.sm}>
              <LogoutIcon size={20} color={Colors.error} />
              <T size="sm" color={Colors.error} weight="medium">সাইন আউট</T>
            </Row>
          </Card>
        )}

        <T size="xs" color={Colors.textTertiary} align="center">Antarious MSME v1.0 · Bangladesh</T>
      </ScreenScroll>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center', justifyContent: 'center',
  },
});
