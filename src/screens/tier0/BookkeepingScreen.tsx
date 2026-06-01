import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, StatusPill } from '../../components/atoms';
import { Colors, Spacing } from '../../theme';
import { BookIcon } from '../../icons';

export { AccountingScreen as BookkeepingScreen } from '../accounting/AccountingScreen';

export const Tier0Home = () => (
  <View style={styles.container}>
    <AppHeader showGreeting />
    <ScreenScroll>
      <Card style={{ marginBottom: Spacing.base, backgroundColor: Colors.tier0 + '15' }}>
        <Row gap={Spacing.sm}>
          <BookIcon size={24} color={Colors.tier0} />
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
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
});
