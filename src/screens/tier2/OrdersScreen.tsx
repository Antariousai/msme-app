import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatusPill, Btn, Input } from '../../components/atoms';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { Colors, Spacing, Radius } from '../../theme';
import { OrderIcon, WebsiteIcon, FacebookIcon, InstagramIcon } from '../../icons';
import { seedOrders, Order } from '../../data/seed';
import { bnTaka } from '../../utils/helpers';

const sourceIcon = (s: Order['source']) => {
  if (s === 'facebook') return <FacebookIcon size={16} color="#1877F2" />;
  if (s === 'instagram') return <InstagramIcon size={16} color="#E4405F" />;
  return <WebsiteIcon size={16} color={Colors.accent} />;
};

const statusLabel: Record<Order['status'], { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = {
  pending: { label: 'অপেক্ষমাণ', type: 'warning' },
  confirmed: { label: 'কনফার্ম', type: 'info' },
  shipped: { label: 'পাঠানো', type: 'info' },
  delivered: { label: 'ডেলিভার্ড', type: 'success' },
};

export const OrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [selected, setSelected] = useState<Order | null>(null);

  const confirmOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'confirmed' as const } : o));
    setSelected(null);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="অর্ডার" subtitle="সব চ্যানেল থেকে" />
      <ScreenScroll>
        <Row gap={Spacing.sm} style={{ marginBottom: Spacing.base }}>
          <Card style={{ flex: 1 }}>
            <T size="xs" color={Colors.textTertiary}>অপেক্ষমাণ</T>
            <T size="xl" weight="bold" color={Colors.warning}>{orders.filter((o) => o.status === 'pending').length}</T>
          </Card>
          <Card style={{ flex: 1 }}>
            <T size="xs" color={Colors.textTertiary}>কনফার্ম</T>
            <T size="xl" weight="bold" color={Colors.accent}>{orders.filter((o) => o.status === 'confirmed').length}</T>
          </Card>
          <Card style={{ flex: 1 }}>
            <T size="xs" color={Colors.textTertiary}>ডেলিভার্ড</T>
            <T size="xl" weight="bold" color={Colors.success}>{orders.filter((o) => o.status === 'delivered').length}</T>
          </Card>
        </Row>

        <SectionHeader title="অর্ডার তালিকা" />
        {orders.map((order) => {
          const st = statusLabel[order.status];
          return (
            <Card key={order.id} onPress={() => setSelected(order)} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
              <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
                <Row gap={Spacing.sm}>
                  {sourceIcon(order.source)}
                  <T size="sm" weight="bold">{order.id}</T>
                </Row>
                <StatusPill label={st.label} type={st.type} />
              </Row>
              <T size="sm" weight="medium">{order.customer}</T>
              <T size="xs" color={Colors.textSecondary}>{order.items}</T>
              <Row justify="space-between" style={{ marginTop: Spacing.sm }}>
                <T size="sm" weight="bold" color={Colors.primary}>{bnTaka(order.amount)}</T>
                <T size="xs" color={Colors.textTertiary}>{order.date}</T>
              </Row>
            </Card>
          );
        })}

        {selected && (
          <Card style={{ marginTop: Spacing.base, borderWidth: 2, borderColor: Colors.primary }}>
            <T size="md" weight="bold">{selected.id}</T>
            <T size="sm" color={Colors.textSecondary} style={{ marginVertical: Spacing.sm }}>
              {selected.customer} · {selected.phone}
            </T>
            <T size="sm">{selected.items} — {bnTaka(selected.amount)}</T>
            {selected.status === 'pending' && (
              <Btn label="অর্ডার কনফার্ম" onPress={() => confirmOrder(selected.id)} fullWidth style={{ marginTop: Spacing.base }} />
            )}
          </Card>
        )}
      </ScreenScroll>
    </View>
  );
};

export const WebsiteScreen = () => (
  <View style={styles.container}>
    <AppHeader title="ওয়েবসাইট" subtitle="ইন্টিগ্রেশন ও হোস্টিং" />
    <ScreenScroll>
      <Card style={{ marginBottom: Spacing.base }}>
        <Row gap={Spacing.sm}>
          <WebsiteIcon size={24} color={Colors.tier2} />
          <View style={{ flex: 1 }}>
            <T size="md" weight="bold">ওয়েবসাইট সংযুক্ত</T>
            <T size="sm" color={Colors.textSecondary}>অর্ডার স্বয়ংক্রিয়ভাবে এখানে আসে</T>
          </View>
          <StatusPill label="সক্রিয়" type="success" />
        </Row>
      </Card>

      <SectionHeader title="হোস্টিং পরামর্শ" />
      <T size="sm" color={Colors.textSecondary} style={{ marginBottom: Spacing.md }}>
        আমরা সরাসরি হোস্ট করি না — নিচের প্রদানকারীদের পরামর্শ দিই:
      </T>
      {[
        { name: 'Hostinger', price: '৳১৯৯/মাস', note: 'শুরুর জন্য সেরা' },
        { name: 'Namecheap', price: '৳২৪৯/মাস', note: 'ডোমেইন + হোস্টিং' },
        { name: 'ExonHost (BD)', price: '৳৩৫০/মাস', note: 'বাংলাদেশি সাপোর্ট' },
      ].map((h) => (
        <Card key={h.name} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
          <Row justify="space-between">
            <View>
              <T size="sm" weight="semibold">{h.name}</T>
              <T size="xs" color={Colors.textTertiary}>{h.note}</T>
            </View>
            <T size="sm" weight="bold" color={Colors.tier2}>{h.price}</T>
          </Row>
        </Card>
      ))}

      <Card style={{ marginTop: Spacing.base, backgroundColor: Colors.warningLight }}>
        <T size="sm" weight="semibold">ওয়েবসাইট টেমপ্লেট</T>
        <T size="xs" color={Colors.textSecondary}>শীঘ্রই আসছে — প্রস্তুত টেমপ্লেট দিয়ে দ্রুত সাইট তৈরি</T>
      </Card>
    </ScreenScroll>
  </View>
);

export const Tier2Home = () => (
  <View style={styles.container}>
    <AppHeader showGreeting />
    <ScreenScroll>
      <Row gap={Spacing.sm} style={{ marginBottom: Spacing.base }}>
        <Card style={{ flex: 1 }}>
          <T size="xs" color={Colors.textTertiary}>ওয়েব অর্ডার</T>
          <T size="2xl" weight="bold" color={Colors.tier2}>১</T>
        </Card>
        <Card style={{ flex: 1 }}>
          <T size="xs" color={Colors.textTertiary}>কম স্টক</T>
          <T size="2xl" weight="bold" color={Colors.warning}>১</T>
        </Card>
        <Card style={{ flex: 1 }}>
          <T size="xs" color={Colors.textTertiary}>কুরিয়ারে</T>
          <T size="2xl" weight="bold" color={Colors.accent}>২</T>
        </Card>
      </Row>

      <SectionHeader title="সাম্প্রতিক অর্ডার" />
      {seedOrders.slice(0, 2).map((o) => (
        <Card key={o.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
          <Row justify="space-between">
            <T size="sm" weight="semibold">{o.customer}</T>
            <T size="sm" color={Colors.primary}>{bnTaka(o.amount)}</T>
          </Row>
          <T size="xs" color={Colors.textTertiary}>{o.items}</T>
        </Card>
      ))}

      <FeatureToolsSection title="টায়ার ০–১ সরঞ্জাম" defaultExpanded={false} />
    </ScreenScroll>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
});
