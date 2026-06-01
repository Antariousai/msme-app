import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Platform, Share, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { AppHeader } from '../../components/AppHeader';
import { T, Btn, BtnRow, Input } from '../../components/atoms';
import { HtmlPreview } from '../../components/HtmlPreview';
import { Colors, Spacing } from '../../theme';
import { DownloadIcon, SendIcon } from '../../icons';
import { getWebTemplateById, TemplateContext } from '../../templates';
import { useAuth } from '../../auth/AuthContext';

interface TemplatePreviewScreenProps {
  templateId: string;
  onBack: () => void;
}

export const TemplatePreviewScreen = ({ templateId, onBack }: TemplatePreviewScreenProps) => {
  const { user } = useAuth();
  const template = getWebTemplateById(templateId);
  const [tagline, setTagline] = useState('');
  const [busy, setBusy] = useState<'copy' | 'share' | 'download' | null>(null);

  const html = useMemo(() => {
    if (!template || !user) return '';
    const ctx: TemplateContext = {
      businessName: user.businessName,
      phone: user.phone,
      tagline: tagline.trim() || undefined,
    };
    return template.buildHtml(ctx);
  }, [template, user, tagline]);

  if (!template) {
    return (
      <View style={styles.container}>
        <AppHeader title="টেমপ্লেট" showGreeting={false} />
        <T align="center" color={Colors.textSecondary} style={{ padding: Spacing.xl }}>
          টেমপ্লেট পাওয়া যায়নি
        </T>
        <Btn label="ফিরে যান" onPress={onBack} variant="outline" fullWidth style={{ margin: Spacing.base }} />
      </View>
    );
  }

  const copyHtml = async () => {
    setBusy('copy');
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(html);
      } else {
        await Clipboard.setStringAsync(html);
      }
      if (Platform.OS === 'web') {
        window.alert('HTML ক্লিপবোর্ডে কপি হয়েছে');
      } else {
        Alert.alert('সংরক্ষিত', 'HTML ক্লিপবোর্ডে কপি হয়েছে');
      }
    } catch {
      if (Platform.OS === 'web') {
        window.alert('কপি করা যায়নি');
      } else {
        Alert.alert('ত্রুটি', 'কপি করা যায়নি');
      }
    } finally {
      setBusy(null);
    }
  };

  const shareHtml = async () => {
    setBusy('share');
    try {
      await Share.share({
        title: `${template.name} — ${user?.businessName}`,
        message: html.length > 8000 ? html.slice(0, 8000) + '\n…' : html,
      });
    } catch {
      // user cancelled
    } finally {
      setBusy(null);
    }
  };

  const downloadHtml = () => {
    setBusy('download');
    try {
      if (Platform.OS === 'web') {
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.id}-${user?.businessName ?? 'site'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        shareHtml();
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={template.name} subtitle="লাইভ প্রিভিউ" showGreeting={false} />
      <View style={styles.toolbar}>
        <Input
          label="ট্যাগলাইন (ঐচ্ছিক)"
          value={tagline}
          onChangeText={setTagline}
          placeholder="যেমন: ঈদ স্পেশাল অফার"
          style={{ marginBottom: Spacing.sm }}
        />
        <BtnRow>
          <Btn
            label="HTML কপি"
            onPress={copyHtml}
            variant="outline"
            flex
            size="sm"
            loading={busy === 'copy'}
          />
          <Btn
            label={Platform.OS === 'web' ? 'ডাউনলোড' : 'শেয়ার'}
            onPress={Platform.OS === 'web' ? downloadHtml : shareHtml}
            variant="secondary"
            flex
            size="sm"
            loading={busy === 'share' || busy === 'download'}
            icon={Platform.OS === 'web'
              ? <DownloadIcon size={14} color={Colors.textInverse} />
              : <SendIcon size={14} color={Colors.textInverse} />}
          />
        </BtnRow>
      </View>
      <HtmlPreview html={html} style={styles.preview} />
      <View style={styles.footer}>
        <Btn label="ফিরে যান" onPress={onBack} variant="ghost" fullWidth />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  toolbar: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  preview: { flex: 1 },
  footer: {
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
});
