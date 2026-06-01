import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../theme';

interface HtmlPreviewProps {
  html: string;
  style?: ViewStyle;
}

/** Renders HTML preview — WebView on native, iframe on web */
export const HtmlPreview = ({ html, style }: HtmlPreviewProps) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        {React.createElement('iframe', {
          title: 'template-preview',
          srcDoc: html,
          style: {
            flex: 1,
            width: '100%',
            minHeight: 400,
            height: '100%',
            border: 'none',
            backgroundColor: Colors.bg,
          },
        })}
      </View>
    );
  }

  return (
    <WebView
      source={{ html }}
      style={[styles.container, style]}
      originWhitelist={['*']}
      scrollEnabled
      showsVerticalScrollIndicator
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    overflow: 'hidden',
  },
});
