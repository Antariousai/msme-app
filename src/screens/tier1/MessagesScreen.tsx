import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatusPill, Chip, Btn, AISuggestion } from '../../components/atoms';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { Colors, Spacing, Radius } from '../../theme';
import { FacebookIcon, InstagramIcon, AutoReplyIcon, EscalateIcon, OrderIcon } from '../../icons';
import { seedMessages, Message } from '../../data/seed';

const platformIcon = (p: Message['platform']) =>
  p === 'facebook'
    ? <FacebookIcon size={18} color="#1877F2" />
    : <InstagramIcon size={18} color="#E4405F" />;

const statusMap: Record<Message['status'], { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = {
  new: { label: 'নতুন', type: 'info' },
  replied: { label: 'উত্তর দেওয়া', type: 'success' },
  escalated: { label: 'এসকেলেট', type: 'warning' },
  confirmed: { label: 'কনফার্ম', type: 'success' },
};

export const MessagesScreen = () => {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [filter, setFilter] = useState<'all' | 'facebook' | 'instagram'>('all');
  const [selected, setSelected] = useState<Message | null>(null);
  const [autoReplyOn, setAutoReplyOn] = useState(true);

  const filtered = filter === 'all' ? messages : messages.filter((m) => m.platform === filter);

  const sendAutoReply = (id: string) => {
    setMessages((prev) => prev.map((m) =>
      m.id === id ? { ...m, status: 'replied' as const, unread: false } : m
    ));
    setSelected(null);
  };

  const escalate = (id: string) => {
    setMessages((prev) => prev.map((m) =>
      m.id === id ? { ...m, status: 'escalated' as const } : m
    ));
    setSelected(null);
  };

  const confirmOrder = (id: string) => {
    setMessages((prev) => prev.map((m) =>
      m.id === id ? { ...m, status: 'confirmed' as const, unread: false } : m
    ));
    setSelected(null);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="মেসেজ" subtitle="Facebook + Instagram" notificationCount={messages.filter((m) => m.unread).length} />
      <ScreenScroll>
        <Card style={{ marginBottom: Spacing.base }}>
          <Row justify="space-between">
            <Row gap={Spacing.sm}>
              <AutoReplyIcon size={20} color={Colors.accent} />
              <View>
                <T size="sm" weight="semibold">অটো রিপ্লাই</T>
                <T size="xs" color={Colors.textTertiary}>সাধারণ প্রশ্নে স্বয়ংক্রিয় উত্তর</T>
              </View>
            </Row>
            <Pressable onPress={() => setAutoReplyOn(!autoReplyOn)}>
              <StatusPill label={autoReplyOn ? 'চালু' : 'বন্ধ'} type={autoReplyOn ? 'success' : 'neutral'} />
            </Pressable>
          </Row>
        </Card>

        <Row gap={Spacing.sm} style={{ marginBottom: Spacing.base }}>
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
            <Row gap={Spacing.sm} style={{ flexWrap: 'wrap' }}>
              {autoReplyOn && selected.status === 'new' && (
                <Btn label="অটো রিপ্লাই" onPress={() => sendAutoReply(selected.id)} size="sm" variant="secondary" />
              )}
              <Btn label="এসকেলেট" onPress={() => escalate(selected.id)} size="sm" variant="outline" icon={<EscalateIcon size={14} color={Colors.primary} />} />
              <Btn label="অর্ডার কনফার্ম" onPress={() => confirmOrder(selected.id)} size="sm" variant="primary" icon={<OrderIcon size={14} color={Colors.textInverse} />} />
            </Row>
          </Card>
        )}
      </ScreenScroll>
    </View>
  );
};

export const Tier1Home = () => {
  const unread = seedMessages.filter((m) => m.unread).length;
  return (
    <View style={styles.container}>
      <AppHeader showGreeting notificationCount={unread} />
      <ScreenScroll>
        <AISuggestion
          title="আজকের পরামর্শ"
          message="সন্ধ্যা ৭–৯টায় সবচেয়ে বেশি মেসেজ আসে — এই সময়ে সক্রিয় থাকুন।"
          actionLabel="মেসেজ দেখুন"
        />
        <Row gap={Spacing.sm} style={{ marginTop: Spacing.base, marginBottom: Spacing.base }}>
          <Card style={{ flex: 1 }}>
            <T size="xs" color={Colors.textTertiary}>নতুন মেসেজ</T>
            <T size="2xl" weight="bold" color={Colors.primary}>{unread}</T>
          </Card>
          <Card style={{ flex: 1 }}>
            <T size="xs" color={Colors.textTertiary}>অর্ডার অপেক্ষমাণ</T>
            <T size="2xl" weight="bold" color={Colors.warning}>২</T>
          </Card>
        </Row>
        <SectionHeader title="সাম্প্রতিক মেসেজ" />
        {seedMessages.slice(0, 3).map((m) => (
          <Card key={m.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
            <Row gap={Spacing.sm}>
              {platformIcon(m.platform)}
              <View style={{ flex: 1 }}>
                <T size="sm" weight="semibold">{m.sender}</T>
                <T size="xs" color={Colors.textSecondary} numberOfLines={1}>{m.preview}</T>
              </View>
            </Row>
          </Card>
        ))}

        <FeatureToolsSection title="টায়ার ০ সরঞ্জাম" />
      </ScreenScroll>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
});
