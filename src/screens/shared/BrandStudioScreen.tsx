import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, Btn, Input } from '../../components/atoms';
import { Colors, Spacing, Radius } from '../../theme';
import { BrandIcon, CopywriteIcon, ChevronRightIcon } from '../../icons';
import { brandCaptions } from '../../data/seed';

export const BrandStudioScreen = ({ onBack }: { onBack: () => void }) => {
  const [productName, setProductName] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');

  const generateCaption = () => {
    const base = brandCaptions[Math.floor(Math.random() * brandCaptions.length)];
    setGeneratedCaption(productName ? base.replace('কটন কুর্তি', productName) : base);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Brand Studio" subtitle="লোগো · ক্যাপশন · কপিরাইটিং" showGreeting={false} />
      <ScreenScroll>
        <Card style={{ marginBottom: Spacing.base, backgroundColor: Colors.brandStudio + '12' }}>
          <Row gap={Spacing.sm}>
            <BrandIcon size={24} color={Colors.brandStudio} />
            <View>
              <T size="md" weight="bold">আপনার ব্র্যান্ড তৈরি করুন</T>
              <T size="sm" color={Colors.textSecondary}>AI-সহায়তায় ক্যাপশন ও কপি</T>
            </View>
          </Row>
        </Card>

        <SectionHeader title="লোগো সাপোর্ট" />
        <Card style={{ marginBottom: Spacing.base }}>
          <T size="sm" color={Colors.textSecondary} style={{ marginBottom: Spacing.md }}>
            আপনার ব্যবসার জন্য সহজ লোগো আপলোড বা তৈরি করুন
          </T>
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

        <SectionHeader title="প্রস্তুত টেমপ্লেট" />
        {brandCaptions.map((cap, i) => (
          <Card key={i} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
            <T size="sm" color={Colors.textSecondary}>{cap}</T>
          </Card>
        ))}

        <Btn label="ফিরে যান" onPress={onBack} variant="outline" fullWidth style={{ marginTop: Spacing.base }} />
      </ScreenScroll>
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
