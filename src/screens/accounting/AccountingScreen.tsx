import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, Btn, ScreenScroll, StatCard, Input, BtnRow, Chip } from '../../components/atoms';
import { IncomeExpenseQuickActions } from '../../components/IncomeExpenseQuickActions';
import { HeroCard } from '../../components/HeroCard';
import { ScreenFrame } from '../../components/ScreenFrame';
import { Colors, Spacing, Radius } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
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
  const { colors } = useTheme();
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
    <ScreenFrame>
      <AppHeader title="হিসাব রক্ষা" subtitle={isFull ? 'হিসাব · জার্নাল · বিশ্লেষণ' : 'আয় ও ব্যয় লিখুন'} />
      <ScreenScroll>
        <Row gap={Spacing.base} style={{ marginBottom: Spacing.base }}>
          <StatCard label="মোট আয়" value={bnTaka(income)} color={colors.income} icon={<T>📈</T>} />
          <StatCard label="মোট ব্যয়" value={bnTaka(expense)} color={colors.expense} icon={<T>📉</T>} />
        </Row>

        <HeroCard
          title="💚 মোট লাভ"
          metric={bnTaka(profit)}
          metricLabel=""
          colors={profit >= 0 ? ['#16b886', '#5ed8a8', '#c2f0df'] : ['#ff5a78', '#ff8fa5', '#ffd0d9']}
        />

        <IncomeExpenseQuickActions
          onIncome={() => openAdd('income')}
          onExpense={() => openAdd('expense')}
        />

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
        <Pressable style={[styles.modalOverlay, { backgroundColor: colors.overlay }]} onPress={() => setModalVisible(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: colors.surface }]} onPress={(e) => e.stopPropagation()}>
            <T size="lg" weight="bold" style={{ marginBottom: Spacing.base }}>
              {formType === 'income' ? 'আয় যোগ করুন' : 'খরচ যোগ করুন'}
            </T>
            <Input label="পরিমাণ (৳)" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="০" style={{ marginBottom: Spacing.md }} />
            <Input label="ক্যাটাগরি" value={category} onChangeText={setCategory} placeholder="যেমন: বিক্রয়, কাঁচামাল" style={{ marginBottom: Spacing.md }} />
            <Input label="পণ্যের নাম (ঐচ্ছিক)" value={product} onChangeText={setProduct} placeholder="যেমন: কটন কুর্তি" style={{ marginBottom: Spacing.xl }} />
            <Btn label="সংরক্ষণ" onPress={addTransaction} fullWidth variant={formType === 'income' ? 'secondary' : 'danger'} />
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenFrame>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'], padding: Spacing.xl },
});
