import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, Btn, Input, StatusPill } from '../../components/atoms';
import { Colors, Spacing, Radius, BrandStudioAddOn } from '../../theme';
import { BrandIcon, CopywriteIcon, WebsiteIcon, CheckIcon } from '../../icons';
import { brandCaptions } from '../../data/seed';
import { WEB_TEMPLATES } from '../../templates';
import { TemplatePreviewScreen } from './TemplatePreviewScreen';
import { useAuth } from '../../auth/AuthContext';

export const BrandStudioScreen = ({ onBack }: { onBack: () => void }) => {
  const { user, setBrandStudioAddOn } = useAuth();
  const [productName, setProductName] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const subscribed = user?.addOns.brandStudio ?? false;

  const generateCaption = () => {
    const base = brandCaptions[Math.floor(Math.random() * brandCaptions.length)];
    setGeneratedCaption(productName ? base.replace('কটন কুর্তি', productName) : base);
  };

  const subscribe = async () => {
    setSubscribing(true);
    await setBrandStudioAddOn(true);
    setSubscribing(false);
  };

  if (!subscribed) {
    return (
      <View style={styles.container}>
        <AppHeader title="Brand Studio" subtitle="পেইড অ্যাড-অন" showGreeting={false} />
        <ScreenScroll>
          <Card style={{ marginBottom: Spacing.base, backgroundColor: Colors.brandStudio + '12' }}>
            <Row gap={Spacing.sm}>
              <BrandIcon size={24} color={Colors.brandStudio} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <T size="md" weight="bold">Brand Studio অ্যাড-অন</T>
                <T size="sm" color={Colors.textSecondary}>{BrandStudioAddOn.tagline}</T>
              </View>
            </Row>
          </Card>

          <Card style={{ marginBottom: Spacing.base }}>
            <Row justify="space-between" align="center" style={{ marginBottom: Spacing.md }}>
              <T size="sm" color={Colors.textSecondary}>মাসিক মূল্য</T>
              <T size="xl" weight="bold" color={Colors.brandStudio}>৳{BrandStudioAddOn.price}/মাস</T>
            </Row>
            {['লোগো সাপোর্ট', 'ক্যাপশন ও কপিরাইটিং', 'ওয়েব টেমপ্লেট'].map((f) => (
              <Row key={f} gap={Spacing.sm} style={{ marginBottom: Spacing.xs }}>
                <CheckIcon size={16} color={Colors.success} />
                <T size="sm" color={Colors.textSecondary}>{f}</T>
              </Row>
            ))}
          </Card>

          <Btn label="অ্যাড-অন চালু করুন" onPress={subscribe} loading={subscribing} fullWidth />
          <Btn label="ফিরে যান" onPress={onBack} variant="outline" fullWidth style={{ marginTop: Spacing.sm }} />
        </ScreenScroll>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Brand Studio" subtitle="লোগো · ক্যাপশন · ওয়েব টেমপ্লেট" showGreeting={false} />
      <ScreenScroll>
        <Card style={{ marginBottom: Spacing.base, backgroundColor: Colors.brandStudio + '12' }}>
          <Row gap={Spacing.sm}>
            <BrandIcon size={24} color={Colors.brandStudio} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <T size="md" weight="bold">আপনার ব্র্যান্ড তৈরি করুন</T>
              <T size="sm" color={Colors.textSecondary}>AI-সহায়তায় ক্যাপশন, লোগো ও ওয়েবসাইট</T>
            </View>
            <StatusPill label="চালু" type="success" />
          </Row>
        </Card>

        <SectionHeader title="লোগো সাপোর্ট" />
        <Card style={{ marginBottom: Spacing.base }}>
          <View style={styles.logoPlaceholder}>
            <BrandIcon size={40} color={Colors.textTertiary} />
            <T size="sm" color={Colors.textTertiary} style={{ marginTop: Spacing.sm }}>লোগো আপলোড করুন</T>
          </View>
          <Btn label="লোগো নির্বাচন" onPress={() => {}} variant="outline" fullWidth style={{ marginTop: Spacing.md }} />
        </Card>

        <SectionHeader title="ক্যাপশন ও কপিরাইটিং" />
        <Input
          label="পণ্য/অফারের নাম"
          value={productName}
          onChangeText={setProductName}
          placeholder="যেমন: জামদানি শাড়ি"
          style={{ marginBottom: Spacing.md }}
        />
        <Btn
          label="ক্যাপশন তৈরি করুন"
          onPress={generateCaption}
          fullWidth
          icon={<CopywriteIcon size={16} color={Colors.textInverse} />}
          style={{ marginBottom: Spacing.base }}
        />
        {generatedCaption ? (
          <Card style={{ marginBottom: Spacing.base, backgroundColor: Colors.bgDark }}>
            <T size="sm" weight="semibold" style={{ marginBottom: Spacing.sm }}>প্রস্তাবিত ক্যাপশন</T>
            <T size="sm" color={Colors.textSecondary}>{generatedCaption}</T>
            <Btn label="কপি করুন" onPress={() => {}} variant="ghost" size="sm" style={{ marginTop: Spacing.md, alignSelf: 'flex-start' }} />
          </Card>
        ) : null}

        <SectionHeader title="ওয়েব টেমপ্লেট" />
        {WEB_TEMPLATES.map((tpl) => (
          <Card
            key={tpl.id}
            style={{ marginBottom: Spacing.sm }}
            padding={Spacing.md}
            onPress={() => setPreviewId(tpl.id)}
          >
            <Row justify="space-between" align="center">
              <Row gap={Spacing.sm} style={{ flex: 1, minWidth: 0 }}>
                <WebsiteIcon size={20} color={Colors.brandStudio} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Row gap={Spacing.sm}>
                    <T size="sm" weight="semibold">{tpl.name}</T>
                    {tpl.tag ? <StatusPill label={tpl.tag} type="info" /> : null}
                  </Row>
                  <T size="xs" color={Colors.textTertiary} numberOfLines={1}>{tpl.desc}</T>
                </View>
              </Row>
              <Btn label="প্রিভিউ" onPress={() => setPreviewId(tpl.id)} size="sm" variant="outline" />
            </Row>
          </Card>
        ))}

        <Btn label="ফিরে যান" onPress={onBack} variant="outline" fullWidth style={{ marginTop: Spacing.base }} />
      </ScreenScroll>

      <Modal visible={previewId !== null} animationType="slide">
        {previewId && (
          <TemplatePreviewScreen templateId={previewId} onBack={() => setPreviewId(null)} />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  logoPlaceholder: {
    height: 120,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
});
