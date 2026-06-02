import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  RefObject,
} from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import {
  FeatureId,
  getFeatureById,
  getHubFeatures,
  getPrimaryTabIds,
  isInPrimaryTabs,
} from './features';
import { Spacing, Radius } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { XIcon } from '../icons';

export type BookkeepingIntent = 'income' | 'expense';

export type OpenFeatureOptions = {
  bookkeepingAction?: BookkeepingIntent;
  /** After onboarding, jump to Home tab before opening feature */
  fromOnboarding?: boolean;
};

export type RootTabParamList = {
  Home: undefined;
  Account: undefined;
} & Partial<Record<FeatureId, undefined>>;

interface FeatureNavContextType {
  openFeature: (id: FeatureId, options?: OpenFeatureOptions) => void;
  closeFeature: () => void;
  navigateHome: () => void;
  navigateAccount: () => void;
  consumeBookkeepingIntent: () => BookkeepingIntent | null;
  hubFeatureIds: FeatureId[];
  tabFeatureIds: FeatureId[];
}

const FeatureNavContext = createContext<FeatureNavContextType>({
  openFeature: () => {},
  closeFeature: () => {},
  consumeBookkeepingIntent: () => null,
  navigateHome: () => {},
  navigateAccount: () => {},
  hubFeatureIds: [],
  tabFeatureIds: [],
});

export const useFeatureNav = () => useContext(FeatureNavContext);

interface FeatureNavProviderProps {
  children: ReactNode;
  navigationRef: RefObject<NavigationContainerRef<RootTabParamList> | null>;
}

export const FeatureNavProvider = ({ children, navigationRef }: FeatureNavProviderProps) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const tier = user?.tier ?? 0;
  const [activeFeature, setActiveFeature] = useState<FeatureId | null>(null);
  const [bookkeepingIntent, setBookkeepingIntent] = useState<BookkeepingIntent | null>(null);

  const hubFeatures = getHubFeatures(tier);
  const tabFeatureIds = getPrimaryTabIds(tier);

  const navigateToTab = (id: FeatureId) => {
    const nav = navigationRef.current;
    if (!nav?.isReady()) return false;
    nav.navigate(id);
    return true;
  };

  const navigateHome = useCallback(() => {
    const nav = navigationRef.current;
    if (nav?.isReady()) nav.navigate('Home');
  }, [navigationRef]);

  const navigateAccount = useCallback(() => {
    const nav = navigationRef.current;
    if (nav?.isReady()) nav.navigate('Account');
  }, [navigationRef]);

  const openFeature = (id: FeatureId, options?: OpenFeatureOptions) => {
    if (options?.bookkeepingAction) {
      setBookkeepingIntent(options.bookkeepingAction);
    }
    if (options?.fromOnboarding) {
      navigateHome();
    }
    if (isInPrimaryTabs(tier, id)) {
      setActiveFeature(null);
      navigateToTab(id);
      return;
    }
    setActiveFeature(id);
  };

  const closeFeature = () => setActiveFeature(null);

  const consumeBookkeepingIntent = useCallback(() => {
    const action = bookkeepingIntent;
    setBookkeepingIntent(null);
    return action;
  }, [bookkeepingIntent]);

  useEffect(() => {
    setActiveFeature(null);
  }, [tier]);

  const active = activeFeature ? getFeatureById(activeFeature) : null;
  const ActiveComponent = active?.component;

  return (
    <FeatureNavContext.Provider
      value={{
        openFeature,
        closeFeature,
        consumeBookkeepingIntent,
        navigateHome,
        navigateAccount,
        hubFeatureIds: hubFeatures.map((f) => f.id),
        tabFeatureIds,
      }}
    >
      {children}

      <Modal visible={!!activeFeature} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={[styles.modalSafe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
          <Pressable
            onPress={closeFeature}
            style={[
              styles.closeFab,
              {
                backgroundColor: colors.chip,
                borderColor: colors.borderLight,
                shadowColor: colors.primary,
              },
            ]}
          >
            <XIcon size={18} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.modalBody}>
            {ActiveComponent ? <ActiveComponent /> : null}
          </View>
        </SafeAreaView>
      </Modal>
    </FeatureNavContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalSafe: { flex: 1 },
  closeFab: {
    position: 'absolute',
    top: Spacing.sm + 44,
    right: Spacing.base,
    zIndex: 100,
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  modalBody: { flex: 1 },
});
