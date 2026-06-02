import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatusPill, Btn, Input, Chip } from '../../components/atoms';
import { Colors, Spacing, Radius } from '../../theme';
import { seedInventory, seedCouriers, InventoryItem, INVENTORY_CATEGORIES } from '../../data/seed';
import { toBn } from '../../utils/helpers';
import { ScreenFrame } from '../../components/ScreenFrame';
import { useAuth } from '../../auth/AuthContext';

export const InventoryScreen = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>(seedInventory);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Form fields
  const [inflowName, setInflowName] = useState('');
  const [inflowQty, setInflowQty] = useState('');
  const [inflowCategory, setInflowCategory] = useState(INVENTORY_CATEGORIES[0]);
  const [inflowSku, setInflowSku] = useState('');

  const isAdvanced = (user?.tier ?? 0) >= 2;
  const lowStock = items.filter((i) => i.stock <= i.minStock);

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return items;
    return items.filter((i) => i.category === categoryFilter);
  }, [items, categoryFilter]);

  const categories = useMemo(() => {
    const used = [...new Set(items.map((i) => i.category))];
    return used;
  }, [items]);

  const addInflow = () => {
    if (!inflowName || !inflowQty) return;
    const qty = parseInt(inflowQty, 10);
    const existing = items.find((i) => i.name === inflowName);
    if (existing) {
      setItems((prev) => prev.map((item) =>
        item.name === inflowName ? { ...item, stock: item.stock + qty, lastInflow: 'আজ' } : item
      ));
    } else {
      const newItem: InventoryItem = {
        id: `i${Date.now()}`,
        name: inflowName,
        sku: inflowSku || `SKU-${Date.now()}`,
        category: inflowCategory,
        stock: qty,
        minStock: 5,
        unit: 'পিস',
        lastInflow: 'আজ',
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setModalVisible(false);
    setInflowName('');
    setInflowQty('');
    setInflowSku('');
    setInflowCategory(INVENTORY_CATEGORIES[0]);
  };

  return (
    <ScreenFrame>
      <AppHeader
        title="পণ্য মজুদ"
        subtitle={isAdvanced ? 'ম্যানুয়াল ইনফ্লো · অটো আউটফ্লো' : 'স্টক ট্র্যাকিং'}
      />
      <ScreenScroll>
        {lowStock.length > 0 && (
          <Card style={{ marginBottom: Spacing.base, backgroundColor: Colors.warningLight }}>
            <T size="sm" weight="semibold" color={Colors.warning}>⚠️ কম স্টক সতর্কতা</T>
            <T size="xs" color={Colors.textSecondary}>
              {lowStock.map((i) => i.name).join(', ')} — স্টক রিফিল করুন
            </T>
          </Card>
        )}

        <Btn
          label="📥 স্টক যোগ করুন"
          onPress={() => setModalVisible(true)}
          fullWidth
          style={{ marginBottom: Spacing.base }}
        />

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.base }}>
          <Row gap={Spacing.xs} style={{ paddingRight: Spacing.base }}>
            <Chip label="সব" active={categoryFilter === 'all'} onPress={() => setCategoryFilter('all')} />
            {categories.map((cat) => (
              <Chip key={cat} label={cat} active={categoryFilter === cat} onPress={() => setCategoryFilter(cat)} />
            ))}
          </Row>
        </ScrollView>

        <SectionHeader title={`পণ্য তালিকা (${filtered.length})`} />
        {filtered.map((item) => {
          const isLow = item.stock <= item.minStock;
          return (
            <Card key={item.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
              <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <T size="sm" weight="semibold">{item.name}</T>
                  <View style={styles.categoryTag}>
                    <T size="xs" color={Colors.primary}>{item.category}</T>
                  </View>
                </View>
                {isLow
                  ? <StatusPill label="কম স্টক" type="warning" />
                  : <StatusPill label="পর্যাপ্ত" type="success" />
                }
              </Row>
              <Row justify="space-between">
                <T size="xs" color={Colors.textTertiary}>SKU: {item.sku}</T>
                <T size="sm" weight="bold" color={isLow ? Colors.warning : Colors.textPrimary}>
                  {toBn(item.stock)} {item.unit}
                </T>
              </Row>
              <T size="xs" color={Colors.textTertiary} style={{ marginTop: Spacing.xs }}>
                শেষ আপডেট: {item.lastInflow} · সর্বনিম্ন: {toBn(item.minStock)}
              </T>
              {isAdvanced && (
                <T size="xs" color={Colors.textTertiary} style={{ marginTop: Spacing.xs }}>
                  📦 অর্ডার কনফার্ম হলে স্বয়ংক্রিয় আউটফ্লো
                </T>
              )}
            </Card>
          );
        })}
      </ScreenScroll>

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <T size="lg" weight="bold" style={{ marginBottom: Spacing.base }}>📥 স্টক যোগ</T>
            <Input label="পণ্যের নাম" value={inflowName} onChangeText={setInflowName} placeholder="যেমন: কটন কুর্তি" style={{ marginBottom: Spacing.md }} />
            <Input label="SKU (ঐচ্ছিক)" value={inflowSku} onChangeText={setInflowSku} placeholder="যেমন: KT-001" style={{ marginBottom: Spacing.md }} />
            <T size="sm" weight="medium" style={{ marginBottom: Spacing.sm }}>ক্যাটাগরি</T>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
              <Row gap={Spacing.xs}>
                {INVENTORY_CATEGORIES.map((cat) => (
                  <Chip key={cat} label={cat} active={inflowCategory === cat} onPress={() => setInflowCategory(cat)} />
                ))}
              </Row>
            </ScrollView>
            <Input label="পরিমাণ" value={inflowQty} onChangeText={setInflowQty} keyboardType="numeric" placeholder="০" style={{ marginBottom: Spacing.xl }} />
            <Btn label="যোগ করুন" onPress={addInflow} fullWidth />
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenFrame>
  );
};

export const CourierScreen = () => (
  <ScreenFrame>
    <AppHeader title="কুরিয়ার" subtitle="Pathao · RedX · Steadfast" />
    <ScreenScroll>
      <SectionHeader title="শিপমেন্ট" />
      {seedCouriers.map((s) => (
        <Card key={s.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
          <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
            <T size="sm" weight="bold">{s.courier}</T>
            <StatusPill
              label={s.status === 'pending' ? 'অপেক্ষমাণ' : s.status === 'in_transit' ? 'ট্রানজিট' : s.status === 'delivered' ? 'ডেলিভার্ড' : 'পিকআপ'}
              type={s.status === 'delivered' ? 'success' : s.status === 'in_transit' ? 'info' : 'warning'}
            />
          </Row>
          <T size="sm">{s.customer}</T>
          <T size="xs" color={Colors.textTertiary}>অর্ডার: {s.orderId} · {s.trackingId}</T>
        </Card>
      ))}
    </ScreenScroll>
  </ScreenFrame>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'], padding: Spacing.xl },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight ?? Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    marginTop: 2,
  },
});
