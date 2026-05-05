import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { organizationInvitesApi } from '../../api/organization_invites';
import { Building2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../components/UI/ToastProvider';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

import ThemeLanguageSwitcher from '../../components/UI/ThemeLanguageSwitcher';

const AcceptInvite: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isInitializing } = useAuth();
  const { showToast } = useToast();

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const [isAccepting, setIsAccepting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isRTL = i18n.language === 'he';

  useEffect(() => {
    if (!uid || !token) {
      showToast(t('invalid_invite_link', 'Invalid invite link. Missing parameters.'), 'error');
    }
  }, [uid, token, t, showToast]);

  const handleLoginRequired = () => {
    sessionStorage.setItem('redirect_after_auth', `/invite?uid=${uid}&token=${token}`);
    navigate('/login');
  };

  const handleRegisterRequired = () => {
    sessionStorage.setItem('redirect_after_auth', `/invite?uid=${uid}&token=${token}`);
    navigate('/register');
  };

  const handleAcceptInvite = async () => {
    if (!uid || !token) return;

    setIsAccepting(true);

    try {
      await organizationInvitesApi.accept({ uid, token });
      setSuccess(true);
      setTimeout(() => {
        sessionStorage.removeItem('redirect_after_auth');
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err: any) {
      showToast(err.response?.data?.message || t('error_accepting_invite', 'Error accepting invite'), 'error');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div
      className="accept-invite-wrapper"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      {/* Theme & Language Switcher (Matches Auth Pages) */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          insetInlineEnd: '40px',
          zIndex: 1100
        }}
      >
        <ThemeLanguageSwitcher />
      </div>

      <Card
        className="animate-fade-in"
        style={{
          maxWidth: '540px',
          width: '100%',
          padding: '64px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '32px',
          position: 'relative'
        }}
      >
        {/* Centered Static Icon */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface-hover)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--color-border)',
            flexShrink: 0
          }}
        >
          <Building2 size={48} />
        </div>

        {/* Content Section */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          width: '100%',
          textAlign: isRTL ? 'right' : 'left',
          alignItems: isRTL ? 'flex-end' : 'flex-start'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 800, 
            color: 'var(--color-text-h)', 
            margin: 0, 
            lineHeight: 1.2,
            width: '100%'
          }}>
            {t('invite.join_verification', 'Join Organization')}
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: 'var(--color-text)', 
            margin: 0, 
            lineHeight: 1.6, 
            opacity: 0.8, 
            width: '100%',
            direction: isRTL ? 'rtl' : 'ltr'
          }}>
            {t('join_organization_desc', 'You have been invited to join an organization. Accept the invitation to get access to their data.')}
          </p>
        </div>

        {/* Actions Section */}
        <div style={{ 
          width: '100%', 
          marginTop: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: isRTL ? 'flex-end' : 'flex-start'
        }}>
          {success ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '16px', 
              padding: '24px', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: 'var(--color-success-bg, rgba(16, 185, 129, 0.1))', 
              color: 'var(--color-success, #10b981)',
              border: '1px solid var(--color-success)',
              width: '100%'
            }}>
              <CheckCircle2 size={40} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '20px' }}>{t('invite_accepted_success', 'Joined Successfully!')}</span>
                <span style={{ fontSize: '14px', opacity: 0.8 }}>{t('invite.go_to_dashboard', 'Redirecting to dashboard...')}</span>
              </div>
            </div>
          ) : !isAuthenticated ? (
            <>
              <div style={{ 
                padding: '16px', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: 'var(--color-surface-hover)', 
                color: 'var(--color-primary)', 
                border: '1px solid var(--color-border)',
                fontSize: '15px',
                fontWeight: 500,
                width: '100%',
                textAlign: isRTL ? 'right' : 'left',
                direction: isRTL ? 'rtl' : 'ltr'
              }}>
                {t('invite.login_required', 'You must login first to accept the invitation')}
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                width: '100%',
                flexWrap: 'wrap',
                direction: isRTL ? 'rtl' : 'ltr'
              }}>
                <Button 
                  onClick={handleRegisterRequired} 
                  variant="outline" 
                  size="lg" 
                  style={{ flex: 1, minWidth: '160px' }}
                >
                  {t('register_to_accept', 'Register')}
                </Button>
                <Button 
                  onClick={handleLoginRequired} 
                  variant="primary" 
                  size="lg" 
                  style={{ flex: 1, minWidth: '160px' }}
                >
                  {t('login_to_accept', 'Log in')}
                </Button>
              </div>
            </>
          ) : (
            <Button 
              onClick={handleAcceptInvite} 
              isLoading={isAccepting} 
              variant="primary" 
              size="lg" 
              fullWidth
              style={{ padding: '20px' }}
            >
              {t('invite.join_btn', 'Join Organization')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AcceptInvite;
