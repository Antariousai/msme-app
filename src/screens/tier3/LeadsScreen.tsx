import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  SectionList,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatusPill, Btn, Input, AISuggestion, Chip } from '../../components/atoms';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { ScreenFrame } from '../../components/ScreenFrame';
import { HeroCard } from '../../components/HeroCard';
import { Colors, Spacing, Radius } from '../../theme';
import { seedLeads, Lead, aiSuggestions } from '../../data/seed';
import { toBn, generateId } from '../../utils/helpers';

const WIDE_BREAKPOINT = 720;
const TAB_BAR = 68;

type StageDef = { key: Lead['status']; label: string; emoji: string; color: string };

const STAGES: StageDef[] = [
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

const stageIndex = (status: Lead['status']) => STAGES.findIndex((s) => s.key === status);

const nextStage = (status: Lead['status']): Lead['status'] | null => {
  const i = stageIndex(status);
  if (i < 0 || i >= STAGES.length - 2) return null;
  return STAGES[i + 1].key;
};

const prevStage = (status: Lead['status']): Lead['status'] | null => {
  const i = stageIndex(status);
  if (i <= 0) return null;
  return STAGES[i - 1].key;
};

const dialPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits) Linking.openURL(`tel:${digits}`);
};

// ─── Move lead sheet ───────────────────────────────────────────────────────────

const MoveLeadSheet = ({
  visible,
  lead,
  onClose,
  onMove,
}: {
  visible: boolean;
  lead: Lead | null;
  onClose: () => void;
  onMove: (id: string, status: Lead['status']) => void;
}) => {
  if (!lead) return null;
  const current = STAGES.find((s) => s.key === lead.status)!;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheetHandle} />
          <T size="lg" weight="bold">{lead.name}</T>
          <T size="xs" color={Colors.textSecondary} style={{ marginTop: 4, marginBottom: Spacing.lg }}>
            বর্তমান: {current.emoji} {current.label}
          </T>
          <View style={styles.stageGrid}>
            {STAGES.filter((s) => s.key !== lead.status).map((s) => (
              <Pressable
                key={s.key}
                onPress={() => { onMove(lead.id, s.key); onClose(); }}
                style={[styles.stageGridBtn, { borderColor: s.color, backgroundColor: s.color + '14' }]}
              >
                <T size="2xl">{s.emoji}</T>
                <T size="sm" weight="semibold" style={{ marginTop: 4 }}>{s.label}</T>
              </Pressable>
            ))}
          </View>
          <Btn label="বাতিল" onPress={onClose} variant="ghost" fullWidth style={{ marginTop: Spacing.md }} />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ─── Mobile lead card ──────────────────────────────────────────────────────────

const MobileLeadCard = ({
  lead,
  onMovePress,
  onMove,
}: {
  lead: Lead;
  onMovePress: (lead: Lead) => void;
  onMove: (id: string, status: Lead['status']) => void;
}) => {
  const stage = STAGES.find((s) => s.key === lead.status)!;
  const next = nextStage(lead.status);
  const prev = prevStage(lead.status);
  const nextDef = next ? STAGES.find((s) => s.key === next) : null;

  return (
    <View style={[styles.mobileCard, { borderColor: stage.color + '55' }]}>
      <View style={[styles.mobileCardStripe, { backgroundColor: stage.color }]} />

      <View style={styles.mobileCardBody}>
        <Row justify="space-between" align="flex-start">
          <View style={{ flex: 1, minWidth: 0 }}>
            <T size="md" weight="bold" numberOfLines={2}>{lead.name}</T>
            <Pressable onPress={() => dialPhone(lead.phone)} style={styles.phoneRow}>
              <T size="sm" color={Colors.primary} weight="medium">📞 {lead.phone}</T>
            </Pressable>
            {lead.address ? (
              <T size="xs" color={Colors.textTertiary} numberOfLines={1} style={{ marginTop: 2 }}>
                📍 {lead.address}
              </T>
            ) : null}
          </View>
          <View style={[styles.scorePill, { borderColor: scoreColor(lead.score) }]}>
            <T size="sm" weight="bold" color={scoreColor(lead.score)}>⭐{toBn(lead.score)}</T>
          </View>
        </Row>

        <T size="xs" color={Colors.textTertiary} style={{ marginTop: Spacing.xs }}>
          {lead.source} · {lead.lastContact}
        </T>

        <View style={styles.actionBar}>
          <Pressable style={styles.actionBtn} onPress={() => dialPhone(lead.phone)}>
            <T size="lg">📞</T>
            <T size="xs" weight="semibold" style={{ marginTop: 2 }}>কল</T>
          </Pressable>

          {prev && (
            <Pressable
              style={styles.actionBtn}
              onPress={() => onMove(lead.id, prev)}
            >
              <T size="lg">◀</T>
              <T size="xs" weight="semibold" style={{ marginTop: 2 }} numberOfLines={1}>
                {STAGES.find((s) => s.key === prev)!.label}
              </T>
            </Pressable>
          )}

          {nextDef && (
            <Pressable
              style={[styles.actionBtn, styles.actionBtnPrimary, { backgroundColor: nextDef.color + '22' }]}
              onPress={() => onMove(lead.id, next!)}
            >
              <T size="lg">{nextDef.emoji}</T>
              <T size="xs" weight="bold" color={nextDef.color} style={{ marginTop: 2 }}>
                {nextDef.label}
              </T>
            </Pressable>
          )}

          <Pressable style={styles.actionBtn} onPress={() => onMovePress(lead)}>
            <T size="lg">⋯</T>
            <T size="xs" weight="semibold" style={{ marginTop: 2 }}>আরও</T>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const scoreColor = (score: number) => {
  if (score >= 80) return Colors.success;
  if (score >= 50) return Colors.warning;
  return Colors.textTertiary;
};

// ─── Mobile: vertical pipeline (single scroll) ─────────────────────────────────

type PipelineSection = { stage: StageDef; data: Lead[] };

const MobilePipelineKanban = ({
  leads,
  onMovePress,
  onMove,
}: {
  leads: Lead[];
  onMovePress: (lead: Lead) => void;
  onMove: (id: string, status: Lead['status']) => void;
}) => {
  const insets = useSafeAreaInsets();
  const listRef = useRef<SectionList<Lead, PipelineSection>>(null);
  const [jumpIndex, setJumpIndex] = useState(0);

  const sections: PipelineSection[] = useMemo(
    () => STAGES.map((stage) => ({
      stage,
      data: leads.filter((l) => l.status === stage.key),
    })),
    [leads],
  );

  const totalByStage = useMemo(() => {
    const m: Record<string, number> = {};
    STAGES.forEach((s) => { m[s.key] = leads.filter((l) => l.status === s.key).length; });
    return m;
  }, [leads]);

  const scrollToStage = (index: number) => {
    setJumpIndex(index);
    listRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      viewOffset: 8,
      animated: true,
    });
  };

  const renderSectionHeader = useCallback(({ section }: { section: PipelineSection }) => {
    const { stage } = section;
    const count = section.data.length;
    return (
      <View style={[styles.sectionHeader, { borderLeftColor: stage.color }]}>
        <View style={[styles.sectionIcon, { backgroundColor: stage.color + '22' }]}>
          <T size="lg">{stage.emoji}</T>
        </View>
        <View style={{ flex: 1 }}>
          <T size="md" weight="bold">{stage.label}</T>
          <T size="xs" color={Colors.textSecondary}>
            {count === 0 ? 'কোনো লিড নেই' : `${toBn(count)} লিড`}
          </T>
        </View>
        <View style={[styles.sectionCount, { backgroundColor: stage.color }]}>
          <T size="sm" weight="bold" color="#fff">{toBn(count)}</T>
        </View>
      </View>
    );
  }, []);

  const renderItem = useCallback(({ item }: { item: Lead }) => (
    <MobileLeadCard lead={item} onMovePress={onMovePress} onMove={onMove} />
  ), [onMovePress, onMove]);

  const renderSectionFooter = useCallback(({ section }: { section: PipelineSection }) => {
    if (section.data.length > 0) return <View style={{ height: Spacing.sm }} />;
    return (
      <View style={styles.emptySection}>
        <T size="sm" color={Colors.textTertiary}>এখানে লিড নেই</T>
        <T size="xs" color={Colors.textTertiary} style={{ marginTop: 4 }}>
          অন্য স্তর থেকে «আরও» দিয়ে সরান
        </T>
      </View>
    );
  }, []);

  return (
    <View style={styles.mobilePipeline}>
      {/* Tap-to-jump pipeline strip */}
      <View style={styles.pipelineStripWrap}>
        <T size="xs" color={Colors.textTertiary} style={styles.pipelineHint}>
          স্তরে যেতে ট্যাপ করুন · নিচে স্ক্রল করুন
        </T>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pipelineStrip}
        >
          {STAGES.map((stage, i) => {
            const active = jumpIndex === i;
            const count = totalByStage[stage.key];
            return (
              <Pressable
                key={stage.key}
                onPress={() => scrollToStage(i)}
                style={[
                  styles.pipelineStep,
                  active && { backgroundColor: stage.color, borderColor: stage.color },
                ]}
              >
                <T size="md">{stage.emoji}</T>
                <T
                  size="xs"
                  weight="semibold"
                  color={active ? '#fff' : Colors.textPrimary}
                  numberOfLines={1}
                  style={{ marginTop: 2, maxWidth: 56 }}
                >
                  {stage.label}
                </T>
                {count > 0 && (
                  <View style={[
                    styles.pipelineStepBadge,
                    active ? { backgroundColor: 'rgba(255,255,255,0.35)' } : { backgroundColor: stage.color },
                  ]}>
                    <T size="xs" weight="bold" color="#fff">{toBn(count)}</T>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <SectionList
        ref={listRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Spacing.base,
          paddingBottom: TAB_BAR + insets.bottom + Spacing.xl,
        }}
        onScrollToIndexFailed={() => {}}
        onViewableItemsChanged={undefined}
      />
    </View>
  );
};

// ─── Desktop Kanban card / column ──────────────────────────────────────────────

const DesktopKanbanCard = ({
  lead,
  onMovePress,
}: {
  lead: Lead;
  onMovePress: (lead: Lead) => void;
}) => {
  const stage = STAGES.find((s) => s.key === lead.status)!;
  return (
    <Pressable onPress={() => onMovePress(lead)}>
      <Card style={[styles.desktopCard, { borderLeftColor: stage.color }]} padding={Spacing.sm}>
        <T size="sm" weight="semibold" numberOfLines={1}>{lead.name}</T>
        <T size="xs" color={Colors.textSecondary} numberOfLines={1}>📞 {lead.phone}</T>
        <Row justify="space-between" style={{ marginTop: 4 }}>
          <T size="xs" color={Colors.textTertiary}>{lead.source}</T>
          <T size="xs" weight="bold" color={scoreColor(lead.score)}>⭐{toBn(lead.score)}</T>
        </Row>
      </Card>
    </Pressable>
  );
};

const KanbanColumn = ({
  stage,
  leads,
  colWidth,
  colHeight,
  onMovePress,
}: {
  stage: StageDef;
  leads: Lead[];
  colWidth: number;
  colHeight: number;
  onMovePress: (lead: Lead) => void;
}) => (
  <View style={[styles.kanbanCol, { width: colWidth, height: colHeight }]}>
    <View style={[styles.kanbanColHeader, { backgroundColor: stage.color + '22', borderTopColor: stage.color }]}>
      <T size="sm" weight="bold" numberOfLines={1}>{stage.emoji} {stage.label}</T>
      <View style={[styles.kanbanBadge, { backgroundColor: stage.color }]}>
        <T size="xs" weight="bold" color="#fff">{leads.length}</T>
      </View>
    </View>
    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
      {leads.length === 0 ? (
        <T size="xs" color={Colors.textTertiary} style={styles.emptyCol}>কোনো লিড নেই</T>
      ) : (
        leads.map((lead) => (
          <DesktopKanbanCard key={lead.id} lead={lead} onMovePress={onMovePress} />
        ))
      )}
    </ScrollView>
  </View>
);

const DesktopKanban = ({
  leads,
  onMovePress,
}: {
  leads: Lead[];
  onMovePress: (lead: Lead) => void;
}) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const gap = Spacing.sm;
  const colWidth = Math.floor((width - Spacing.base * 2 - gap * (STAGES.length - 1)) / STAGES.length);
  const colHeight = Math.min(height * 0.52, 500);

  return (
    <ScrollView
      horizontal
      style={{ flex: 1 }}
      contentContainerStyle={[styles.kanbanBoard, { paddingBottom: insets.bottom + Spacing.lg }]}
      showsHorizontalScrollIndicator={false}
    >
      {STAGES.map((stage) => (
        <KanbanColumn
          key={stage.key}
          stage={stage}
          leads={leads.filter((l) => l.status === stage.key)}
          colWidth={colWidth}
          colHeight={colHeight}
          onMovePress={onMovePress}
        />
      ))}
    </ScrollView>
  );
};

const KanbanBoard = ({
  leads,
  onMove,
}: {
  leads: Lead[];
  onMove: (id: string, status: Lead['status']) => void;
}) => {
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const [moveLead, setMoveLead] = useState<Lead | null>(null);

  return (
    <>
      {isWide ? (
        <DesktopKanban leads={leads} onMovePress={setMoveLead} />
      ) : (
        <MobilePipelineKanban
          leads={leads}
          onMovePress={setMoveLead}
          onMove={onMove}
        />
      )}
      <MoveLeadSheet
        visible={moveLead !== null}
        lead={moveLead}
        onClose={() => setMoveLead(null)}
        onMove={onMove}
      />
    </>
  );
};

// ─── LeadsScreen ───────────────────────────────────────────────────────────────

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
    setLeads([{
      id: generateId(),
      name,
      phone,
      address,
      score: Math.floor(Math.random() * 40) + 30,
      source: 'Manual',
      status: 'new',
      lastContact: 'আজ',
    }, ...leads]);
    setModalVisible(false);
    setName('');
    setPhone('');
    setAddress('');
  };

  const sorted = useMemo(() => [...leads].sort((a, b) => b.score - a.score), [leads]);

  return (
    <ScreenFrame>
      <AppHeader title="লিড ও CRM" subtitle="ক্যাপচার · স্কোর · রূপান্তর" />

      <View style={styles.toolbar}>
        <Row gap={Spacing.xs}>
          <Chip label="📋 তালিকা" active={view === 'list'} onPress={() => setView('list')} />
          <Chip label="🗂 পাইপলাইন" active={view === 'kanban'} onPress={() => setView('kanban')} />
        </Row>
        <Btn label="➕ লিড" onPress={() => setModalVisible(true)} size="sm" />
      </View>

      {view === 'kanban' ? (
        <View style={styles.kanbanWrap}>
          <KanbanBoard leads={leads} onMove={moveLead} />
        </View>
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
                  <Pressable onPress={() => dialPhone(lead.phone)}>
                    <T size="xs" color={Colors.primary}>📞 {lead.phone}</T>
                  </Pressable>
                  {lead.address ? <T size="xs" color={Colors.textSecondary}>📍 {lead.address}</T> : null}
                </View>
                <Row justify="space-between" align="center" style={{ marginTop: Spacing.md }}>
                  <StatusPill label={`${stage.emoji} ${stage.label}`} type={statusPillType[lead.status]} />
                  <T size="xs" color={Colors.textTertiary}>{lead.source} · {lead.lastContact}</T>
                </Row>
              </Card>
            );
          })}
        </ScreenScroll>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  kanbanWrap: { flex: 1, minHeight: 0 },

  mobilePipeline: { flex: 1 },
  pipelineStripWrap: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  pipelineHint: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    textAlign: 'center',
  },
  pipelineStrip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  pipelineStep: {
    alignItems: 'center',
    width: 72,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
    marginRight: Spacing.xs,
  },
  pipelineStepBadge: {
    marginTop: 4,
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderLeftWidth: 4,
    ...StyleSheet.flatten({ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 1 }),
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCount: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  emptySection: {
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.bg,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },

  mobileCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  mobileCardStripe: { width: 5 },
  mobileCardBody: { flex: 1, padding: Spacing.md },
  phoneRow: { marginTop: Spacing.xs, paddingVertical: 2 },
  scorePill: {
    borderWidth: 1.5,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginLeft: Spacing.sm,
  },
  actionBar: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.xs,
  },
  actionBtn: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
  },
  actionBtnPrimary: {
    borderWidth: 1,
    borderColor: Colors.border,
  },

  kanbanBoard: { flexDirection: 'row', padding: Spacing.base, gap: Spacing.sm },
  kanbanCol: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    flexShrink: 0,
  },
  kanbanColHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.sm,
    borderTopWidth: 3,
  },
  kanbanBadge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  desktopCard: { margin: Spacing.xs, marginBottom: Spacing.sm, borderLeftWidth: 3 },
  emptyCol: { textAlign: 'center', marginTop: Spacing.md, padding: Spacing.sm },

  stageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  stageGridBtn: {
    width: '47%',
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    borderWidth: 2,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    padding: Spacing.xl,
    paddingBottom: Spacing.xl + 16,
    maxHeight: '85%',
  },
});
