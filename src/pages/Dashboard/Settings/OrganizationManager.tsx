import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';

interface OrganizationManagerProps {
  onNavigate: (view: 'invite') => void;
}

const OrganizationManager: React.FC<OrganizationManagerProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10 animate-fade-in" style={{ padding: '16px 0' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary)', margin: 0, letterSpacing: '-0.02em' }}>
          {t('settings_organization', 'Organization Settings')}
        </h2>
        <p style={{ color: 'var(--color-secondary)', fontSize: '16px', lineHeight: '1.6', maxWidth: '600px', margin: 0, opacity: 0.8 }}>
          {t('settings_organization_desc', 'Manage invites and settings for your current organization.')}
        </p>
      </div>

      {/* Action Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
        
        {/* Invite Members Action Card */}
        <div 
          onClick={() => onNavigate('invite')}
          className="hover-card"
          style={{ 
            padding: '32px', 
            borderRadius: '20px', 
            backgroundColor: 'var(--color-surface)', 
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '100%',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Icon Wrapper */}
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '14px', 
            backgroundColor: 'var(--color-primary)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 8px 16px -4px rgba(var(--color-primary-rgb, 0,0,0), 0.3)'
          }}>
            <UserPlus size={28} />
          </div>

          {/* Text Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-h)', margin: 0 }}>
              {t('invite_members', 'Invite Members')}
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
              {t('invite_members_desc', 'Create new invite links to join people into your organization.')}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrganizationManager;
