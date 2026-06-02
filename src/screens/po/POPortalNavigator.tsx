import React, { useState } from 'react';
import { PODashboardScreen } from './PODashboardScreen';
import { BeneficiaryDetailScreen } from './BeneficiaryDetailScreen';

export type POPortalStackParamList = {
  PODashboard: undefined;
  BeneficiaryDetail: { beneficiaryId: string };
};

/** PO portal shell — dashboard ↔ beneficiary detail */
export const POPortalNavigator = () => {
  const [beneficiaryId, setBeneficiaryId] = useState<string | null>(null);

  if (beneficiaryId) {
    return (
      <BeneficiaryDetailScreen
        beneficiaryId={beneficiaryId}
        onBack={() => setBeneficiaryId(null)}
      />
    );
  }

  return <PODashboardScreen onOpenBeneficiary={setBeneficiaryId} />;
};
