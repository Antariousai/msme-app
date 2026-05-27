import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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
import { getPrimaryTabIds, getFeatureById, FeatureId } from './features';
import { T } from '../components/atoms';
import { Colors, Spacing } from '../theme';
import { HomeIcon, MoreIcon } from '../icons';

const Tab = createBottomTabNavigator();

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

function MainTabs({ onSelectTier, onOpenBrandStudio }: { onSelectTier: () => void; onOpenBrandStudio: () => void }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const tier = user?.tier ?? 0;
  const primaryIds = getPrimaryTabIds(tier);
  const HomeComponent = getHomeComponent(tier);

  const tabScreens: { name: string; label: string; component: React.ComponentType; icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
    { name: 'Home', label: 'হোম', component: HomeComponent, icon: HomeIcon },
    ...primaryIds.map((id) => {
      const feat = getFeatureById(id)!;
      return { name: feat.id, label: feat.label, component: feat.component, icon: feat.icon };
    }),
    { name: 'More', label: 'আরও', component: makeMoreScreen(onSelectTier, onOpenBrandStudio), icon: MoreIcon },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: Spacing.xs,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabel: ({ focused, color, children }) => (
          <T size="xs" color={color} weight={focused ? 'semibold' : 'regular'}>{children}</T>
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
              tabBarIcon: ({ color, size }) => <Icon size={size} color={color} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  const { user, loading } = useAuth();
  const [showTierSelect, setShowTierSelect] = useState(false);
  const [showBrandStudio, setShowBrandStudio] = useState(false);

  if (loading) {
    return (
      <View style={styles.loading}>
        <T size="lg" weight="bold" color={Colors.primary}>Antarious</T>
        <T size="sm" color={Colors.textSecondary}>লোড হচ্ছে...</T>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <FeatureNavProvider>
      <NavigationContainer>
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
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
});
