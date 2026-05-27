import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import { FeatureId, getFeatureById, getHubFeatures, getPrimaryTabIds } from './features';
import { Colors, Spacing, Radius } from '../theme';
import { XIcon } from '../icons';

interface FeatureNavContextType {
  openFeature: (id: FeatureId) => void;
  closeFeature: () => void;
  hubFeatureIds: FeatureId[];
  tabFeatureIds: FeatureId[];
}

const FeatureNavContext = createContext<FeatureNavContextType>({
  openFeature: () => {},
  closeFeature: () => {},
  hubFeatureIds: [],
  tabFeatureIds: [],
});

export const useFeatureNav = () => useContext(FeatureNavContext);

export const FeatureNavProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const tier = user?.tier ?? 0;
  const [activeFeature, setActiveFeature] = useState<FeatureId | null>(null);

  const hubFeatures = getHubFeatures(tier);
  const tabFeatureIds = getPrimaryTabIds(tier);

  const openFeature = (id: FeatureId) => setActiveFeature(id);
  const closeFeature = () => setActiveFeature(null);

  const active = activeFeature ? getFeatureById(activeFeature) : null;
  const ActiveComponent = active?.component;

  return (
    <FeatureNavContext.Provider
      value={{
        openFeature,
        closeFeature,
        hubFeatureIds: hubFeatures.map((f) => f.id),
        tabFeatureIds,
      }}
    >
      {children}

      <Modal visible={!!activeFeature} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
          <Pressable onPress={closeFeature} style={styles.closeFab}>
            <XIcon size={18} color={Colors.textPrimary} />
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
  modalSafe: { flex: 1, backgroundColor: Colors.bg },
  closeFab: {
    position: 'absolute',
    top: Spacing.sm + 44,
    right: Spacing.base,
    zIndex: 100,
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  modalBody: { flex: 1 },
});
