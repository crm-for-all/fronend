import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, ShieldCheck } from 'lucide-react';
import OptionCard from '../../../components/UI/OptionCard';
import Button from '../../../components/UI/Button';
import { type OnboardingData } from '../types';

interface PlanSelectionStepProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
}

const PlanSelectionStep: React.FC<PlanSelectionStepProps> = ({
  data,
  updateData,
}) => {
  const { t } = useTranslation();

  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-title">{t('onboarding.select_plan')}</h1>
        <p className="step-subtitle">{t('onboarding.select_plan_subtitle')}</p>
      </div>

      <div className="options-grid">
        <OptionCard
          title={t('free_plan')}
          description={t('onboarding.free_plan_desc')}
          icon={<Zap />}
          selected={data.plan === 'free'}
          onClick={() => updateData({ plan: 'free' })}
          footer={<Button variant={data.plan === 'free' ? 'primary' : 'outline'} fullWidth>{t('onboarding.select_free', 'Select Free')}</Button>}
        />
        <OptionCard
          title={t('onboarding.business_plan')}
          description={t('onboarding.business_plan_desc')}
          icon={<ShieldCheck />}
          selected={data.plan === 'business'}
          footer={<Button variant="secondary" disabled fullWidth>{t('onboarding.select_business', 'Coming Soon')}</Button>}
          comingSoon
        />
      </div>

    </div>
  );
};

export default PlanSelectionStep;
