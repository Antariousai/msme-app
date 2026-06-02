import React, { useState } from 'react';
import { View, Modal, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { userHasLoan } from '../auth/onboarding';
import { T, Card, Row, Btn, Chip } from './atoms';
import { Spacing, Radius } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { LOAN_LENDERS, LoanLenderId, getLoanLenderLabel } from '../data/loanLenders';

/** Settings card to update loan status and lender (affects dashboard credit score visibility) */
export const LoanProfileSettings = () => {
  const { user, updateLoanProfile } = useAuth();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [hasLoan, setHasLoan] = useState(user?.loanProfile?.hasLoan ?? false);
  const [lenderId, setLenderId] = useState<LoanLenderId | undefined>(user?.loanProfile?.lenderId);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const openModal = () => {
    setHasLoan(user.loanProfile?.hasLoan ?? false);
    setLenderId(user.loanProfile?.lenderId);
    setModalVisible(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateLoanProfile(
        hasLoan ? { hasLoan: true, lenderId } : { hasLoan: false },
      );
      setModalVisible(false);
    } finally {
      setSaving(false);
    }
  };

  const summary = userHasLoan(user)
    ? getLoanLenderLabel(user.loanProfile?.lenderId) ?? 'ঋণ আছে'
    : 'ঋণ নেই — ক্রেডিট স্কোর ড্যাশবোর্ডে দেখাবে না';

  return (
    <>
      <Card onPress={openModal} effect="slideX" style={{ marginBottom: Spacing.sm }}>
        <Row justify="space-between" fill>
          <Row gap={Spacing.md} style={{ flex: 1, minWidth: 0 }}>
            <T size="xl">🏦</T>
            <View style={{ flex: 1, minWidth: 0 }}>
              <T size="sm" weight="bold">ব্যবসায়িক ঋণ</T>
              <T size="xs" color={colors.textTertiary} numberOfLines={2}>{summary}</T>
            </View>
          </Row>
          <T size="sm" color={colors.textTertiary}>›</T>
        </Row>
      </Card>

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={() => setModalVisible(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={(e) => e.stopPropagation()}>
            <T size="lg" weight="bold" style={{ marginBottom: Spacing.base }}>ঋণ তথ্য আপডেট</T>
            <Row gap={Spacing.sm} style={{ marginBottom: Spacing.lg }}>
              <Chip label="ঋণ আছে" active={hasLoan} onPress={() => setHasLoan(true)} />
              <Chip label="ঋণ নেই" active={!hasLoan} onPress={() => { setHasLoan(false); setLenderId(undefined); }} />
            </Row>
            {hasLoan && (
              <View style={styles.lenderGrid}>
                {LOAN_LENDERS.map((l) => (
                  <Chip
                    key={l.id}
                    label={`${l.emoji} ${l.label}`}
                    active={lenderId === l.id}
                    onPress={() => setLenderId(l.id)}
                  />
                ))}
              </View>
            )}
            <Btn
              label="সংরক্ষণ"
              onPress={save}
              fullWidth
              loading={saving}
              disabled={hasLoan && !lenderId}
              style={{ marginTop: Spacing.lg }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    padding: Spacing.xl,
    paddingBottom: Spacing.xl + 16,
    maxHeight: '80%',
  },
  lenderGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
