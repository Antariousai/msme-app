import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../auth/AuthContext';
import { T, Btn, Input, Card, Row } from '../../components/atoms';
import { OceanGradient } from '../../components/OceanGradient';
import { Colors, Spacing, Radius, TierConfig } from '../../theme';

export const LoginScreen = () => {
  const { signIn } = useAuth();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !pin) {
      setError('ফোন নম্বর ও PIN দিন');
      return;
    }
    setLoading(true);
    setError('');
    const ok = await signIn(phone, pin);
    if (!ok) setError('ভুল ফোন নম্বর বা PIN');
    setLoading(false);
  };

  const demoAccounts = [
    { phone: '01700000000', tier: 0, name: 'রাহেলা (অফলাইন)' },
    { phone: '01800000001', tier: 1, name: 'ফয়সাল (স্টার্টার)' },
    { phone: '01900000002', tier: 2, name: 'সুমাইয়া (গ্রোথ)' },
    { phone: '01700000003', tier: 3, name: 'করিম (প্রো)' },
    { phone: '01800000004', tier: 4, name: 'নাসরিন (এন্টারপ্রাইজ)' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <OceanGradient style={styles.hero}>
            <Image
              source={require('../../../assets/logos/antarious-white.png')}
              style={{ height: 40, width: 220 }}
              resizeMode="contain"
            />
            <T size="sm" color="rgba(255,255,255,0.9)" align="center" style={{ marginTop: Spacing.sm }}>
              MSME Business Companion — Bangladesh
            </T>
          </OceanGradient>

          <Card style={styles.formCard} elevated>
            <T size="lg" weight="bold" style={{ marginBottom: Spacing.base }}>লগইন করুন</T>
            <Input
              label="মোবাইল নম্বর"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={{ marginBottom: Spacing.md }}
            />
            <Input
              label="PIN"
              placeholder="••••"
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="numeric"
              style={{ marginBottom: Spacing.md }}
            />
            {error ? <T size="sm" color={Colors.error} style={{ marginBottom: Spacing.sm }}>{error}</T> : null}
            <Btn label="প্রবেশ করুন" onPress={handleLogin} fullWidth loading={loading} />
          </Card>

          <T size="sm" color={Colors.textSecondary} weight="medium" style={{ marginTop: Spacing.xl, marginBottom: Spacing.sm, paddingHorizontal: Spacing.base }}>
            ডেমো অ্যাকাউন্ট (PIN: 1234)
          </T>
          <View style={{ paddingHorizontal: Spacing.base }}>
          {demoAccounts.map((acc) => {
            const tier = TierConfig[acc.tier as keyof typeof TierConfig];
            return (
              <Card
                key={acc.phone}
                onPress={() => { setPhone(acc.phone); setPin('1234'); }}
                style={{ marginBottom: Spacing.sm }}
                padding={Spacing.md}
              >
                <Row justify="space-between">
                  <View>
                    <T size="sm" weight="semibold">{acc.name}</T>
                    <T size="xs" color={Colors.textTertiary}>{acc.phone}</T>
                  </View>
                  <View style={[styles.tierDot, { backgroundColor: tier.color + '22' }]}>
                    <T size="xs" color={tier.color} weight="bold">T{acc.tier}</T>
                  </View>
                </Row>
              </Card>
            );
          })}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#eef8fd' },
  container: { paddingBottom: Spacing['4xl'] },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    borderBottomLeftRadius: Radius['2xl'],
    borderBottomRightRadius: Radius['2xl'],
    marginBottom: Spacing.base,
  },
  formCard: { marginHorizontal: Spacing.base, marginTop: -Spacing.xl },
  tierDot: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
});
