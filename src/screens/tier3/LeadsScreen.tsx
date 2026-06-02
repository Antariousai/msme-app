import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatusPill, Btn, Input, AISuggestion } from '../../components/atoms';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { ScreenFrame } from '../../components/ScreenFrame';
import { HeroCard } from '../../components/HeroCard';
import { Colors, Spacing, Radius } from '../../theme';
import { LeadIcon, PhoneIcon, LocationIcon, StarIcon, UpsellIcon, PlusIcon } from '../../icons';
import { seedLeads, Lead, aiSuggestions } from '../../data/seed';
import { toBn, generateId } from '../../utils/helpers';

const scoreColor = (score: number) => {
  if (score >= 80) return Colors.success;
  if (score >= 50) return Colors.warning;
  return Colors.textTertiary;
};

const statusMap: Record<Lead['status'], { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = {
  new: { label: 'নতুন', type: 'info' },
  contacted: { label: 'যোগাযোগ', type: 'warning' },
  qualified: { label: 'যোগ্য', type: 'success' },
  converted: { label: 'রূপান্তর', type: 'success' },
  lost: { label: 'হারানো', type: 'error' },
};

export const LeadsScreen = () => {
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [automationOn, setAutomationOn] = useState(true);
  const [upsellSent, setUpsellSent] = useState<Set<string>>(new Set());

  const sendUpsell = (id: string) => {
    setUpsellSent((prev) => new Set(prev).add(id));
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

  const contactLead = (id: string) => {
    setLeads((prev) => prev.map((l) =>
      l.id === id ? { ...l, status: 'contacted' as const, lastContact: 'আজ' } : l
    ));
  };

  const sorted = [...leads].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.container}>
      <AppHeader title="লিড" subtitle="ক্যাপচার · স্কোর · আপসেল" />
      <ScreenScroll>
        <Btn
          label="নতুন লিড যোগ"
          onPress={() => setModalVisible(true)}
          fullWidth
          icon={<PlusIcon size={16} color={Colors.textInverse} />}
          style={{ marginBottom: Spacing.base }}
        />

        <Card style={{ marginBottom: Spacing.base }}>
          <Row justify="space-between">
            <Row gap={Spacing.sm} style={{ flex: 1, minWidth: 0 }}>
              <UpsellIcon size={20} color={Colors.tier3} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <T size="sm" weight="semibold">আপসেল ও ক্রস-সেল অটোমেশন</T>
                <T size="xs" color={Colors.textTertiary}>যোগ্য লিডে স্বয়ংক্রিয় অফার পাঠান</T>
              </View>
            </Row>
            <Pressable onPress={() => setAutomationOn(!automationOn)}>
              <StatusPill label={automationOn ? 'চালু' : 'বন্ধ'} type={automationOn ? 'success' : 'neutral'} />
            </Pressable>
          </Row>
        </Card>

        {aiSuggestions.leads.map((s, i) => (
          <View key={i} style={{ marginBottom: Spacing.sm }}>
            <AISuggestion title={s.title} message={s.message} actionLabel="কাজ করুন" />
          </View>
        ))}

        <SectionHeader title="লিড র‍্যাঙ্কিং" />
        {sorted.map((lead) => {
          const st = statusMap[lead.status];
          return (
            <Card key={lead.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
              <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
                <T size="sm" weight="bold">{lead.name}</T>
                <Row gap={Spacing.xs}>
                  <StarIcon size={14} color={scoreColor(lead.score)} />
                  <T size="sm" weight="bold" color={scoreColor(lead.score)}>{toBn(lead.score)}</T>
                </Row>
              </Row>
              <Row gap={Spacing.xs} style={{ marginBottom: Spacing.xs }}>
                <PhoneIcon size={12} color={Colors.textTertiary} />
                <T size="xs" color={Colors.textSecondary}>{lead.phone}</T>
              </Row>
              {lead.address ? (
                <Row gap={Spacing.xs} style={{ marginBottom: Spacing.xs }}>
                  <LocationIcon size={12} color={Colors.textTertiary} />
                  <T size="xs" color={Colors.textSecondary}>{lead.address}</T>
                </Row>
              ) : null}
              <Row justify="space-between" align="center" style={{ marginTop: Spacing.sm }}>
                <StatusPill label={st.label} type={st.type} />
                <T size="xs" color={Colors.textTertiary}>{lead.source} · {lead.lastContact}</T>
              </Row>
              {upsellSent.has(lead.id) && (
                <View style={{ marginTop: Spacing.sm }}>
                  <StatusPill label="আপসেল অফার পাঠানো হয়েছে" type="success" />
                </View>
              )}
              {lead.status === 'new' || lead.status === 'contacted' ? (
                <Row gap={Spacing.sm} wrap style={{ marginTop: Spacing.sm }}>
                  <Btn label="কল/মেসেজ" onPress={() => contactLead(lead.id)} size="sm" variant="secondary" />
                  <Btn
                    label={upsellSent.has(lead.id) ? 'আবার পাঠান' : 'আপসেল অফার'}
                    onPress={() => sendUpsell(lead.id)}
                    size="sm"
                    variant="outline"
                    icon={<UpsellIcon size={14} color={Colors.primary} />}
                  />
                </Row>
              ) : null}
            </Card>
          );
        })}
      </ScreenScroll>

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
    </View>
  );
};

export const Tier3Home = () => {
  const hotLeads = seedLeads.filter((l) => l.score >= 70).length;
  return (
    <ScreenFrame>
      <AppHeader showGreeting />
      <ScreenScroll>
        <HeroCard
          title="🎯 প্রো ড্যাশবোর্ড"
          metric={toBn(seedLeads.length)}
          metricLabel="মোট লিড"
          stats={[
            { label: 'হট লিড', value: `${toBn(hotLeads)} 🔥` },
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
  container: { flex: 1, backgroundColor: Colors.bg },
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'], padding: Spacing.xl },
});
