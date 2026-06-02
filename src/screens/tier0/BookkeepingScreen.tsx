import React from 'react';
import { View } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, StatusPill } from '../../components/atoms';
import { ScreenFrame } from '../../components/ScreenFrame';
import { Colors, Spacing } from '../../theme';

export { AccountingScreen as BookkeepingScreen } from '../accounting/AccountingScreen';

export const Tier0Home = () => (
  <ScreenFrame>
    <AppHeader showGreeting />
    <ScreenScroll>
      <Card style={{ marginBottom: Spacing.base, backgroundColor: Colors.tier0 + '15' }}>
        <Row gap={Spacing.sm}>
          <T size="lg">📒</T>
          <View style={{ flex: 1 }}>
            <T size="md" weight="bold">অফলাইন মোড</T>
            <T size="sm" color={Colors.textSecondary}>ইন্টারনেট ছাড়াই হিসাব রাখুন</T>
          </View>
          <StatusPill label="সক্রিয়" type="success" />
        </Row>
      </Card>
      <T size="sm" color={Colors.textSecondary} style={{ marginBottom: Spacing.md }}>
        আপনার ব্যবসার দৈনিক আয়-ব্যয় ও পণ্য মজুদ লিখে রাখুন। হিসাব ট্যাবে যান।
      </T>
      <Card>
        <T size="sm" weight="semibold" style={{ marginBottom: Spacing.sm }}>দ্রুত কাজ</T>
        <T size="sm" color={Colors.textSecondary}>• আয় / ব্যয় যোগ করুন</T>
        <T size="sm" color={Colors.textSecondary}>• পণ্য মজুদ যোগ করুন</T>
        <T size="sm" color={Colors.textSecondary}>• NGO রিপোর্ট পাঠান</T>
      </Card>
    </ScreenScroll>
  </ScreenFrame>
);
