import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tags, Activity, UserCircle } from 'lucide-react';
import Card from '../../../components/UI/Card';

interface SettingsMenuProps {
  onSelect: (view: 'main' | 'tags' | 'statuses') => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className="settings-menu" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
      
      <Card 
        onClick={() => onSelect('tags')} 
        style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid transparent' }}
        className="settings-card hover-lift"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)', display: 'flex' }}>
            <Tags size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>
            {t('settings_tags', 'ניהול תגיות')}
          </h3>
        </div>
        <p style={{ color: 'var(--color-secondary)', margin: 0 }}>
          {t('settings_tags_desc', 'הוסף, ערוך ומחק תגיות לשימוש בסיווג לקוחות.')}
        </p>
      </Card>

      <Card 
        onClick={() => onSelect('statuses')} 
        style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid transparent' }}
        className="settings-card hover-lift"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)', display: 'flex' }}>
            <Activity size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>
            {t('settings_statuses', 'ניהול סטטוסים')}
          </h3>
        </div>
        <p style={{ color: 'var(--color-secondary)', margin: 0 }}>
          {t('settings_statuses_desc', 'צור ונהל סטטוסים דינמיים ובחר להם צבעים מותאמים.')}
        </p>
      </Card>

      <Card 
        style={{ opacity: 0.6 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-border)', color: 'var(--color-secondary)', display: 'flex' }}>
            <UserCircle size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>
            {t('profile_settings', 'הגדרות פרופיל')}
          </h3>
        </div>
        <p style={{ color: 'var(--color-secondary)', margin: 0 }}>
          {t('coming_soon', 'ההגדרות יגיעו בקרוב...')}
        </p>
      </Card>

      <style>{`
        .settings-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-primary) !important;
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
};

export default SettingsMenu;
