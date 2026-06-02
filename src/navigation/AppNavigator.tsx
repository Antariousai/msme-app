import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, UserTier } from '../auth/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { TierSelectScreen } from '../screens/shared/TierSelectScreen';
import { MoreScreen } from '../screens/shared/MoreScreen';
import { BrandStudioScreen } from '../screens/shared/BrandStudioScreen';
import { Tier0Home } from '../screens/tier0/BookkeepingScreen';
import { Tier1Home } from '../screens/tier1/MessagesScreen';
import { Tier2Home } from '../screens/tier2/OrdersScreen';
import { Tier3Home } from '../screens/tier3/LeadsScreen';
import { Tier4Home } from '../screens/tier4/DashboardScreen';
import { FeatureNavProvider } from './FeatureNavContext';
import { getPrimaryTabIds, getFeatureById } from './features';
import { T } from '../components/atoms';
import { Spacing } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { makeEmojiIcon, NAV_EMOJI } from '../icons/emoji';
import { Bounce } from '../components/motion';

const Tab = createBottomTabNavigator();
const HomeIcon = makeEmojiIcon(NAV_EMOJI.home);
const MoreIcon = makeEmojiIcon(NAV_EMOJI.more);

const HOME_COMPONENTS: Record<UserTier, React.ComponentType> = {
  0: Tier0Home,
  1: Tier1Home,
  2: Tier2Home,
  3: Tier3Home,
  4: Tier4Home,
};

function getHomeComponent(tier: UserTier): React.ComponentType {
  if (tier >= 4) return HOME_COMPONENTS[4];
  if (tier >= 3) return HOME_COMPONENTS[3];
  if (tier >= 2) return HOME_COMPONENTS[2];
  if (tier >= 1) return HOME_COMPONENTS[1];
  return HOME_COMPONENTS[0];
}

function makeMoreScreen(onSelectTier: () => void, onOpenBrandStudio: () => void) {
  return function MoreTabScreen() {
    return <MoreScreen onSelectTier={onSelectTier} onOpenBrandStudio={onOpenBrandStudio} />;
  };
}

function buildNavTheme(mode: 'light' | 'dark', colors: ReturnType<typeof useTheme>['colors']) {
  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: colors.bg,
      card: colors.surface,
      border: colors.border,
      primary: colors.primary,
      text: colors.textPrimary,
    },
  };
}

function MainTabs({ onSelectTier, onOpenBrandStudio }: { onSelectTier: () => void; onOpenBrandStudio: () => void }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { colors, mode } = useTheme();
  const tier = user?.tier ?? 0;
  const primaryIds = getPrimaryTabIds(tier);
  const HomeComponent = getHomeComponent(tier);

  const tabScreens = [
    { name: 'Home', label: 'হোম', component: HomeComponent, icon: HomeIcon },
    ...primaryIds.map((id) => {
      const feat = getFeatureById(id)!;
      return { name: feat.id, label: feat.label, component: feat.component, icon: feat.icon };
    }),
    { name: 'More', label: 'আরও', component: makeMoreScreen(onSelectTier, onOpenBrandStudio), icon: MoreIcon },
  ];

  return (
    <Tab.Navigator
      key={mode}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 52 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: Spacing.xs,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabel: ({ focused, color, children }) => (
          <T size="xs" color={color} weight={focused ? 'bold' : 'regular'}>{children}</T>
        ),
      }}
    >
      {tabScreens.map((tab) => {
        const Icon = tab.icon;
        return (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              tabBarLabel: tab.label,
              tabBarIcon: ({ focused, size }) => (
                focused ? (
                  <Bounce active>
                    <Icon size={size} />
                  </Bounce>
                ) : (
                  <Icon size={size} />
                )
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  const { user, loading } = useAuth();
  const { colors, mode } = useTheme();
  const [showTierSelect, setShowTierSelect] = useState(false);
  const [showBrandStudio, setShowBrandStudio] = useState(false);
  const navTheme = buildNavTheme(mode, colors);

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.bg }]}>
        <T size="lg" weight="bold" color={colors.primary}>Antarious</T>
        <T size="sm" color={colors.textSecondary}>লোড হচ্ছে...</T>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <FeatureNavProvider>
      <NavigationContainer theme={navTheme} key={mode}>
        <MainTabs
          onSelectTier={() => setShowTierSelect(true)}
          onOpenBrandStudio={() => setShowBrandStudio(true)}
        />
      </NavigationContainer>

      <Modal visible={showTierSelect} animationType="slide">
        <TierSelectScreen onDone={() => setShowTierSelect(false)} />
      </Modal>

      <Modal visible={showBrandStudio} animationType="slide">
        <BrandStudioScreen onBack={() => setShowBrandStudio(false)} />
      </Modal>
    </FeatureNavProvider>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
});
