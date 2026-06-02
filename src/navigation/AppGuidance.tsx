import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { needsCustomerOnboarding, needsAppTutorial } from '../auth/onboarding';
import { CustomerOnboardingScreen } from '../screens/onboarding/CustomerOnboardingScreen';
import { AppTutorialCoach } from '../screens/tutorial/AppTutorialCoach';

/**
 * Two-phase guidance:
 * 1. Customer onboarding — full-screen setup (tier, loan, credit)
 * 2. App tutorial — bottom coach over real screens
 */
export const AppGuidance = () => {
  const { user } = useAuth();
  const needsCustomer = !!user && needsCustomerOnboarding(user);
  const needsTutorial = !!user && needsAppTutorial(user);

  const [showCustomer, setShowCustomer] = useState(needsCustomer);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (needsCustomer) {
      setShowCustomer(true);
      setShowTutorial(false);
    }
  }, [needsCustomer, user?.tier]);

  useEffect(() => {
    if (!needsCustomer && needsTutorial) {
      setShowTutorial(true);
    }
  }, [needsCustomer, needsTutorial, user?.tier]);

  const handleCustomerDone = () => {
    setShowCustomer(false);
    setShowTutorial(true);
  };

  return (
    <>
      <Modal visible={showCustomer && needsCustomer} animationType="slide" presentationStyle="fullScreen">
        <CustomerOnboardingScreen onComplete={handleCustomerDone} />
      </Modal>

      <AppTutorialCoach
        visible={showTutorial && needsTutorial}
        onComplete={() => setShowTutorial(false)}
      />
    </>
  );
};
