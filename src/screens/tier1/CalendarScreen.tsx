import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader } from '../../components/atoms';
import { Colors, Spacing } from '../../theme';
import { CalendarIcon } from '../../icons';
import { calendarEvents } from '../../data/seed';

export const CalendarScreen = () => (
  <View style={styles.container}>
    <AppHeader title="ক্যালেন্ডার" subtitle="দৈনিক ও সাপ্তাহিক পরিকল্পনা" />
    <ScreenScroll>
      <Card style={{ marginBottom: Spacing.base }}>
        <Row gap={Spacing.sm}>
          <CalendarIcon size={24} color={Colors.primary} />
          <View>
            <T size="md" weight="bold">এই সপ্তাহ</T>
            <T size="sm" color={Colors.textSecondary}>২৬ মে – ১ জুন ২০২৬</T>
          </View>
        </Row>
      </Card>

      <SectionHeader title="আসন্ন ইভেন্ট" />
      {calendarEvents.map((ev) => (
        <Card key={ev.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
          <Row justify="space-between">
            <View>
              <T size="sm" weight="semibold">{ev.title}</T>
              <T size="xs" color={Colors.textTertiary}>{ev.date}</T>
            </View>
            <T size="xs" color={Colors.primary} weight="medium">
              {ev.type === 'market' ? 'হাট' : ev.type === 'inventory' ? 'স্টক' : ev.type === 'promo' ? 'প্রচার' : 'হিসাব'}
            </T>
          </Row>
        </Card>
      ))}
    </ScreenScroll>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
});
