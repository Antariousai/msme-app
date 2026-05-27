import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, UserTier } from '../../auth/AuthContext';
import { T, Btn, Card, Row, ScreenScroll, TierBadge } from '../../components/atoms';
import { Colors, Spacing, Radius, TierConfig } from '../../theme';
import { CheckIcon, LockIcon } from '../../icons';

const TIER_FEATURES: Record<number, string[]> = {
  0: ['মৌলিক হিসাব রক্ষা', 'আয়-ব্যয় লিখুন', 'অফলাইন কাজ'],
  1: ['Instagram + Facebook', 'মেসেজ ও কমেন্ট', 'অটো রিপ্লাই', 'অর্ডার কনফার্ম', 'হিসাব + ক্যালেন্ডার', 'AI পরামর্শ'],
  2: ['ওয়েবসাইট ইন্টিগ্রেশন', 'অর্ডার ভিজিবিলিটি', 'ইনভেন্টরি ট্র্যাকিং', 'কুরিয়ার ইন্টিগ্রেশন', 'হোস্টিং পরামর্শ'],
  3: ['লিড ক্যাপচার', 'গ্রাহক ডেটা', 'লিড স্কোরিং', 'আপসেল/ক্রস-সেল'],
  4: ['ইনসাইট ড্যাশবোর্ড', 'দৈনিক/সাপ্তাহিক/মাসিক সারাংশ', 'অভিযোগ ট্র্যাকিং', 'বেস্ট/ওয়ার্স সেলার', 'পিক আওয়ার', 'লিড ক্লোজিং'],
};

interface TierSelectScreenProps {
  onDone: () => void;
}

export const TierSelectScreen = ({ onDone }: TierSelectScreenProps) => {
  const { user, updateTier } = useAuth();

  const selectTier = async (tier: UserTier) => {
    await updateTier(tier);
    onDone();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenScroll>
        <T size="2xl" weight="bold">আপনার প্যাকেজ</T>
        <T size="sm" color={Colors.textSecondary} style={{ marginTop: Spacing.xs, marginBottom: Spacing.xl }}>
          ব্যবসার ধরন অনুযায়ী টায়ার নির্বাচন করুন
        </T>

        {([0, 1, 2, 3, 4] as UserTier[]).map((tier) => {
          const cfg = TierConfig[tier];
          const isCurrent = user?.tier === tier;
          const features = TIER_FEATURES[tier];

          return (
            <Card key={tier} style={[styles.tierCard, isCurrent && { borderWidth: 2, borderColor: cfg.color }]}>
              <Row justify="space-between" align="flex-start" style={{ marginBottom: Spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <Row gap={Spacing.sm}>
                    <T size="lg" weight="bold">টায়ার {tier}</T>
                    <TierBadge tier={tier} compact />
                  </Row>
                  <T size="sm" color={Colors.textSecondary}>{cfg.tagline}</T>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <T size="md" weight="bold" color={cfg.color}>৳{cfg.price}</T>
                  <T size="xs" color={Colors.textTertiary}>/মাস</T>
                </View>
              </Row>

              <View style={{ gap: Spacing.xs, marginBottom: Spacing.md }}>
                {features.map((f) => (
                  <Row key={f} gap={Spacing.sm}>
                    <CheckIcon size={14} color={cfg.color} />
                    <T size="sm" color={Colors.textSecondary}>{f}</T>
                  </Row>
                ))}
              </View>

              {tier > 0 && (
                <Row gap={Spacing.xs} style={{ marginBottom: Spacing.sm }}>
                  <LockIcon size={12} color={Colors.textTertiary} />
                  <T size="xs" color={Colors.textTertiary}>
                    টায়ার {tier > 1 ? `1–${tier - 1}` : '0'} এর সব ফিচার অন্তর্ভুক্ত
                  </T>
                </Row>
              )}

              <Btn
                label={isCurrent ? 'বর্তমান প্যাকেজ' : 'এই প্যাকেজ নিন'}
                onPress={() => selectTier(tier)}
                variant={isCurrent ? 'ghost' : 'primary'}
                fullWidth
                disabled={isCurrent}
                style={{ backgroundColor: isCurrent ? Colors.bgDark : cfg.color }}
              />
            </Card>
          );
        })}

        <Btn label="চালিয়ে যান" onPress={onDone} variant="outline" fullWidth style={{ marginTop: Spacing.md }} />
      </ScreenScroll>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  tierCard: { marginBottom: Spacing.base },
});
