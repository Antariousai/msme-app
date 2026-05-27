import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatusPill, Btn, Input } from '../../components/atoms';
import { Colors, Spacing, Radius } from '../../theme';
import { InventoryIcon, PlusIcon, ArrowDownIcon } from '../../icons';
import { seedInventory, seedCouriers, InventoryItem } from '../../data/seed';
import { toBn } from '../../utils/helpers';

export const InventoryScreen = () => {
  const [items, setItems] = useState<InventoryItem[]>(seedInventory);
  const [modalVisible, setModalVisible] = useState(false);
  const [inflowName, setInflowName] = useState('');
  const [inflowQty, setInflowQty] = useState('');

  const addInflow = () => {
    if (!inflowName || !inflowQty) return;
    const qty = parseInt(inflowQty, 10);
    setItems((prev) => prev.map((item) =>
      item.name === inflowName ? { ...item, stock: item.stock + qty, lastInflow: 'আজ' } : item
    ));
    setModalVisible(false);
    setInflowName('');
    setInflowQty('');
  };

  const lowStock = items.filter((i) => i.stock <= i.minStock);

  return (
    <View style={styles.container}>
      <AppHeader title="ইনভেন্টরি" subtitle="ম্যানুয়াল ইনফ্লো · অটো আউটফ্লো" />
      <ScreenScroll>
        {lowStock.length > 0 && (
          <Card style={{ marginBottom: Spacing.base, backgroundColor: Colors.warningLight }}>
            <T size="sm" weight="semibold" color={Colors.warning}>কম স্টক সতর্কতা</T>
            <T size="xs" color={Colors.textSecondary}>
              {lowStock.map((i) => i.name).join(', ')} — স্টক রিফিল করুন
            </T>
          </Card>
        )}

        <Btn
          label="ইনফ্লো যোগ (স্টক আনা)"
          onPress={() => setModalVisible(true)}
          fullWidth
          icon={<PlusIcon size={16} color={Colors.textInverse} />}
          style={{ marginBottom: Spacing.base }}
        />

        <SectionHeader title="পণ্য তালিকা" />
        {items.map((item) => {
          const isLow = item.stock <= item.minStock;
          return (
            <Card key={item.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
              <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
                <T size="sm" weight="semibold">{item.name}</T>
                {isLow && <StatusPill label="কম স্টক" type="warning" />}
              </Row>
              <Row justify="space-between">
                <T size="xs" color={Colors.textTertiary}>SKU: {item.sku}</T>
                <T size="sm" weight="bold" color={isLow ? Colors.warning : Colors.textPrimary}>
                  {toBn(item.stock)} {item.unit}
                </T>
              </Row>
              <T size="xs" color={Colors.textTertiary} style={{ marginTop: Spacing.xs }}>
                শেষ ইনফ্লো: {item.lastInflow} · মিন. {toBn(item.minStock)}
              </T>
              <Row gap={Spacing.xs} style={{ marginTop: Spacing.sm }}>
                <ArrowDownIcon size={12} color={Colors.textTertiary} />
                <T size="xs" color={Colors.textTertiary}>অর্ডার কনফার্ম হলে স্বয়ংক্রিয় আউটফ্লো</T>
              </Row>
            </Card>
          );
        })}
      </ScreenScroll>

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <T size="lg" weight="bold" style={{ marginBottom: Spacing.base }}>স্টক ইনফ্লো</T>
            <Input label="পণ্যের নাম" value={inflowName} onChangeText={setInflowName} placeholder="যেমন: কটন কুর্তি" style={{ marginBottom: Spacing.md }} />
            <Input label="পরিমাণ" value={inflowQty} onChangeText={setInflowQty} keyboardType="numeric" placeholder="০" style={{ marginBottom: Spacing.xl }} />
            <Btn label="যোগ করুন" onPress={addInflow} fullWidth />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export const CourierScreen = () => (
    <View style={styles.container}>
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
    </View>
  );

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'], padding: Spacing.xl },
});
