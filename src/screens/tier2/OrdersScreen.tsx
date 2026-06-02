import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatusPill, Btn, Chip } from '../../components/atoms';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { ScreenFrame } from '../../components/ScreenFrame';
import { HeroCard } from '../../components/HeroCard';
import { Colors, Spacing, Radius } from '../../theme';
import { WebsiteIcon, FacebookIcon, InstagramIcon } from '../../icons';
import { seedOrders, Order, ORDER_CATEGORIES } from '../../data/seed';
import { bnTaka } from '../../utils/helpers';

const sourceIcon = (s: Order['source']) => {
  if (s === 'facebook') return <FacebookIcon size={16} color="#1877F2" />;
  if (s === 'instagram') return <InstagramIcon size={16} color="#E4405F" />;
  return <WebsiteIcon size={16} color={Colors.accent} />;
};

const STATUS_FILTERS = [
  { key: 'all', label: 'সব' },
  { key: 'pending', label: 'অপেক্ষমাণ' },
  { key: 'confirmed', label: 'কনফার্ম' },
  { key: 'shipped', label: 'পাঠানো' },
  { key: 'delivered', label: 'ডেলিভার্ড' },
] as const;

const SOURCE_FILTERS = [
  { key: 'all', label: 'সব চ্যানেল' },
  { key: 'facebook', label: '👍 ফেসবুক' },
  { key: 'instagram', label: '📸 ইনস্টাগ্রাম' },
  { key: 'website', label: '🌐 ওয়েবসাইট' },
] as const;

const statusLabel: Record<Order['status'], { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = {
  pending: { label: 'অপেক্ষমাণ', type: 'warning' },
  confirmed: { label: 'কনফার্ম', type: 'info' },
  shipped: { label: 'পাঠানো', type: 'info' },
  delivered: { label: 'ডেলিভার্ড', type: 'success' },
};

export const OrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [selected, setSelected] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const confirmOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'confirmed' as const } : o));
    setSelected(null);
  };

  const filtered = useMemo(() => orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (sourceFilter !== 'all' && o.source !== sourceFilter) return false;
    if (categoryFilter !== 'all' && o.category !== categoryFilter) return false;
    return true;
  }), [orders, statusFilter, sourceFilter, categoryFilter]);

  const categoryFilters = [{ key: 'all', label: 'সব ক্যাটাগরি' }, ...ORDER_CATEGORIES.map((c) => ({ key: c, label: c }))];

  return (
    <View style={styles.container}>
      <AppHeader title="অর্ডার" subtitle={`${filtered.length}টি দেখাচ্ছে`} />
      <ScreenScroll>
        <Row gap={Spacing.sm} style={{ marginBottom: Spacing.base }}>
          <Card style={{ flex: 1, minWidth: 0 }}>
            <T size="xs" color={Colors.textTertiary}>অপেক্ষমাণ</T>
            <T size="xl" weight="bold" color={Colors.warning}>{orders.filter((o) => o.status === 'pending').length}</T>
          </Card>
          <Card style={{ flex: 1, minWidth: 0 }}>
            <T size="xs" color={Colors.textTertiary}>কনফার্ম</T>
            <T size="xl" weight="bold" color={Colors.accent}>{orders.filter((o) => o.status === 'confirmed').length}</T>
          </Card>
          <Card style={{ flex: 1, minWidth: 0 }}>
            <T size="xs" color={Colors.textTertiary}>ডেলিভার্ড</T>
            <T size="xl" weight="bold" color={Colors.success}>{orders.filter((o) => o.status === 'delivered').length}</T>
          </Card>
        </Row>

        {/* Status filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.sm }}>
          <Row gap={Spacing.xs} style={{ paddingRight: Spacing.base }}>
            {STATUS_FILTERS.map((f) => (
              <Chip
                key={f.key}
                label={f.label}
                active={statusFilter === f.key}
                onPress={() => setStatusFilter(f.key)}
              />
            ))}
          </Row>
        </ScrollView>

        {/* Source filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.sm }}>
          <Row gap={Spacing.xs} style={{ paddingRight: Spacing.base }}>
            {SOURCE_FILTERS.map((f) => (
              <Chip
                key={f.key}
                label={f.label}
                active={sourceFilter === f.key}
                onPress={() => setSourceFilter(f.key)}
              />
            ))}
          </Row>
        </ScrollView>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.base }}>
          <Row gap={Spacing.xs} style={{ paddingRight: Spacing.base }}>
            {categoryFilters.map((f) => (
              <Chip
                key={f.key}
                label={f.label}
                active={categoryFilter === f.key}
                onPress={() => setCategoryFilter(f.key)}
              />
            ))}
          </Row>
        </ScrollView>

        <SectionHeader title={`অর্ডার তালিকা (${filtered.length})`} />
        {filtered.length === 0 && (
          <Card style={{ marginBottom: Spacing.sm }}>
            <T size="sm" color={Colors.textTertiary} style={{ textAlign: 'center' }}>কোনো অর্ডার পাওয়া যায়নি</T>
          </Card>
        )}
        {filtered.map((order) => {
          const st = statusLabel[order.status];
          return (
            <Card
              key={order.id}
              onPress={() => setSelected(selected?.id === order.id ? null : order)}
              style={{ marginBottom: Spacing.sm }}
              padding={Spacing.md}
            >
              <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
                <Row gap={Spacing.sm}>
                  {sourceIcon(order.source)}
                  <T size="sm" weight="bold">{order.id}</T>
                </Row>
                <StatusPill label={st.label} type={st.type} />
              </Row>
              <T size="sm" weight="medium">{order.customer}</T>
              <Row gap={Spacing.sm} style={{ marginTop: Spacing.xs }}>
                <T size="xs" color={Colors.textSecondary}>{order.items}</T>
                <View style={styles.categoryTag}>
                  <T size="xs" color={Colors.primary}>{order.category}</T>
                </View>
              </Row>
              <Row justify="space-between" style={{ marginTop: Spacing.sm }}>
                <T size="sm" weight="bold" color={Colors.primary}>{bnTaka(order.amount)}</T>
                <T size="xs" color={Colors.textTertiary}>{order.date}</T>
              </Row>
              {selected?.id === order.id && (
                <View style={{ marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border }}>
                  <T size="sm" color={Colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
                    📞 {order.phone}
                  </T>
                  {order.status === 'pending' && (
                    <Btn label="অর্ডার কনফার্ম করুন" onPress={() => confirmOrder(order.id)} fullWidth />
                  )}
                </View>
              )}
            </Card>
          );
        })}
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
  <ScreenFrame>
    <AppHeader showGreeting />
    <ScreenScroll>
      <HeroCard
        title="📦 গ্রোথ ড্যাশবোর্ড"
        metric="৩"
        metricLabel="সক্রিয় অর্ডার"
        stats={[
          { label: 'কম স্টক', value: '১ ⚠️' },
          { label: 'কুরিয়ারে', value: '২ 🛵' },
        ]}
      />
      <FeatureToolsSection layout="grid" scope="all" />
    </ScreenScroll>
  </ScreenFrame>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  categoryTag: {
    backgroundColor: Colors.primaryLight ?? Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
});
