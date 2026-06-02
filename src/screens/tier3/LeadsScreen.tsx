import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
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
const MOBILE_COL_GAP = Spacing.sm;

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

const nextStage = (status: Lead['status']): Lead['status'] | null => {
  const i = STAGES.findIndex((s) => s.key === status);
  if (i < 0 || i >= STAGES.length - 2) return null; // skip advancing into 'lost' via quick action
  return STAGES[i + 1].key;
};

// ─── Move lead sheet (mobile-friendly) ─────────────────────────────────────────

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
          <T size="lg" weight="bold" style={{ marginBottom: 4 }}>{lead.name}</T>
          <T size="xs" color={Colors.textSecondary} style={{ marginBottom: Spacing.lg }}>
            বর্তমান: {current.emoji} {current.label}
          </T>
          <T size="sm" weight="semibold" style={{ marginBottom: Spacing.sm }}>স্তর বেছে নিন</T>
          {STAGES.filter((s) => s.key !== lead.status).map((s) => (
            <Pressable
              key={s.key}
              onPress={() => { onMove(lead.id, s.key); onClose(); }}
              style={[styles.moveRow, { borderLeftColor: s.color }]}
            >
              <T size="md">{s.emoji}</T>
              <T size="sm" weight="semibold" style={{ flex: 1, marginLeft: Spacing.sm }}>{s.label}</T>
              <T size="lg" color={Colors.textTertiary}>›</T>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ─── Kanban card ───────────────────────────────────────────────────────────────

const KanbanCard = ({
  lead,
  mobile,
  onMovePress,
  onQuickAdvance,
}: {
  lead: Lead;
  mobile?: boolean;
  onMovePress: (lead: Lead) => void;
  onQuickAdvance?: (lead: Lead) => void;
}) => {
  const stage = STAGES.find((s) => s.key === lead.status)!;
  const advance = nextStage(lead.status);
  const advanceStage = advance ? STAGES.find((s) => s.key === advance) : null;

  return (
    <Card
      style={[styles.kanbanCard, { borderLeftColor: stage.color }]}
      padding={mobile ? Spacing.md : Spacing.sm}
    >
      <Row justify="space-between" align="flex-start" style={{ marginBottom: Spacing.xs }}>
        <View style={{ flex: 1, minWidth: 0, paddingRight: Spacing.sm }}>
          <T size={mobile ? 'md' : 'sm'} weight="semibold" numberOfLines={2}>{lead.name}</T>
          <T size="xs" color={Colors.textSecondary} style={{ marginTop: 2 }} numberOfLines={1}>
            📞 {lead.phone}
          </T>
          {lead.address ? (
            <T size="xs" color={Colors.textTertiary} numberOfLines={1}>📍 {lead.address}</T>
          ) : null}
        </View>
        <View style={styles.scoreBadge}>
          <T size="xs" weight="bold" color={scoreColor(lead.score)}>⭐ {toBn(lead.score)}</T>
        </View>
      </Row>
      <T size="xs" color={Colors.textTertiary}>{lead.source} · {lead.lastContact}</T>

      {mobile && (
        <Row gap={Spacing.sm} style={{ marginTop: Spacing.md }}>
          {advanceStage && onQuickAdvance && (
            <Btn
              label={`${advanceStage.emoji} ${advanceStage.label}`}
              onPress={() => onQuickAdvance(lead)}
              size="sm"
              variant="primary"
              flex
            />
          )}
          <Btn
            label="স্তর পরিবর্তন"
            onPress={() => onMovePress(lead)}
            size="sm"
            variant="outline"
            flex={!advanceStage}
          />
        </Row>
      )}
    </Card>
  );
};

// ─── Desktop column ────────────────────────────────────────────────────────────

const KanbanColumn = ({
  stage,
  leads,
  colWidth,
  colHeight,
  onMovePress,
}: {
  stage: typeof STAGES[number];
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
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: Spacing.sm }}
    >
      {leads.length === 0 ? (
        <T size="xs" color={Colors.textTertiary} style={styles.emptyCol}>
          কোনো লিড নেই
        </T>
      ) : (
        leads.map((lead) => (
          <Pressable key={lead.id} onPress={() => onMovePress(lead)}>
            <KanbanCard lead={lead} onMovePress={onMovePress} />
          </Pressable>
        ))
      )}
    </ScrollView>
  </View>
);

// ─── Mobile: stage tabs + paged columns ────────────────────────────────────────

const MobileKanban = ({
  leads,
  onMovePress,
  onQuickAdvance,
}: {
  leads: Lead[];
  onMovePress: (lead: Lead) => void;
  onQuickAdvance: (lead: Lead) => void;
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const counts = useMemo(() => {
    const m: Record<Lead['status'], number> = {} as Record<Lead['status'], number>;
    STAGES.forEach((s) => { m[s.key] = leads.filter((l) => l.status === s.key).length; });
    return m;
  }, [leads]);

  const pageWidth = width - Spacing.base * 2;
  const boardHeight = 420;

  const goToStage = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: index * (pageWidth + MOBILE_COL_GAP), animated: true });
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (pageWidth + MOBILE_COL_GAP));
    setActiveIndex(Math.max(0, Math.min(index, STAGES.length - 1)));
  };

  const activeStage = STAGES[activeIndex];

  return (
    <View style={styles.mobileKanban}>
      {/* Stage tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stageTabs}
      >
        {STAGES.map((stage, i) => (
          <Pressable
            key={stage.key}
            onPress={() => goToStage(i)}
            style={[
              styles.stageTab,
              activeIndex === i && { backgroundColor: stage.color, borderColor: stage.color },
            ]}
          >
            <T
              size="xs"
              weight="semibold"
              color={activeIndex === i ? '#fff' : Colors.textPrimary}
              numberOfLines={1}
            >
              {stage.emoji} {stage.label}
            </T>
            <View style={[
              styles.stageTabCount,
              activeIndex === i
                ? { backgroundColor: 'rgba(255,255,255,0.35)' }
                : { backgroundColor: stage.color + '22' },
            ]}>
              <T size="xs" weight="bold" color={activeIndex === i ? '#fff' : stage.color}>
                {counts[stage.key]}
              </T>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Dot indicator */}
      <Row justify="center" gap={6} style={{ marginBottom: Spacing.sm }}>
        {STAGES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              activeIndex === i && { backgroundColor: STAGES[i].color, width: 18 },
            ]}
          />
        ))}
      </Row>

      {/* One column per swipe page */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={pageWidth + MOBILE_COL_GAP}
        snapToAlignment="start"
        disableIntervalMomentum
        onMomentumScrollEnd={onScrollEnd}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Spacing.base,
          gap: MOBILE_COL_GAP,
          paddingBottom: insets.bottom + Spacing.lg,
        }}
        style={{ maxHeight: boardHeight }}
      >
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.key);
          return (
            <View
              key={stage.key}
              style={[
                styles.mobileCol,
                { width: pageWidth, borderTopColor: stage.color },
              ]}
            >
              <View style={[styles.mobileColHeader, { backgroundColor: stage.color + '18' }]}>
                <T size="sm" weight="bold">{stage.emoji} {stage.label}</T>
                <T size="xs" color={Colors.textSecondary}>{stageLeads.length} লিড</T>
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                contentContainerStyle={{ padding: Spacing.sm, paddingBottom: Spacing.md }}
              >
                {stageLeads.length === 0 ? (
                  <Card padding={Spacing.lg}>
                    <T size="sm" color={Colors.textTertiary} style={{ textAlign: 'center' }}>
                      এই স্তরে কোনো লিড নেই
                    </T>
                    <T size="xs" color={Colors.textTertiary} style={{ textAlign: 'center', marginTop: Spacing.xs }}>
                      অন্য স্তর থেকে সরান অথবা নতুন লিড যোগ করুন
                    </T>
                  </Card>
                ) : (
                  stageLeads.map((lead) => (
                    <KanbanCard
                      key={lead.id}
                      lead={lead}
                      mobile
                      onMovePress={onMovePress}
                      onQuickAdvance={onQuickAdvance}
                    />
                  ))
                )}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      <T size="xs" color={Colors.textTertiary} style={styles.swipeHint}>
        ← সোয়াইপ করুন ({activeStage.emoji} {activeStage.label}) →
      </T>
    </View>
  );
};

// ─── Desktop board ─────────────────────────────────────────────────────────────

const DesktopKanban = ({
  leads,
  onMovePress,
}: {
  leads: Lead[];
  onMovePress: (lead: Lead) => void;
}) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colWidth = Math.floor(
    (width - Spacing.base * 2 - MOBILE_COL_GAP * (STAGES.length - 1)) / STAGES.length,
  );
  const colHeight = Math.min(height * 0.55, 520);

  return (
    <ScrollView
      horizontal
      style={{ flex: 1 }}
      contentContainerStyle={[
        styles.kanbanBoard,
        { paddingBottom: insets.bottom + Spacing.lg },
      ]}
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

  const handleQuickAdvance = (lead: Lead) => {
    const next = nextStage(lead.status);
    if (next) onMove(lead.id, next);
  };

  return (
    <>
      {isWide ? (
        <DesktopKanban leads={leads} onMovePress={setMoveLead} />
      ) : (
        <MobileKanban
          leads={leads}
          onMovePress={setMoveLead}
          onQuickAdvance={handleQuickAdvance}
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

      <View style={styles.toolbar}>
        <Row gap={Spacing.xs}>
          <Chip label="📋 তালিকা" active={view === 'list'} onPress={() => setView('list')} />
          <Chip label="🗂 Kanban" active={view === 'kanban'} onPress={() => setView('kanban')} />
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
  mobileKanban: { flex: 1 },
  stageTabs: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  stageTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginRight: Spacing.xs,
  },
  stageTabCount: {
    borderRadius: 999,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  mobileCol: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    borderTopWidth: 3,
    maxHeight: 400,
  },
  mobileColHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  swipeHint: {
    textAlign: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  kanbanBoard: {
    flexDirection: 'row',
    padding: Spacing.base,
    gap: MOBILE_COL_GAP,
  },
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
  kanbanBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  kanbanCard: {
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
  },
  scoreBadge: {
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  emptyCol: { textAlign: 'center', marginTop: Spacing.md, padding: Spacing.sm },
  moveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.bg,
    borderRadius: Radius.md,
    borderLeftWidth: 4,
  },
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    padding: Spacing.xl,
    paddingBottom: Spacing.xl + 8,
  },
});
