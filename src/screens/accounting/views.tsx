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

const MONTHS_S = ['জানু','ফেব','মার্চ','এপ্রি','মে','জুন','জুলা','আগ','সেপ','অক্টো','নভে','ডিসে'];
function fmtDate(iso: string): string {
  const [, mm, dd] = iso.split('-');
  return `${toBn(+dd)} ${MONTHS_S[+mm - 1]}`;
}

/** Column widths for the journal table */
const J = { date: 52, desc: undefined as number | undefined, dr: 68, cr: 68 };

const JCell = ({ w, right, bold, children, color }: {
  w?: number; right?: boolean; bold?: boolean; children: React.ReactNode; color?: string;
}) => (
  <View style={[{ flex: w ? undefined : 1, width: w, justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 4 }]}>
    <T size="xs" weight={bold ? 'bold' : 'regular'} align={right ? 'right' : 'left'} color={color}>{children}</T>
  </View>
);

/** Proper double-entry journal ledger */
export const JournalView = ({ transactions }: { transactions: Transaction[] }) => {
  const totalDr = transactions.reduce((s, t) => s + t.amount, 0);
  return (
    <View style={{ borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.base }}>
      {/* Table header */}
      <View style={{ flexDirection: 'row', backgroundColor: Colors.chip, borderBottomWidth: 1, borderColor: Colors.border }}>
        <JCell w={J.date} bold color={Colors.textSecondary}>তারিখ</JCell>
        <View style={{ width: 1, backgroundColor: Colors.border }} />
        <JCell bold color={Colors.textSecondary}>বিবরণ</JCell>
        <View style={{ width: 1, backgroundColor: Colors.border }} />
        <JCell w={J.dr} right bold color={Colors.textSecondary}>ডেবিট</JCell>
        <View style={{ width: 1, backgroundColor: Colors.border }} />
        <JCell w={J.cr} right bold color={Colors.textSecondary}>ক্রেডিট</JCell>
      </View>

      {/* Transaction rows (two lines each: Dr + Cr) */}
      {transactions.map((tx, idx) => {
        const debitAcc  = tx.type === 'income' ? 'নগদ' : tx.category;
        const creditAcc = tx.type === 'income' ? (tx.product || tx.category) : 'নগদ';
        const isLast    = idx === transactions.length - 1;
        return (
          <View key={tx.id} style={{ borderBottomWidth: isLast ? 0 : 1, borderColor: Colors.borderLight }}>
            {/* Debit line */}
            <View style={{ flexDirection: 'row', backgroundColor: Colors.surface }}>
              <JCell w={J.date} color={Colors.textSecondary}>{fmtDate(tx.date)}</JCell>
              <View style={{ width: 1, backgroundColor: Colors.borderLight }} />
              <JCell color={Colors.textPrimary}>{debitAcc}  Dr</JCell>
              <View style={{ width: 1, backgroundColor: Colors.borderLight }} />
              <JCell w={J.dr} right bold color={Colors.income}>{bnTaka(tx.amount)}</JCell>
              <View style={{ width: 1, backgroundColor: Colors.borderLight }} />
              <JCell w={J.cr} right>—</JCell>
            </View>
            {/* Credit line (indented) */}
            <View style={{ flexDirection: 'row', backgroundColor: Colors.bg }}>
              <JCell w={J.date}>{''}</JCell>
              <View style={{ width: 1, backgroundColor: Colors.borderLight }} />
              <JCell color={Colors.textSecondary}>    {creditAcc}  Cr</JCell>
              <View style={{ width: 1, backgroundColor: Colors.borderLight }} />
              <JCell w={J.dr} right>—</JCell>
              <View style={{ width: 1, backgroundColor: Colors.borderLight }} />
              <JCell w={J.cr} right bold color={Colors.expense}>{bnTaka(tx.amount)}</JCell>
            </View>
          </View>
        );
      })}

      {/* Totals row */}
      <View style={{ flexDirection: 'row', backgroundColor: Colors.chip, borderTopWidth: 1.5, borderColor: Colors.border }}>
        <JCell w={J.date} bold>{'মোট'}</JCell>
        <View style={{ width: 1, backgroundColor: Colors.border }} />
        <JCell>{''}</JCell>
        <View style={{ width: 1, backgroundColor: Colors.border }} />
        <JCell w={J.dr} right bold color={Colors.income}>{bnTaka(totalDr)}</JCell>
        <View style={{ width: 1, backgroundColor: Colors.border }} />
        <JCell w={J.cr} right bold color={Colors.expense}>{bnTaka(totalDr)}</JCell>
      </View>
    </View>
  );
};

/** Proper two-section balance sheet (cash-basis MSME) */
export const BalanceSheetView = ({ income, expense }: { income: number; expense: number }) => {
  const netCash   = income - expense;
  const balanced  = netCash >= 0;

  const BSRow = ({ label, amount, indent, bold, color }: {
    label: string; amount?: number; indent?: boolean; bold?: boolean; color?: string;
  }) => (
    <Row justify="space-between" align="center" style={{ paddingVertical: 5, paddingLeft: indent ? Spacing.lg : 0 }}>
      <T size="sm" color={indent ? Colors.textSecondary : Colors.textPrimary} weight={bold ? 'bold' : 'regular'}>{label}</T>
      {amount !== undefined && (
        <T size="sm" weight={bold ? 'bold' : 'regular'} color={color ?? Colors.textPrimary}>{bnTaka(amount)}</T>
      )}
    </Row>
  );

  const Divider = () => <View style={{ height: 1, backgroundColor: Colors.border, marginVertical: Spacing.xs }} />;

  return (
    <View style={{ marginBottom: Spacing.base }}>
      {/* Header */}
      <Card style={{ marginBottom: Spacing.sm, backgroundColor: Colors.chip }}>
        <T size="sm" weight="bold" align="center">ব্যালেন্স শিট</T>
        <T size="xs" color={Colors.textSecondary} align="center" style={{ marginTop: 2 }}>সরলীকৃত নগদ ভিত্তিক হিসাব</T>
      </Card>

      {/* Assets */}
      <Card style={{ marginBottom: Spacing.sm }}>
        <T size="sm" weight="bold" color={Colors.primary} style={{ marginBottom: Spacing.xs }}>সম্পদ (Assets)</T>
        <Divider />
        <BSRow label="চলতি সম্পদ:" />
        <BSRow label="নগদ প্রাপ্তি (বিক্রয় আয়)" amount={income} indent color={Colors.success} />
        <BSRow label="নগদ ব্যয় (উত্তোলন)" amount={-expense} indent color={Colors.expense} />
        <Divider />
        <BSRow label="মোট নিট নগদ" amount={netCash} bold color={balanced ? Colors.success : Colors.error} />
      </Card>

      {/* Liabilities & Capital */}
      <Card style={{ marginBottom: Spacing.sm }}>
        <T size="sm" weight="bold" color={Colors.accent} style={{ marginBottom: Spacing.xs }}>দায় ও মূলধন (Liabilities & Capital)</T>
        <Divider />
        <BSRow label="চলতি দায়:" />
        <BSRow label="বকেয়া দায় (সরলীকৃত)" amount={0} indent color={Colors.textSecondary} />
        <BSRow label="মালিকের মূলধন:" />
        <BSRow label="নিট লাভ/ক্ষতি" amount={netCash} indent bold color={balanced ? Colors.success : Colors.error} />
        <Divider />
        <BSRow label="মোট দায় + মূলধন" amount={netCash} bold color={balanced ? Colors.success : Colors.error} />
      </Card>

      {/* Balance confirmation */}
      <Card style={{ backgroundColor: balanced ? Colors.successLight : Colors.errorLight }}>
        <Row gap={Spacing.sm} align="center" justify="center">
          <T size="md">{balanced ? '✅' : '⚠️'}</T>
          <T size="sm" weight="bold" color={balanced ? Colors.success : Colors.error}>
            {balanced ? 'ব্যালেন্স মিলেছে' : 'ব্যালেন্স মিলেনি — ঘাটতি আছে'}
          </T>
        </Row>
        <T size="xs" color={Colors.textSecondary} align="center" style={{ marginTop: Spacing.xs }}>
          সম্পদ = দায় + মূলধন = {bnTaka(netCash)}
        </T>
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
