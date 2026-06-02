import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatusPill, Chip, Btn, AISuggestion } from '../../components/atoms';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { ScreenFrame } from '../../components/ScreenFrame';
import { HeroCard } from '../../components/HeroCard';
import { Colors, Spacing } from '../../theme';
import { FacebookIcon, InstagramIcon, AutoReplyIcon, EscalateIcon, OrderIcon, CheckIcon } from '../../icons';
import { seedMessages, replyTemplates, Message } from '../../data/seed';
import { toBn } from '../../utils/helpers';
import { useFeatureNav } from '../../navigation/FeatureNavContext';
import { DashboardCreditScoreCard } from '../shared/CreditScoreScreen';

const platformIcon = (p: Message['platform']) =>
  p === 'facebook'
    ? <FacebookIcon size={18} color="#1877F2" />
    : <InstagramIcon size={18} color="#E4405F" />;

const statusMap: Record<Message['status'], { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = {
  new: { label: 'নতুন', type: 'info' },
  replied: { label: 'উত্তর দেওয়া', type: 'success' },
  escalated: { label: 'অনুমোদন অপেক্ষমাণ', type: 'warning' },
  confirmed: { label: 'কনফার্ম', type: 'success' },
};

export const MessagesScreen = () => {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [filter, setFilter] = useState<'all' | 'facebook' | 'instagram'>('all');
  const [selected, setSelected] = useState<Message | null>(null);
  const [autoReplyOn, setAutoReplyOn] = useState(true);

  const filtered = filter === 'all' ? messages : messages.filter((m) => m.platform === filter);
  const escalated = messages.filter((m) => m.status === 'escalated');

  const setStatus = (id: string, status: Message['status']) => {
    setMessages((prev) => prev.map((m) =>
      m.id === id ? { ...m, status, unread: false } : m
    ));
    setSelected(null);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="মেসেজ" subtitle="Facebook + Instagram" notificationCount={messages.filter((m) => m.unread).length} />
      <ScreenScroll>
        <Card style={{ marginBottom: Spacing.base }}>
          <Row justify="space-between">
            <Row gap={Spacing.sm} style={{ flex: 1, minWidth: 0 }}>
              <AutoReplyIcon size={20} color={Colors.accent} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <T size="sm" weight="semibold">অটো রিপ্লাই</T>
                <T size="xs" color={Colors.textTertiary}>সাধারণ প্রশ্নে টেমপ্লেট উত্তর</T>
              </View>
            </Row>
            <Pressable onPress={() => setAutoReplyOn(!autoReplyOn)}>
              <StatusPill label={autoReplyOn ? 'চালু' : 'বন্ধ'} type={autoReplyOn ? 'success' : 'neutral'} />
            </Pressable>
          </Row>
        </Card>

        {escalated.length > 0 && (
          <Card style={{ marginBottom: Spacing.base, backgroundColor: Colors.warningLight }}>
            <Row gap={Spacing.sm} style={{ marginBottom: Spacing.sm }}>
              <EscalateIcon size={18} color={Colors.warning} />
              <T size="sm" weight="bold" color={Colors.warning}>অনুমোদন প্রয়োজন ({escalated.length})</T>
            </Row>
            {escalated.map((m) => (
              <View key={m.id} style={{ marginBottom: Spacing.sm }}>
                <T size="sm" weight="semibold">{m.sender}</T>
                <T size="xs" color={Colors.textSecondary} numberOfLines={1}>{m.preview}</T>
                <Row gap={Spacing.sm} wrap style={{ marginTop: Spacing.xs }}>
                  <Btn label="অনুমোদন" onPress={() => setStatus(m.id, 'replied')} size="sm" variant="secondary" icon={<CheckIcon size={14} color={Colors.textInverse} />} />
                  <Btn label="বাতিল" onPress={() => setStatus(m.id, 'new')} size="sm" variant="outline" />
                </Row>
              </View>
            ))}
          </Card>
        )}

        <Row gap={Spacing.sm} wrap style={{ marginBottom: Spacing.base }}>
          {(['all', 'facebook', 'instagram'] as const).map((f) => (
            <Chip key={f} label={f === 'all' ? 'সব' : f === 'facebook' ? 'Facebook' : 'Instagram'} active={filter === f} onPress={() => setFilter(f)} />
          ))}
        </Row>

        <SectionHeader title="ইনবক্স" />
        {filtered.map((msg) => {
          const st = statusMap[msg.status];
          return (
            <Card key={msg.id} onPress={() => setSelected(msg)} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
              <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
                <Row gap={Spacing.sm}>
                  {platformIcon(msg.platform)}
                  <T size="sm" weight="semibold">{msg.sender}</T>
                  {msg.unread && <View style={styles.unreadDot} />}
                </Row>
                <T size="xs" color={Colors.textTertiary}>{msg.time}</T>
              </Row>
              <T size="sm" color={Colors.textSecondary} numberOfLines={2}>{msg.preview}</T>
              <View style={{ marginTop: Spacing.sm }}>
                <StatusPill label={st.label} type={st.type} />
              </View>
            </Card>
          );
        })}

        {selected && (
          <Card style={{ marginTop: Spacing.base, borderWidth: 2, borderColor: Colors.primary }}>
            <T size="md" weight="bold" style={{ marginBottom: Spacing.sm }}>{selected.sender}</T>
            <T size="sm" color={Colors.textSecondary} style={{ marginBottom: Spacing.base }}>{selected.preview}</T>
            {autoReplyOn && (
              <>
                <T size="xs" weight="semibold" color={Colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
                  টেমপ্লেট রিপ্লাই
                </T>
                <Row gap={Spacing.sm} wrap style={{ marginBottom: Spacing.md }}>
                  {replyTemplates.map((t) => (
                    <Chip key={t.id} label={t.trigger} onPress={() => setStatus(selected.id, 'replied')} />
                  ))}
                </Row>
              </>
            )}
            <Row gap={Spacing.sm} wrap>
              <Btn label="এসকেলেট" onPress={() => setStatus(selected.id, 'escalated')} size="sm" variant="outline" icon={<EscalateIcon size={14} color={Colors.primary} />} />
              <Btn label="অর্ডার কনফার্ম" onPress={() => setStatus(selected.id, 'confirmed')} size="sm" variant="primary" icon={<OrderIcon size={14} color={Colors.textInverse} />} />
            </Row>
          </Card>
        )}
      </ScreenScroll>
    </View>
  );
};

export const Tier1Home = () => {
  const { openFeature } = useFeatureNav();
  const unread = seedMessages.filter((m) => m.unread).length;
  return (
    <ScreenFrame>
      <AppHeader showGreeting notificationCount={unread} />
      <ScreenScroll>
        <HeroCard
          title="💬 স্টার্টার হোম"
          metric={toBn(unread)}
          metricLabel="নতুন মেসেজ"
          stats={[
            { label: 'অর্ডার অপেক্ষমাণ', value: '২ 📋' },
          ]}
        />
        <DashboardCreditScoreCard onPress={() => openFeature('creditScore')} />
        <AISuggestion
          title="🔥 আজকের পরামর্শ"
          message="সন্ধ্যা ৭–৯টায় সবচেয়ে বেশি মেসেজ আসে — এই সময়ে সক্রিয় থাকুন।"
          actionLabel="মেসেজ দেখুন"
        />
        <FeatureToolsSection layout="grid" scope="all" />
      </ScreenScroll>
    </ScreenFrame>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
});
