import React from 'react';
import { AppHeader } from '../../components/AppHeader';
import { ScreenScroll } from '../../components/atoms';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { ScreenFrame } from '../../components/ScreenFrame';
import { HeroCard } from '../../components/HeroCard';

export { AccountingScreen as BookkeepingScreen } from '../accounting/AccountingScreen';

export const Tier0Home = () => (
  <ScreenFrame>
    <AppHeader showGreeting />
    <ScreenScroll>
      <HeroCard
        title="📒 অফলাইন মোড"
        metric="সক্রিয়"
        metricLabel="ইন্টারনেট ছাড়াই হিসাব"
        stats={[
          { label: 'আজকের লেনদেন', value: '৫ ✅' },
        ]}
      />
      <FeatureToolsSection layout="grid" scope="all" />
    </ScreenScroll>
  </ScreenFrame>
);
