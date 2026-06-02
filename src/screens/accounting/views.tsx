import React, { useState } from 'react';
import { View, Modal, Pressable, StyleSheet } from 'react-native';
import { T, Card, Row, Btn, SectionHeader, Input, StatusPill, AISuggestion } from '../../components/atoms';
import { RipplePressable } from '../../components/motion';
import { Colors, Spacing, Radius, Shadow } from '../../theme';
import { Transaction, SimpleStockItem, aiSuggestions } from '../../data/seed';
import { bnTaka, toBn } from '../../utils/helpers';

export const TransactionList = ({ transactions }: { transactions: Transaction[] }) => (
  <View>
    {transactions.map((tx) => {
      const isUp = tx.type === 'income';
      return (
        <RipplePressable
          key={tx.id}
          effect="slideX"
          rippleRadius={Radius.lg}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.md,
            backgroundColor: Colors.surface,
            borderRadius: Radius.lg,
            padding: Spacing.base,
            marginBottom: Spacing.sm,
            ...Shadow.card,
          }}
        >
          <View style={[styles.txIcon, {
            backgroundColor: isUp ? Colors.incomeSoft : Colors.expenseSoft,
          }]}>
            <T size="md">{isUp ? '🧵' : '🛵'}</T>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <T size="sm" weight="bold" numberOfLines={1}>{tx.product || tx.category}</T>
            <T size="xs" color={Colors.textSecondary} numberOfLines={1}>
              {tx.category}{tx.note ? ` · ${tx.note}` : ''}
            </T>
          </View>
          <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
            <T size="sm" weight="bold" color={isUp ? Colors.income : Colors.expense}>
              {isUp ? '+' : '-'}{bnTaka(tx.amount)}
            </T>
            <T size="xs" color={Colors.textSecondary}>{tx.date}</T>
          </View>
        </RipplePressable>
      );
    })}
  </View>
);

/** Simplified double-entry journal derived from transactions */
export const JournalView = ({ transactions }: { transactions: Transaction[] }) => (
  <View>
    <T size="xs" color={Colors.textTertiary} style={{ marginBottom: Spacing.sm }}>
      প্রতিটি লেনদেন ডেবিট/ক্রেডিট আকারে — হিসাবের খাতা
    </T>
    {transactions.map((tx) => {
      const debit = tx.type === 'income' ? 'নগদ' : tx.category;
      const credit = tx.type === 'income' ? (tx.product || tx.category) : 'নগদ';
      return (
        <Card key={tx.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
          <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
            <T size="xs" color={Colors.textTertiary}>{tx.date}</T>
            <T size="sm" weight="bold">{bnTaka(tx.amount)}</T>
          </Row>
          <Row justify="space-between">
            <T size="xs" color={Colors.textSecondary}>ডেবিট: {debit}</T>
            <T size="xs" color={Colors.textSecondary}>ক্রেডিট: {credit}</T>
          </Row>
        </Card>
      );
    })}
  </View>
);

/** Simplified balance/position statement */
export const BalanceSheetView = ({ income, expense }: { income: number; expense: number }) => {
  const net = income - expense;
  const row = (label: string, value: number, color = Colors.textPrimary) => (
    <Row justify="space-between" style={{ marginBottom: Spacing.sm }}>
      <T size="sm" color={Colors.textSecondary}>{label}</T>
      <T size="sm" weight="bold" color={color}>{bnTaka(value)}</T>
    </Row>
  );
  return (
    <View>
      <Card style={{ marginBottom: Spacing.base }}>
        <SectionHeader title="সম্পদ (Assets)" />
        {row('চলতি নগদ (বিক্রয়)', income, Colors.success)}
      </Card>
      <Card style={{ marginBottom: Spacing.base }}>
        <SectionHeader title="ব্যয় ও দায় (Outflow)" />
        {row('মোট ব্যয়', expense, Colors.error)}
      </Card>
      <Card style={{ backgroundColor: net >= 0 ? Colors.successLight : Colors.errorLight }}>
        <Row justify="space-between">
          <T size="md" weight="bold">নিট মূলধন</T>
          <T size="lg" weight="bold" color={net >= 0 ? Colors.success : Colors.error}>{bnTaka(net)}</T>
        </Row>
      </Card>
    </View>
  );
};

export const InsightsView = ({
  income, expense, onExport, exporting,
}: { income: number; expense: number; onExport: () => void; exporting: boolean }) => {
  const margin = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
  return (
    <View>
      <Card style={{ marginBottom: Spacing.base }}>
        <T size="sm" color={Colors.textSecondary}>লাভ মার্জিন</T>
        <T size="2xl" weight="bold" color={margin >= 0 ? Colors.success : Colors.error}>{toBn(margin)}%</T>
      </Card>
      <SectionHeader title="আর্থিক পরামর্শ" />
      {aiSuggestions.finance.map((s, i) => (
        <View key={i} style={{ marginBottom: Spacing.sm }}>
          <AISuggestion title={s.title} message={s.message} />
        </View>
      ))}
      <SectionHeader title="ব্যবসা পারফরম্যান্স" />
      {aiSuggestions.performance.map((s, i) => (
        <View key={i} style={{ marginBottom: Spacing.sm }}>
          <AISuggestion title={s.title} message={s.message} />
        </View>
      ))}
      <Btn
        label="⬇️ রিপোর্ট এক্সপোর্ট করুন"
        onPress={onExport}
        loading={exporting}
        fullWidth
        style={{ marginTop: Spacing.sm }}
      />
    </View>
  );
};

/** Tier 0 simple offline stock with purchase price */
export const SimpleStockSection = ({
  items, onAdd,
}: { items: SimpleStockItem[]; onAdd: (item: Omit<SimpleStockItem, 'id'>) => void }) => {
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  const save = () => {
    if (!name || !quantity) return;
    onAdd({
      category: category || 'সাধারণ',
      name,
      quantity: parseInt(quantity, 10) || 0,
      purchasePrice: parseFloat(purchasePrice) || 0,
    });
    setVisible(false);
    setCategory(''); setName(''); setQuantity(''); setPurchasePrice('');
  };

  return (
    <View style={{ marginTop: Spacing.base }}>
      <SectionHeader title="পণ্য মজুদ" action="যোগ করুন" onAction={() => setVisible(true)} />
      {items.length === 0 && <T size="sm" color={Colors.textTertiary}>এখনো কোনো পণ্য যোগ করা হয়নি।</T>}
      {items.map((it) => (
        <Card key={it.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
          <Row justify="space-between">
            <View style={{ flex: 1, minWidth: 0 }}>
              <T size="sm" weight="semibold" numberOfLines={1}>{it.name}</T>
              <T size="xs" color={Colors.textTertiary}>{it.category} · ক্রয় {bnTaka(it.purchasePrice)}</T>
            </View>
            <StatusPill label={`${toBn(it.quantity)} টি`} type="info" />
          </Row>
        </Card>
      ))}

      <Modal visible={visible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <T size="lg" weight="bold" style={{ marginBottom: Spacing.base }}>পণ্য যোগ করুন</T>
            <Input label="ক্যাটাগরি" value={category} onChangeText={setCategory} placeholder="যেমন: পোশাক" style={{ marginBottom: Spacing.md }} />
            <Input label="পণ্যের নাম" value={name} onChangeText={setName} placeholder="যেমন: কটন কুর্তি" style={{ marginBottom: Spacing.md }} />
            <Input label="পরিমাণ" value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="০" style={{ marginBottom: Spacing.md }} />
            <Input label="ক্রয়মূল্য (৳)" value={purchasePrice} onChangeText={setPurchasePrice} keyboardType="numeric" placeholder="০" style={{ marginBottom: Spacing.xl }} />
            <Btn label="সংরক্ষণ" onPress={save} fullWidth />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

/** Tier 0 NGO report — generate + send weekly/monthly summary */
export const NGOReportCard = ({
  onSend, sending,
}: { onSend: (period: 'weekly' | 'monthly') => void; sending: boolean }) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  return (
    <Card style={{ marginTop: Spacing.base }}>
      <Row gap={Spacing.md} style={{ marginBottom: Spacing.sm }}>
        <T size="xl">📤</T>
        <View style={{ flex: 1, minWidth: 0 }}>
          <T size="sm" weight="bold">NGO রিপোর্ট</T>
          <T size="xs" color={Colors.textTertiary}>সাপ্তাহিক/মাসিক হিসাব তৈরি ও পাঠান</T>
        </View>
      </Row>
      <Row gap={Spacing.sm} wrap style={{ marginBottom: Spacing.md }}>
        <Btn label="সাপ্তাহিক" onPress={() => setPeriod('weekly')} size="sm" variant={period === 'weekly' ? 'primary' : 'outline'} />
        <Btn label="মাসিক" onPress={() => setPeriod('monthly')} size="sm" variant={period === 'monthly' ? 'primary' : 'outline'} />
      </Row>
      <Btn
        label="📤 রিপোর্ট তৈরি ও পাঠান"
        onPress={() => onSend(period)}
        loading={sending}
        fullWidth
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  txIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'], padding: Spacing.xl },
});
