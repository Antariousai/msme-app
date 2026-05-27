import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, Btn, ScreenScroll, StatCard, SectionHeader, Input, StatusPill, BtnRow } from '../../components/atoms';
import { Colors, Spacing, Radius } from '../../theme';
import { BookIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from '../../icons';
import { seedTransactions, Transaction, TransactionType } from '../../data/seed';
import { bnTaka, toBn, generateId } from '../../utils/helpers';

export const BookkeepingScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const profit = income - expense;

  const addTransaction = () => {
    if (!amount || !category) return;
    const newTx: Transaction = {
      id: generateId(),
      type: formType,
      amount: parseFloat(amount),
      category,
      note,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions([newTx, ...transactions]);
    setModalVisible(false);
    setAmount('');
    setCategory('');
    setNote('');
  };

  const openAdd = (type: TransactionType) => {
    setFormType(type);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="হিসাব রক্ষা" subtitle="আয় ও ব্যয় লিখুন" />
      <ScreenScroll>
        <Row gap={Spacing.sm} style={{ marginBottom: Spacing.base }}>
          <StatCard label="মোট আয়" value={bnTaka(income)} color={Colors.success} icon={<ArrowUpIcon size={16} color={Colors.success} />} />
          <StatCard label="মোট ব্যয়" value={bnTaka(expense)} color={Colors.error} icon={<ArrowDownIcon size={16} color={Colors.error} />} />
        </Row>
        <Card style={{ marginBottom: Spacing.base, backgroundColor: profit >= 0 ? Colors.successLight : Colors.errorLight }}>
          <T size="sm" color={Colors.textSecondary}>নিট লাভ</T>
          <T size="2xl" weight="bold" color={profit >= 0 ? Colors.success : Colors.error}>{bnTaka(profit)}</T>
        </Card>

        <BtnRow style={{ marginBottom: Spacing.xl }}>
          <Btn label="আয় যোগ" onPress={() => openAdd('income')} variant="secondary" flex icon={<PlusIcon size={16} color={Colors.textInverse} />} />
          <Btn label="ব্যয় যোগ" onPress={() => openAdd('expense')} variant="danger" flex icon={<PlusIcon size={16} color={Colors.textInverse} />} />
        </BtnRow>

        <SectionHeader title="লেনদেন" />
        {transactions.map((tx) => (
          <Card key={tx.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
            <Row justify="space-between">
              <Row gap={Spacing.sm}>
                <View style={[styles.txIcon, { backgroundColor: tx.type === 'income' ? Colors.successLight : Colors.errorLight }]}>
                  {tx.type === 'income'
                    ? <ArrowUpIcon size={16} color={Colors.success} />
                    : <ArrowDownIcon size={16} color={Colors.error} />}
                </View>
                <View>
                  <T size="sm" weight="semibold">{tx.category}</T>
                  <T size="xs" color={Colors.textTertiary}>{tx.note || '—'}</T>
                </View>
              </Row>
              <View style={{ alignItems: 'flex-end' }}>
                <T size="sm" weight="bold" color={tx.type === 'income' ? Colors.success : Colors.error}>
                  {tx.type === 'income' ? '+' : '-'}{bnTaka(tx.amount)}
                </T>
                <T size="xs" color={Colors.textTertiary}>{tx.date}</T>
              </View>
            </Row>
          </Card>
        ))}
      </ScreenScroll>

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <T size="lg" weight="bold" style={{ marginBottom: Spacing.base }}>
              {formType === 'income' ? 'আয় যোগ করুন' : 'ব্যয় যোগ করুন'}
            </T>
            <Input label="পরিমাণ (৳)" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="০" style={{ marginBottom: Spacing.md }} />
            <Input label="ক্যাটাগরি" value={category} onChangeText={setCategory} placeholder="যেমন: বিক্রয়, কাঁচামাল" style={{ marginBottom: Spacing.md }} />
            <Input label="নোট (ঐচ্ছিক)" value={note} onChangeText={setNote} placeholder="বিবরণ" style={{ marginBottom: Spacing.xl }} />
            <Btn label="সংরক্ষণ" onPress={addTransaction} fullWidth variant={formType === 'income' ? 'secondary' : 'danger'} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

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
        আপনার ব্যবসার দৈনিক আয়-ব্যয় লিখে রাখুন। হিসাব ট্যাবে যান।
      </T>
      <Card>
        <T size="sm" weight="semibold" style={{ marginBottom: Spacing.sm }}>দ্রুত কাজ</T>
        <T size="sm" color={Colors.textSecondary}>• আয় যোগ করুন</T>
        <T size="sm" color={Colors.textSecondary}>• ব্যয় যোগ করুন</T>
        <T size="sm" color={Colors.textSecondary}>• মাসিক সারাংশ দেখুন</T>
      </Card>
    </ScreenScroll>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  txIcon: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'], padding: Spacing.xl },
});
