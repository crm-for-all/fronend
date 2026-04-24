import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../../components/UI/Input';
import Button from '../../../components/UI/Button';
import { type OnboardingData } from '../types';

interface OrgDetailsStepProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const OrgDetailsStep: React.FC<OrgDetailsStepProps> = ({
  data,
  updateData,
  onNext,
  onBack,
}) => {
  const { t } = useTranslation();

  const isInvalid = data.orgName.trim().length < 2;

  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-title">{t('onboarding.org_name')}</h1>
        <p className="step-subtitle">{t('onboarding.welcome_subtitle')}</p>
      </div>

      <div style={{ maxWidth: '500px', margin: 'var(--spacing-xl) auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <Input
          label={t('onboarding.org_name')}
          placeholder={t('onboarding.org_name_placeholder')}
          value={data.orgName}
          onChange={(e) => updateData({ orgName: e.target.value })}
          maxLength={100}
          fullWidth
          autoFocus
        />
      </div>

    </div>
  );
};

export default OrgDetailsStep;
