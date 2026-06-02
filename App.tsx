import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  BalooDa2_400Regular,
  BalooDa2_500Medium,
  BalooDa2_600SemiBold,
  BalooDa2_700Bold,
} from '@expo-google-fonts/baloo-da-2';
import { AuthProvider } from './src/auth/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/theme';

const AppRoot = () => {
  const { isDark } = useTheme();
  return (
    <>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    BalooDa2_400Regular,
    BalooDa2_500Medium,
    BalooDa2_600SemiBold,
    BalooDa2_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#eef8fd', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#27a7e1" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppRoot />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
