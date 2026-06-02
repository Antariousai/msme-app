import React, { useState, useMemo } from 'react';
import { View, Pressable, Modal, useWindowDimensions } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Row, ScreenScroll, Card, Btn, Input, SectionHeader } from '../../components/atoms';
import { ScreenFrame } from '../../components/ScreenFrame';
import { Colors, Spacing, Radius } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { calendarEvents, CalendarEvent } from '../../data/seed';
import { toBn } from '../../utils/helpers';

const DAYS   = ['রবি', 'সোম', 'মঙ্গ', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
const MONTHS = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন',
                'জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
const MONTHS_S = ['জানু','ফেব','মার্চ','এপ্রি','মে','জুন','জুলা','আগ','সেপ','অক্টো','নভে','ডিসে'];

const TYPE_COLOR: Record<CalendarEvent['type'], string> = {
  market:    Colors.income,
  inventory: Colors.primary,
  promo:     Colors.expense,
  finance:   Colors.ai,
};
const TYPE_LABEL: Record<CalendarEvent['type'], string> = {
  market:    '🏪 হাট/বাজার',
  inventory: '📦 স্টক',
  promo:     '📣 প্রচার',
  finance:   '📒 হিসাব',
};
const EVENT_TYPES = Object.keys(TYPE_LABEL) as CalendarEvent['type'][];

const todayISO = () => new Date().toISOString().split('T')[0];
const ymd = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const fmtISO = (iso: string) => {
  const [y, mm, dd] = iso.split('-');
  return `${toBn(+dd)} ${MONTHS_S[+mm - 1]} ${toBn(+y)}`;
};

export const CalendarScreen = () => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const today = todayISO();
  const now = new Date();

  const [year, setYear]     = useState(now.getFullYear());
  const [month, setMonth]   = useState(now.getMonth());
  const [selected, setSel]  = useState(today);
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
  const [modal, setModal]   = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [evType, setEvType]     = useState<CalendarEvent['type']>('market');

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow    = new Date(year, month, 1).getDay();

  const cells = useMemo<(number | null)[]>(() => {
    const a: (number | null)[] = Array(startDow).fill(null);
    for (let d = 1; d <= daysInMonth; d++) a.push(d);
    while (a.length % 7) a.push(null);
    return a;
  }, [year, month, daysInMonth, startDow]);

  const evMap = useMemo(() => {
    const m: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => { (m[e.date] ??= []).push(e); });
    return m;
  }, [events]);

  const selEvents = evMap[selected] ?? [];

  const goMonth = (dir: -1 | 1) => {
    const nm = month + dir;
    if (nm < 0)  { setMonth(11); setYear((y) => y - 1); }
    else if (nm > 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth(nm);
  };

  const saveEvent = () => {
    if (!newTitle.trim()) return;
    setEvents((prev) => [...prev, {
      id: `e${Date.now()}`, title: newTitle.trim(), date: selected, type: evType,
    }]);
    setNewTitle('');
    setModal(false);
  };

  const cellW = Math.floor((width - Spacing.base * 2) / 7);

  return (
    <ScreenFrame>
      <AppHeader title="ক্যালেন্ডার" subtitle="পরিকল্পনা ও ইভেন্ট" />
      <ScreenScroll>

        {/* ── Calendar grid card ── */}
        <Card style={{ padding: Spacing.sm, marginBottom: Spacing.base }}>

          {/* Month navigation */}
          <Row justify="space-between" align="center" style={{ marginBottom: Spacing.sm, paddingHorizontal: Spacing.xs }}>
            <Pressable onPress={() => goMonth(-1)} style={{ padding: Spacing.sm, borderRadius: Radius.full }}>
              <T size="xl" color={colors.primary} weight="bold">‹</T>
            </Pressable>
            <T size="md" weight="bold">{MONTHS[month]} {toBn(year)}</T>
            <Pressable onPress={() => goMonth(1)} style={{ padding: Spacing.sm, borderRadius: Radius.full }}>
              <T size="xl" color={colors.primary} weight="bold">›</T>
            </Pressable>
          </Row>

          {/* Day headers */}
          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            {DAYS.map((d) => (
              <View key={d} style={{ width: cellW, alignItems: 'center', paddingVertical: 4 }}>
                <T size="xs" color={colors.textTertiary} weight="semibold">{d}</T>
              </View>
            ))}
          </View>

          {/* Thin separator */}
          <View style={{ height: 1, backgroundColor: colors.borderLight, marginBottom: 4 }} />

          {/* Day cells */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {cells.map((day, i) => {
              if (!day) return <View key={i} style={{ width: cellW, height: 48 }} />;
              const iso     = ymd(year, month, day);
              const isToday = iso === today;
              const isSel   = iso === selected;
              const dots    = evMap[iso] ?? [];
              return (
                <Pressable
                  key={i}
                  onPress={() => setSel(iso)}
                  style={{ width: cellW, height: 48, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}
                >
                  <View style={{
                    width: 30, height: 30, borderRadius: 15,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isSel
                      ? colors.primary
                      : isToday
                        ? colors.chip
                        : 'transparent',
                    borderWidth: isToday && !isSel ? 1.5 : 0,
                    borderColor: colors.primary,
                  }}>
                    <T
                      size="sm"
                      weight={isToday || isSel ? 'bold' : 'regular'}
                      color={isSel ? '#fff' : isToday ? colors.primary : colors.textPrimary}
                    >
                      {toBn(day)}
                    </T>
                  </View>
                  {dots.length > 0 && (
                    <View style={{ flexDirection: 'row', gap: 2, marginTop: 2 }}>
                      {dots.slice(0, 3).map((ev, j) => (
                        <View key={j} style={{
                          width: 5, height: 5, borderRadius: 3,
                          backgroundColor: TYPE_COLOR[ev.type],
                        }} />
                      ))}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* ── Events for selected day ── */}
        <View>
          <SectionHeader
            title={`📅 ${fmtISO(selected)}`}
            action="+ যোগ করুন"
            onAction={() => setModal(true)}
          />
          {selEvents.length === 0 ? (
            <T size="sm" color={colors.textTertiary} style={{ marginBottom: Spacing.base }}>
              এই দিনে কোনো ইভেন্ট নেই।
            </T>
          ) : (
            selEvents.map((ev) => (
              <Card key={ev.id} style={{ marginBottom: Spacing.sm, paddingLeft: 0, overflow: 'hidden' }} padding={0}>
                <Row gap={0} align="stretch">
                  <View style={{ width: 4, backgroundColor: TYPE_COLOR[ev.type] }} />
                  <View style={{ flex: 1, padding: Spacing.md }}>
                    <T size="sm" weight="semibold">{ev.title}</T>
                    <T size="xs" color={colors.textSecondary}>{TYPE_LABEL[ev.type]}</T>
                  </View>
                </Row>
              </Card>
            ))
          )}
        </View>

      </ScreenScroll>

      {/* ── Add event modal ── */}
      <Modal visible={modal} transparent animationType="slide">
        <Pressable
          style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' }}
          onPress={() => setModal(false)}
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: Radius['2xl'],
              borderTopRightRadius: Radius['2xl'],
              padding: Spacing.xl,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <T size="lg" weight="bold" style={{ marginBottom: 4 }}>📅 নতুন ইভেন্ট</T>
            <T size="xs" color={colors.textSecondary} style={{ marginBottom: Spacing.base }}>{fmtISO(selected)}</T>
            <Input
              label="শিরোনাম"
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="যেমন: হাট দিবস, স্টক রিফিল"
              style={{ marginBottom: Spacing.md }}
            />
            <T size="sm" weight="semibold" style={{ marginBottom: Spacing.sm }}>ধরন বেছে নিন</T>
            <Row gap={Spacing.sm} wrap style={{ marginBottom: Spacing.xl }}>
              {EVENT_TYPES.map((t) => (
                <Btn
                  key={t}
                  label={TYPE_LABEL[t]}
                  size="sm"
                  variant={evType === t ? 'primary' : 'ghost'}
                  onPress={() => setEvType(t)}
                />
              ))}
            </Row>
            <Btn label="সংরক্ষণ করুন" onPress={saveEvent} fullWidth />
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenFrame>
  );
};
