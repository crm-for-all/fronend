import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Copy, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../components/UI/ToastProvider';
import { organizationsApi } from '../../../api/organizations';
import Button from '../../../components/UI/Button';

const InviteManager: React.FC = () => {
  const { t } = useTranslation();
  const { orgId } = useAuth();
  const { showToast } = useToast();
  
  const [amount, setAmount] = useState<number>(12);
  const [unit, setUnit] = useState<'minutes' | 'hours' | 'days'>('hours');
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateInvite = async () => {
    if (!orgId) return;
    
    setIsGenerating(true);
    setInviteUrl(null);
    
    let hoursInput = amount;
    if (unit === 'minutes') hoursInput = amount / 60;
    if (unit === 'days') hoursInput = amount * 24;
    
    try {
      const response = await organizationsApi.createInvite(orgId, {
        expires_in_hours: hoursInput
      });
      setInviteUrl(response.invite_url);
    } catch (err: any) {
      showToast(err.response?.data?.message || t('error_generating_invite', 'Error generating invite'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in" style={{ padding: '16px 0' }}>
      {/* Header Section */}
      <div className="flex flex-col gap-3">
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary)', margin: 0, letterSpacing: '-0.02em' }}>
          {t('invite.create_title', 'Invite New Member')}
        </h2>
        <p style={{ color: 'var(--color-secondary)', fontSize: '16px', lineHeight: '1.6', maxWidth: '500px', margin: 0, opacity: 0.8 }}>
          {t('invite_to_organization_desc', 'Create a one-time invitation link that expires after the set duration.')}
        </p>
      </div>

      {/* Form Section */}
      <div className="flex flex-col gap-8" style={{ maxWidth: '440px' }}>
        <div className="flex flex-col gap-4">
          <label style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-h)', opacity: 0.9 }}>
            {t('invite.expires_in', 'Link Expiration Time')}
          </label>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-primary)',
                fontSize: '16px',
                flex: 2,
                minWidth: '0',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              className="focus-primary"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-primary)',
                fontSize: '16px',
                cursor: 'pointer',
                flex: 1,
                minWidth: '130px',
                outline: 'none'
              }}
              className="focus-primary"
            >
              <option value="minutes">{t('invite.unit_minutes', 'Minutes')}</option>
              <option value="hours">{t('invite.unit_hours', 'Hours')}</option>
              <option value="days">{t('invite.unit_days', 'Days')}</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleGenerateInvite}
          isLoading={isGenerating}
          disabled={!orgId}
          size="lg"
          style={{ width: 'fit-content', padding: '14px 32px' }}
        >
          {t('invite.generate_btn', 'Generate Invite Link')}
        </Button>
      </div>

      {inviteUrl && (
        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          borderRadius: 'var(--radius-md)', 
          backgroundColor: 'var(--color-surface-hover)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={18} style={{ color: 'var(--color-info)' }} />
            <span style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>
              {t('invite_url_info', 'שלח קישור זה למי שברצונך לצרף לארגון.')}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              value={inviteUrl}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-primary)',
                flex: 1,
                fontFamily: 'monospace',
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleCopy}
              title={t('copy_to_clipboard', 'העתק')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: copied ? 'var(--color-success)' : 'var(--color-border)',
                color: copied ? 'white' : 'var(--color-primary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteManager;
