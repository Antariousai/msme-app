import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatusPill, Chip, Btn } from '../../components/atoms';
import { Colors, Spacing } from '../../theme';
import { FacebookIcon, InstagramIcon, AutoReplyIcon } from '../../icons';
import { seedComments, replyTemplates, Comment } from '../../data/seed';

const platformIcon = (p: Comment['platform']) =>
  p === 'facebook'
    ? <FacebookIcon size={16} color="#1877F2" />
    : <InstagramIcon size={16} color="#E4405F" />;

const statusMap: Record<Comment['status'], { label: string; type: 'success' | 'info' | 'neutral' }> = {
  new: { label: 'নতুন', type: 'info' },
  replied: { label: 'উত্তর দেওয়া', type: 'success' },
  hidden: { label: 'লুকানো', type: 'neutral' },
};

export const CommentsScreen = () => {
  const [comments, setComments] = useState<Comment[]>(seedComments);
  const [autoReplyOn, setAutoReplyOn] = useState(true);
  const [selected, setSelected] = useState<Comment | null>(null);

  const applyReply = (id: string) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'replied' as const } : c)));
    setSelected(null);
  };

  const newCount = comments.filter((c) => c.status === 'new').length;

  return (
    <View style={styles.container}>
      <AppHeader title="কমেন্ট" subtitle="Facebook + Instagram" notificationCount={newCount} />
      <ScreenScroll>
        <Card style={{ marginBottom: Spacing.base }}>
          <Row justify="space-between">
            <Row gap={Spacing.sm} style={{ flex: 1, minWidth: 0 }}>
              <AutoReplyIcon size={20} color={Colors.accent} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <T size="sm" weight="semibold">স্বয়ংক্রিয় কমেন্ট রিপ্লাই</T>
                <T size="xs" color={Colors.textTertiary}>সাধারণ কমেন্টে টেমপ্লেট দিয়ে উত্তর</T>
              </View>
            </Row>
            <Pressable onPress={() => setAutoReplyOn(!autoReplyOn)}>
              <StatusPill label={autoReplyOn ? 'চালু' : 'বন্ধ'} type={autoReplyOn ? 'success' : 'neutral'} />
            </Pressable>
          </Row>
        </Card>

        <SectionHeader title="কমেন্ট" />
        {comments.map((c) => {
          const st = statusMap[c.status];
          return (
            <Card key={c.id} onPress={() => setSelected(c)} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
              <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
                <Row gap={Spacing.sm}>
                  {platformIcon(c.platform)}
                  <T size="sm" weight="semibold">{c.author}</T>
                </Row>
                <T size="xs" color={Colors.textTertiary}>{c.time}</T>
              </Row>
              <T size="xs" color={Colors.textTertiary} numberOfLines={1}>{c.post}</T>
              <T size="sm" color={Colors.textSecondary} style={{ marginTop: 2 }}>{c.text}</T>
              <View style={{ marginTop: Spacing.sm }}>
                <StatusPill label={st.label} type={st.type} />
              </View>
            </Card>
          );
        })}

        {selected && (
          <Card style={{ marginTop: Spacing.base, borderWidth: 2, borderColor: Colors.primary }}>
            <T size="sm" weight="bold">{selected.author}</T>
            <T size="sm" color={Colors.textSecondary} style={{ marginBottom: Spacing.base }}>{selected.text}</T>
            <T size="xs" weight="semibold" color={Colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
              দ্রুত উত্তর টেমপ্লেট
            </T>
            <Row gap={Spacing.sm} wrap style={{ marginBottom: Spacing.md }}>
              {replyTemplates.map((t) => (
                <Chip key={t.id} label={t.trigger} onPress={() => applyReply(selected.id)} />
              ))}
            </Row>
            <Btn label="রিপ্লাই পাঠান" onPress={() => applyReply(selected.id)} fullWidth size="sm" />
          </Card>
        )}
      </ScreenScroll>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
});
