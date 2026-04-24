import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Button from '../../../components/UI/Button';
import { type OnboardingData } from '../types';
import { useAuth } from '../../../context/AuthContext';
import { authApi } from '../../../api/auth';
import { organizationsApi } from '../../../api/organizations';

interface SuccessStepProps {
  data: OnboardingData;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [setupResponse, setSetupResponse] = useState<any>(null);

  const createOrganization = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // 1. Create Organization with single atomic call
      const response = await organizationsApi.create({
        name: data.orgName,
        plan: data.plan,
        statuses: data.statuses,
        tags: data.tags.map(tagName => ({ name: tagName }))
      });
      
      setSetupResponse(response);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || t('onboarding.error_creating_org'));
    } finally {
      setIsLoading(false);
    }
  }, [data, t]);

  useEffect(() => {
    createOrganization();
  }, [createOrganization]);

  const handleEnterDashboard = async () => {
    if (!setupResponse) return;

    try {
      // Set the org context
      localStorage.setItem('crm_org_id', setupResponse.organization_id);

      // Reload auth to get the updated token/orgs list from /me
      const meData = await authApi.me();
      login(localStorage.getItem('crm_token') || '', meData.organizations);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to finalize session:', err);
      window.location.href = '/dashboard'; // Fallback
    }
  };

  if (isLoading) {
    return (
      <div className="step-container" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          gap: '24px',
          animation: 'fadeIn 0.5s ease'
        }}>
          <Loader2 size={48} className="animate-spin" style={{ color: 'var(--color-tertiary)' }} />
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{t('onboarding.creating_org')}</h2>
            <p style={{ color: 'var(--color-secondary)', marginTop: '8px' }}>{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="step-container" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          gap: '24px',
          animation: 'fadeIn 0.5s ease'
        }}>
          <div style={{ color: 'var(--color-red)' }}>
            <AlertCircle size={64} />
          </div>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{t('error')}</h2>
            <p style={{ color: 'var(--color-secondary)', marginTop: '8px' }}>{error}</p>
          </div>
          <Button onClick={createOrganization} variant="primary" style={{ marginTop: '12px' }}>
            {t('onboarding.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container" style={{ alignItems: 'center' }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#3b82f6',
          marginBottom: 'var(--spacing-lg)',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
          animation: 'popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </div>

      <div className="step-header">
        <h1 className="step-title" style={{ color: '#3b82f6' }}>{t('onboarding.finish')}</h1>
        <p className="step-subtitle" style={{ maxWidth: '450px' }}>
          {t('onboarding.finish_desc')}
        </p>
      </div>

      <div style={{ marginTop: 'var(--spacing-2xl)', animation: 'slideIn 0.5s ease 0.2s both' }}>
        <Button size="lg" onClick={handleEnterDashboard} style={{ padding: '0 var(--spacing-2xl)', height: '56px', fontSize: '1.1rem' }}>
          {t('onboarding.enter_crm')}
        </Button>
      </div>
    </div>
  );
};

export default SuccessStep;
