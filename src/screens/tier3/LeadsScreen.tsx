import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatusPill, Btn, Input, AISuggestion, Chip } from '../../components/atoms';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { ScreenFrame } from '../../components/ScreenFrame';
import { HeroCard } from '../../components/HeroCard';
import { Colors, Spacing, Radius } from '../../theme';
import { seedLeads, Lead, aiSuggestions } from '../../data/seed';
import { toBn, generateId } from '../../utils/helpers';

const scoreColor = (score: number) => {
  if (score >= 80) return Colors.success;
  if (score >= 50) return Colors.warning;
  return Colors.textTertiary;
};

const STAGES: { key: Lead['status']; label: string; emoji: string; color: string }[] = [
  { key: 'new', label: 'নতুন', emoji: '🆕', color: Colors.primary },
  { key: 'contacted', label: 'যোগাযোগ', emoji: '📞', color: Colors.warning },
  { key: 'qualified', label: 'যোগ্য', emoji: '✅', color: Colors.success },
  { key: 'converted', label: 'রূপান্তর', emoji: '🎉', color: Colors.income },
  { key: 'lost', label: 'হারানো', emoji: '❌', color: Colors.expense },
];

const statusPillType: Record<Lead['status'], 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  new: 'info',
  contacted: 'warning',
  qualified: 'success',
  converted: 'success',
  lost: 'error',
};

// ─── Kanban Card ───────────────────────────────────────────────────────────────

const KanbanCard = ({
  lead,
  onMove,
}: {
  lead: Lead;
  onMove: (id: string, status: Lead['status']) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const stage = STAGES.find((s) => s.key === lead.status)!;

  return (
    <Card
      onPress={() => setExpanded(!expanded)}
      style={[styles.kanbanCard, { borderLeftColor: stage.color }]}
      padding={Spacing.sm}
    >
      <Row justify="space-between" style={{ marginBottom: 2 }}>
        <T size="sm" weight="semibold" style={{ flex: 1 }} numberOfLines={1}>{lead.name}</T>
        <T size="xs" weight="bold" color={scoreColor(lead.score)}>⭐{toBn(lead.score)}</T>
      </Row>
      <T size="xs" color={Colors.textSecondary} numberOfLines={1}>📞 {lead.phone}</T>
      <T size="xs" color={Colors.textTertiary}>{lead.source}</T>
      {expanded && (
        <View style={{ marginTop: Spacing.sm }}>
          <T size="xs" weight="medium" style={{ marginBottom: Spacing.xs }}>স্তরে সরান:</T>
          <Row gap={4} wrap>
            {STAGES.filter((s) => s.key !== lead.status).map((s) => (
              <Pressable
                key={s.key}
                onPress={() => { onMove(lead.id, s.key); setExpanded(false); }}
                style={[styles.moveBtn, { borderColor: s.color }]}
              >
                <T size="xs" color={s.color}>{s.emoji} {s.label}</T>
              </Pressable>
            ))}
          </Row>
        </View>
      )}
    </Card>
  );
};

// ─── Kanban Column ─────────────────────────────────────────────────────────────

const KanbanColumn = ({
  stage,
  leads,
  onMove,
  colWidth,
}: {
  stage: typeof STAGES[number];
  leads: Lead[];
  onMove: (id: string, status: Lead['status']) => void;
  colWidth: number;
}) => (
  <View style={[styles.kanbanCol, { width: colWidth }]}>
    <View style={[styles.kanbanColHeader, { backgroundColor: stage.color + '22', borderTopColor: stage.color }]}>
      <T size="sm" weight="bold">{stage.emoji} {stage.label}</T>
      <View style={[styles.kanbanBadge, { backgroundColor: stage.color }]}>
        <T size="xs" weight="bold" color="#fff">{leads.length}</T>
      </View>
    </View>
    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      {leads.length === 0 && (
        <T size="xs" color={Colors.textTertiary} style={{ textAlign: 'center', marginTop: Spacing.md }}>
          কোনো লিড নেই
        </T>
      )}
      {leads.map((lead) => (
        <KanbanCard key={lead.id} lead={lead} onMove={onMove} />
      ))}
    </ScrollView>
  </View>
);

// ─── Kanban Board ──────────────────────────────────────────────────────────────

const KanbanBoard = ({
  leads,
  onMove,
}: {
  leads: Lead[];
  onMove: (id: string, status: Lead['status']) => void;
}) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 720;
  const colWidth = isWide
    ? Math.floor((width - Spacing.base * 2 - Spacing.sm * (STAGES.length - 1)) / STAGES.length)
    : width - Spacing.base * 3;

  return (
    <ScrollView
      horizontal={!isWide}
      style={{ flex: 1 }}
      contentContainerStyle={[
        styles.kanbanBoard,
        isWide && { flexDirection: 'row', flexWrap: 'nowrap' },
      ]}
      showsHorizontalScrollIndicator={false}
    >
      {STAGES.map((stage) => (
        <KanbanColumn
          key={stage.key}
          stage={stage}
          leads={leads.filter((l) => l.status === stage.key)}
          onMove={onMove}
          colWidth={colWidth}
        />
      ))}
    </ScrollView>
  );
};

// ─── Main LeadsScreen ──────────────────────────────────────────────────────────

export const LeadsScreen = () => {
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const moveLead = (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status, lastContact: 'আজ' } : l));
  };

  const addLead = () => {
    if (!name || !phone) return;
    const newLead: Lead = {
      id: generateId(),
      name,
      phone,
      address,
      score: Math.floor(Math.random() * 40) + 30,
      source: 'Manual',
      status: 'new',
      lastContact: 'আজ',
    };
    setLeads([newLead, ...leads]);
    setModalVisible(false);
    setName('');
    setPhone('');
    setAddress('');
  };

  const sorted = useMemo(() => [...leads].sort((a, b) => b.score - a.score), [leads]);

  return (
    <ScreenFrame>
      <AppHeader title="লিড ও CRM" subtitle="ক্যাপচার · স্কোর · রূপান্তর" />

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <Row gap={Spacing.xs}>
          <Chip label="📋 তালিকা" active={view === 'list'} onPress={() => setView('list')} />
          <Chip label="🗂 Kanban" active={view === 'kanban'} onPress={() => setView('kanban')} />
        </Row>
        <Btn label="➕ লিড যোগ" onPress={() => setModalVisible(true)} size="sm" />
      </View>

      {view === 'kanban' ? (
        <KanbanBoard leads={leads} onMove={moveLead} />
      ) : (
        <ScreenScroll>
          {aiSuggestions.leads.map((s, i) => (
            <View key={i} style={{ marginBottom: Spacing.sm }}>
              <AISuggestion title={s.title} message={s.message} actionLabel="কাজ করুন" />
            </View>
          ))}

          <SectionHeader title="⭐ লিড র‍্যাঙ্কিং" />
          {sorted.map((lead) => {
            const stage = STAGES.find((s) => s.key === lead.status)!;
            return (
              <Card key={lead.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
                <Row justify="space-between">
                  <T size="sm" weight="bold">{lead.name}</T>
                  <T size="sm" weight="bold" color={scoreColor(lead.score)}>⭐ {toBn(lead.score)}</T>
                </Row>
                <View style={{ marginTop: Spacing.sm, gap: 3 }}>
                  <T size="xs" color={Colors.textSecondary}>📞 {lead.phone}</T>
                  {lead.address ? (
                    <T size="xs" color={Colors.textSecondary}>📍 {lead.address}</T>
                  ) : null}
                </View>
                <Row justify="space-between" align="center" style={{ marginTop: Spacing.md }}>
                  <StatusPill label={`${stage.emoji} ${stage.label}`} type={statusPillType[lead.status]} />
                  <T size="xs" color={Colors.textTertiary}>{lead.source} · {lead.lastContact}</T>
                </Row>
                <Row gap={Spacing.sm} wrap style={{ marginTop: Spacing.sm }}>
                  {STAGES.filter((s) => s.key !== lead.status).slice(0, 3).map((s) => (
                    <Btn
                      key={s.key}
                      label={`${s.emoji} ${s.label}`}
                      onPress={() => moveLead(lead.id, s.key)}
                      size="sm"
                      variant="outline"
                    />
                  ))}
                </Row>
              </Card>
            );
          })}
        </ScreenScroll>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <T size="lg" weight="bold" style={{ marginBottom: Spacing.base }}>লিড ক্যাপচার</T>
            <Input label="নাম" value={name} onChangeText={setName} placeholder="গ্রাহকের নাম" style={{ marginBottom: Spacing.md }} />
            <Input label="ফোন" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="01XXXXXXXXX" style={{ marginBottom: Spacing.md }} />
            <Input label="ঠিকানা" value={address} onChangeText={setAddress} placeholder="জেলা, এলাকা" style={{ marginBottom: Spacing.xl }} />
            <Btn label="সংরক্ষণ" onPress={addLead} fullWidth />
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenFrame>
  );
};

// ─── Tier 3 Home ───────────────────────────────────────────────────────────────

export const Tier3Home = () => {
  const hotLeads = seedLeads.filter((l) => l.score >= 70).length;
  const converted = seedLeads.filter((l) => l.status === 'converted').length;
  return (
    <ScreenFrame>
      <AppHeader showGreeting />
      <ScreenScroll>
        <HeroCard
          title="🎯 প্রো ড্যাশবোর্ড"
          metric={toBn(seedLeads.length)}
          metricLabel="মোট লিড"
          stats={[
            { label: 'হট লিড 🔥', value: toBn(hotLeads) },
            { label: 'রূপান্তর ✅', value: toBn(converted) },
          ]}
        />
        <AISuggestion
          title="🔥 লিড ক্লোজিং"
          message="আয়েশা সিদ্দিকা (স্কোর ৯২) — আজ কল করলে রূপান্তর সম্ভাবনা ৮৫%। 🚀"
          actionLabel="লিড দেখুন"
        />
        <FeatureToolsSection layout="grid" scope="all" />
      </ScreenScroll>
    </ScreenFrame>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  kanbanBoard: {
    flexDirection: 'row',
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  kanbanCol: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    maxHeight: '100%',
    flexShrink: 0,
    minHeight: 200,
  },
  kanbanColHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.sm,
    borderTopWidth: 3,
  },
  kanbanBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  kanbanCard: {
    margin: Spacing.xs,
    borderLeftWidth: 3,
  },
  moveBtn: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginBottom: 4,
  },
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'], padding: Spacing.xl },
});
