import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
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

const STATUS_OPTIONS = [
  { key: 'all',       label: 'সব' },
  { key: 'pending',   label: 'অপেক্ষমাণ' },
  { key: 'confirmed', label: 'কনফার্ম' },
  { key: 'shipped',   label: 'পাঠানো' },
  { key: 'delivered', label: 'ডেলিভার্ড' },
] as const;

const SOURCE_OPTIONS = [
  { key: 'all',       label: 'সব চ্যানেল' },
  { key: 'facebook',  label: '👍 ফেসবুক' },
  { key: 'instagram', label: '📸 ইনস্টাগ্রাম' },
  { key: 'website',   label: '🌐 ওয়েবসাইট' },
] as const;

const statusLabel: Record<Order['status'], { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = {
  pending:   { label: 'অপেক্ষমাণ', type: 'warning' },
  confirmed: { label: 'কনফার্ম', type: 'info' },
  shipped:   { label: 'পাঠানো', type: 'info' },
  delivered: { label: 'ডেলিভার্ড', type: 'success' },
};

// ─── Filter Sheet ──────────────────────────────────────────────────────────────

interface FilterState {
  status: string;
  source: string;
  category: string;
}

const EMPTY_FILTER: FilterState = { status: 'all', source: 'all', category: 'all' };

const FilterSheet = ({
  visible,
  current,
  onClose,
  onApply,
}: {
  visible: boolean;
  current: FilterState;
  onClose: () => void;
  onApply: (f: FilterState) => void;
}) => {
  const [draft, setDraft] = useState<FilterState>(current);

  const categoryOptions = [{ key: 'all', label: 'সব' }, ...ORDER_CATEGORIES.map((c) => ({ key: c, label: c }))];

  const handleOpen = () => setDraft(current);

  return (
    <Modal visible={visible} transparent animationType="slide" onShow={handleOpen}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>

          {/* Header */}
          <Row justify="space-between" align="center" style={{ marginBottom: Spacing.lg }}>
            <T size="lg" weight="bold">⚙ ফিল্টার</T>
            <Pressable onPress={() => { setDraft(EMPTY_FILTER); }} hitSlop={8}>
              <T size="sm" color={Colors.primary}>ক্লিয়ার সব</T>
            </Pressable>
          </Row>

          {/* Status */}
          <T size="xs" weight="semibold" color={Colors.textTertiary} style={styles.filterLabel}>স্ট্যাটাস</T>
          <Row gap={Spacing.xs} wrap style={{ marginBottom: Spacing.lg }}>
            {STATUS_OPTIONS.map((o) => (
              <Chip key={o.key} label={o.label} active={draft.status === o.key} onPress={() => setDraft((d) => ({ ...d, status: o.key }))} />
            ))}
          </Row>

          {/* Source */}
          <T size="xs" weight="semibold" color={Colors.textTertiary} style={styles.filterLabel}>চ্যানেল</T>
          <Row gap={Spacing.xs} wrap style={{ marginBottom: Spacing.lg }}>
            {SOURCE_OPTIONS.map((o) => (
              <Chip key={o.key} label={o.label} active={draft.source === o.key} onPress={() => setDraft((d) => ({ ...d, source: o.key }))} />
            ))}
          </Row>

          {/* Category */}
          <T size="xs" weight="semibold" color={Colors.textTertiary} style={styles.filterLabel}>ক্যাটাগরি</T>
          <Row gap={Spacing.xs} wrap style={{ marginBottom: Spacing.xl }}>
            {categoryOptions.map((o) => (
              <Chip key={o.key} label={o.label} active={draft.category === o.key} onPress={() => setDraft((d) => ({ ...d, category: o.key }))} />
            ))}
          </Row>

          <Btn label="প্রয়োগ করুন" onPress={() => { onApply(draft); onClose(); }} fullWidth />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ─── Active filter pill (dismissable) ─────────────────────────────────────────

const ActivePill = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <Pressable style={styles.activePill} onPress={onRemove}>
    <T size="xs" color={Colors.primary} weight="semibold">{label}</T>
    <T size="xs" color={Colors.primary} style={{ marginLeft: 3 }}>✕</T>
  </Pressable>
);

// ─── Orders Screen ─────────────────────────────────────────────────────────────

export const OrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER);

  const confirmOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'confirmed' as const } : o));
    setSelected(null);
  };

  const filtered = useMemo(() => orders.filter((o) => {
    if (filters.status !== 'all' && o.status !== filters.status) return false;
    if (filters.source !== 'all' && o.source !== filters.source) return false;
    if (filters.category !== 'all' && o.category !== filters.category) return false;
    return true;
  }), [orders, filters]);

  const activeCount = [filters.status, filters.source, filters.category].filter((v) => v !== 'all').length;

  const activeLabels = useMemo(() => {
    const pills: { key: keyof FilterState; label: string }[] = [];
    if (filters.status !== 'all')   pills.push({ key: 'status',   label: STATUS_OPTIONS.find((o) => o.key === filters.status)?.label ?? filters.status });
    if (filters.source !== 'all')   pills.push({ key: 'source',   label: SOURCE_OPTIONS.find((o) => o.key === filters.source)?.label ?? filters.source });
    if (filters.category !== 'all') pills.push({ key: 'category', label: filters.category });
    return pills;
  }, [filters]);

  return (
    <View style={styles.container}>
      <AppHeader title="অর্ডার" subtitle={`${filtered.length}টি দেখাচ্ছে`} />
      <ScreenScroll>

        {/* Summary cards */}
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

        {/* Filter bar */}
        <Row justify="space-between" align="center" style={{ marginBottom: Spacing.sm }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            <Row gap={Spacing.xs} style={{ paddingRight: Spacing.sm }}>
              {activeLabels.length === 0 && (
                <T size="xs" color={Colors.textTertiary}>কোনো ফিল্টার নেই</T>
              )}
              {activeLabels.map((p) => (
                <ActivePill
                  key={p.key}
                  label={p.label}
                  onRemove={() => setFilters((f) => ({ ...f, [p.key]: 'all' }))}
                />
              ))}
            </Row>
          </ScrollView>
          <Pressable
            onPress={() => setFilterOpen(true)}
            style={[styles.filterBtn, activeCount > 0 && styles.filterBtnActive]}
          >
            <T size="sm" color={activeCount > 0 ? '#fff' : Colors.primary}>⚙</T>
            <T size="sm" weight="semibold" color={activeCount > 0 ? '#fff' : Colors.primary} style={{ marginLeft: 4 }}>
              ফিল্টার{activeCount > 0 ? ` (${activeCount})` : ''}
            </T>
          </Pressable>
        </Row>

        {/* Order list */}
        <SectionHeader title={`অর্ডার তালিকা (${filtered.length})`} />
        {filtered.length === 0 && (
          <Card style={{ marginBottom: Spacing.sm }}>
            <T size="sm" color={Colors.textTertiary} style={{ textAlign: 'center' }}>কোনো অর্ডার পাওয়া যায়নি</T>
          </Card>
        )}
        {filtered.map((order) => {
          const st = statusLabel[order.status];
          const isOpen = selected?.id === order.id;
          return (
            <Card
              key={order.id}
              onPress={() => setSelected(isOpen ? null : order)}
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
              <Row gap={Spacing.sm} align="center" style={{ marginTop: Spacing.xs }}>
                <T size="xs" color={Colors.textSecondary}>{order.items}</T>
                <View style={styles.categoryTag}>
                  <T size="xs" color={Colors.primary}>{order.category}</T>
                </View>
              </Row>
              <Row justify="space-between" style={{ marginTop: Spacing.sm }}>
                <T size="sm" weight="bold" color={Colors.primary}>{bnTaka(order.amount)}</T>
                <T size="xs" color={Colors.textTertiary}>{order.date}</T>
              </Row>
              {isOpen && (
                <View style={styles.expandedDetail}>
                  <T size="sm" color={Colors.textSecondary} style={{ marginBottom: Spacing.sm }}>📞 {order.phone}</T>
                  {order.status === 'pending' && (
                    <Btn label="অর্ডার কনফার্ম করুন" onPress={() => confirmOrder(order.id)} fullWidth />
                  )}
                </View>
              )}
            </Card>
          );
        })}
      </ScreenScroll>

      <FilterSheet
        visible={filterOpen}
        current={filters}
        onClose={() => setFilterOpen(false)}
        onApply={setFilters}
      />
    </View>
  );
};

// ─── Website & Tier 2 Home ─────────────────────────────────────────────────────

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
  container:      { flex: 1, backgroundColor: Colors.bg },
  overlay:        { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    padding: Spacing.xl,
    paddingBottom: Spacing.xl + 8,
  },
  filterLabel:    { marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginLeft: Spacing.sm,
    flexShrink: 0,
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  categoryTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  expandedDetail: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
