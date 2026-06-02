import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
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
    TiroBangla_400Regular: require('./assets/fonts/TiroBangla-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ecfeff', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0e7490" />
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
