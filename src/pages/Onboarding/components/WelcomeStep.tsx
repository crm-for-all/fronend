import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Users } from 'lucide-react';
import OptionCard from '../../../components/UI/OptionCard';
import Button from '../../../components/UI/Button';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const { t } = useTranslation();

  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-title">{t('onboarding.welcome')}</h1>
        <p className="step-subtitle">{t('onboarding.welcome_subtitle')}</p>
      </div>

      <div className="options-grid">
        <OptionCard
          title={t('onboarding.create_org')}
          description={t('onboarding.create_org_desc')}
          icon={<Building2 />}
          onClick={onNext}
          footer={<Button size="lg" variant="primary">{t('onboarding.create_org_btn', 'Create Organization')}</Button>}
        />
        <OptionCard
          title={t('onboarding.join_org')}
          description={t('onboarding.join_org_desc')}
          icon={<Users />}
          footer={<Button size="lg" variant="secondary" disabled>{t('onboarding.join_org_btn', 'Join Organization')}</Button>}
          comingSoon
        />
      </div>
    </div>
  );
};

export default WelcomeStep;
