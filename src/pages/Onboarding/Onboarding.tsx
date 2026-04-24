import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import WelcomeStep from './components/WelcomeStep';
import OrgDetailsStep from './components/OrgDetailsStep';
import PlanSelectionStep from './components/PlanSelectionStep';
import StatusesSetupStep from './components/StatusesSetupStep';
import TagsSetupStep from './components/TagsSetupStep';
import SuccessStep from './components/SuccessStep';
import Button from '../../components/UI/Button';
import ThemeLanguageSwitcher from '../../components/UI/ThemeLanguageSwitcher';
import { type OnboardingData } from './types';
import './Onboarding.scss';

const Onboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    orgName: '',
    plan: 'free',
    statuses: [],
    tags: [],
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((d) => ({ ...d, ...newData }));
  };

  const isNextDisabled = () => {
    if (step === 2) return data.orgName.trim().length < 2;
    if (step === 4) return data.statuses.length === 0;
    return false;
  };

  const showFooter = step > 1 && step < 6;
  const showSkip = step === 5;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <WelcomeStep onNext={nextStep} />;
      case 2:
        return (
          <OrgDetailsStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <PlanSelectionStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <StatusesSetupStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <TagsSetupStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return <SuccessStep data={data} />;
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  const stepTitles = [
    t('onboarding.step_setup', 'Setup'),
    t('onboarding.step_details', 'Details'),
    t('onboarding.step_plan', 'Plan'),
    t('onboarding.step_statuses', 'Statuses'),
    t('onboarding.step_tags', 'Tags'),
  ];

  return (
    <div className="onboarding-page">
      <header className="onboarding-page__header">
        <div className="onboarding-page__header-content">
          <div className="onboarding-page__logo">
            Curator <span>CRM</span>
          </div>
          <div className="onboarding-page__actions">
            <ThemeLanguageSwitcher />
            <div className="onboarding-page__avatar">
              <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="User Avatar" />
            </div>
          </div>
        </div>
      </header>

      <main className="onboarding-page__main">
        <div className="onboarding-page__container">
          <div className="onboarding-page__stepper-wrapper">
            <div className="onboarding-page__stepper">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`onboarding-page__step-indicator ${step === s ? 'active' : step > s ? 'completed' : ''
                    }`}
                />
              ))}
            </div>
            <div className="onboarding-page__step-info">
              {t('onboarding.step_of', { current: step, total: 5 })}: <span>{stepTitles[step - 1]}</span>
            </div>
          </div>
          <div className="onboarding-page__content">{renderStep()}</div>
          
          {showFooter && (
            <div className="onboarding-page__footer">
              <Button variant="ghost" onClick={prevStep}>
                {t('onboarding.back')}
              </Button>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                {showSkip && (
                  <Button variant="ghost" onClick={nextStep}>
                    {t('onboarding.skip')}
                  </Button>
                )}
                <Button onClick={nextStep} disabled={isNextDisabled()}>
                  {t('onboarding.next')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
