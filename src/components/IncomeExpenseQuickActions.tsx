import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Btn, Row } from './atoms';
import { Spacing } from '../theme';
import { useFeatureNav } from '../navigation/FeatureNavContext';

interface IncomeExpenseQuickActionsProps {
  style?: StyleProp<ViewStyle>;
  /** Override default: open হিসাব রক্ষা and add income */
  onIncome?: () => void;
  /** Override default: open হিসাব রক্ষা and add expense */
  onExpense?: () => void;
}

/** Large green আয় / red খরচ actions — shown on every tier home */
export const IncomeExpenseQuickActions = ({
  style,
  onIncome,
  onExpense,
}: IncomeExpenseQuickActionsProps) => {
  const { openFeature } = useFeatureNav();

  const goIncome = onIncome ?? (() => openFeature('bookkeeping'));
  const goExpense = onExpense ?? (() => openFeature('bookkeeping'));

  return (
    <Row gap={Spacing.base} style={[{ marginBottom: Spacing.base }, style]}>
      <Btn label="➕ আয়" onPress={goIncome} variant="income" size="xl" flex />
      <Btn label="➖ খরচ" onPress={goExpense} variant="expense" size="xl" flex />
    </Row>
  );
};
