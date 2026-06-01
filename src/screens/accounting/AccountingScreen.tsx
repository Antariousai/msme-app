import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, Btn, ScreenScroll, StatCard, Input, BtnRow, Chip } from '../../components/atoms';
import { Colors, Spacing, Radius } from '../../theme';
import { PlusIcon, ArrowUpIcon, ArrowDownIcon } from '../../icons';
import { seedTransactions, seedSimpleStock, Transaction, SimpleStockItem, TransactionType } from '../../data/seed';
import { bnTaka, generateId } from '../../utils/helpers';
import { useAuth } from '../../auth/AuthContext';
import { buildBusinessReport, shareReport, periodLabel, ReportPeriod } from '../../utils/report';
import {
  TransactionList, JournalView, BalanceSheetView, InsightsView, SimpleStockSection, NGOReportCard,
} from './views';

type AccountView = 'entry' | 'journal' | 'balance' | 'insights';

const VIEW_TABS: { id: AccountView; label: string }[] = [
  { id: 'entry', label: 'লেনদেন' },
  { id: 'journal', label: 'জার্নাল' },
  { id: 'balance', label: 'ব্যালেন্স শিট' },
  { id: 'insights', label: 'বিশ্লেষণ' },
];

export const AccountingScreen = () => {
  const { user } = useAuth();
  const tier = user?.tier ?? 0;
  const isFull = tier >= 1;

  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [stock, setStock] = useState<SimpleStockItem[]>(seedSimpleStock);
  const [view, setView] = useState<AccountView>('entry');

  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');
  const [busy, setBusy] = useState(false);

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const profit = income - expense;

  const openAdd = (type: TransactionType) => {
    setFormType(type);
    setModalVisible(true);
  };

  const addTransaction = () => {
    if (!amount || !category) return;
    const newTx: Transaction = {
      id: generateId(),
      type: formType,
      amount: parseFloat(amount),
      category,
      product: product || undefined,
      note: '',
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions([newTx, ...transactions]);
    setModalVisible(false);
    setAmount(''); setCategory(''); setProduct('');
  };

  const exportReport = async (period: ReportPeriod, recipient?: string) => {
    setBusy(true);
    const content = buildBusinessReport({
      businessName: user?.businessName ?? 'আমার ব্যবসা',
      period,
      income,
      expense,
      recipient,
      breakdown: [
        { label: 'মোট আয়', amount: income },
        { label: 'মোট ব্যয়', amount: expense },
      ],
    });
    await shareReport(`${periodLabel(period)}-report`, content);
    setBusy(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="হিসাব রক্ষা" subtitle={isFull ? 'হিসাব · জার্নাল · বিশ্লেষণ' : 'আয় ও ব্যয় লিখুন'} />
      <ScreenScroll>
        <Row gap={Spacing.sm} style={{ marginBottom: Spacing.sm }}>
          <StatCard label="মোট আয়" value={bnTaka(income)} color={Colors.success} icon={<ArrowUpIcon size={16} color={Colors.success} />} />
          <StatCard label="মোট ব্যয়" value={bnTaka(expense)} color={Colors.error} icon={<ArrowDownIcon size={16} color={Colors.error} />} />
        </Row>
        <Card style={{ marginBottom: Spacing.base, backgroundColor: profit >= 0 ? Colors.successLight : Colors.errorLight }}>
          <T size="sm" color={Colors.textSecondary}>নিট লাভ</T>
          <T size="2xl" weight="bold" color={profit >= 0 ? Colors.success : Colors.error}>{bnTaka(profit)}</T>
        </Card>

        <BtnRow style={{ marginBottom: Spacing.base }}>
          <Btn label="আয় যোগ" onPress={() => openAdd('income')} variant="secondary" flex icon={<PlusIcon size={16} color={Colors.textInverse} />} />
          <Btn label="ব্যয় যোগ" onPress={() => openAdd('expense')} variant="danger" flex icon={<PlusIcon size={16} color={Colors.textInverse} />} />
        </BtnRow>

        {isFull && (
          <Row gap={Spacing.sm} wrap style={{ marginBottom: Spacing.base }}>
            {VIEW_TABS.map((t) => (
              <Chip key={t.id} label={t.label} active={view === t.id} onPress={() => setView(t.id)} />
            ))}
          </Row>
        )}

        {(!isFull || view === 'entry') && <TransactionList transactions={transactions} />}
        {isFull && view === 'journal' && <JournalView transactions={transactions} />}
        {isFull && view === 'balance' && <BalanceSheetView income={income} expense={expense} />}
        {isFull && view === 'insights' && (
          <InsightsView income={income} expense={expense} exporting={busy} onExport={() => exportReport('monthly')} />
        )}

        {!isFull && (
          <>
            <SimpleStockSection
              items={stock}
              onAdd={(item) => setStock([{ id: generateId(), ...item }, ...stock])}
            />
            <NGOReportCard sending={busy} onSend={(p) => exportReport(p, 'NGO')} />
          </>
        )}
      </ScreenScroll>

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <T size="lg" weight="bold" style={{ marginBottom: Spacing.base }}>
              {formType === 'income' ? 'আয় যোগ করুন' : 'ব্যয় যোগ করুন'}
            </T>
            <Input label="পরিমাণ (৳)" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="০" style={{ marginBottom: Spacing.md }} />
            <Input label="ক্যাটাগরি" value={category} onChangeText={setCategory} placeholder="যেমন: বিক্রয়, কাঁচামাল" style={{ marginBottom: Spacing.md }} />
            <Input label="পণ্যের নাম (ঐচ্ছিক)" value={product} onChangeText={setProduct} placeholder="যেমন: কটন কুর্তি" style={{ marginBottom: Spacing.xl }} />
            <Btn label="সংরক্ষণ" onPress={addTransaction} fullWidth variant={formType === 'income' ? 'secondary' : 'danger'} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'], padding: Spacing.xl },
});
