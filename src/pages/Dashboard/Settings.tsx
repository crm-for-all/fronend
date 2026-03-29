import { useTranslation } from 'react-i18next';
import Card from '../../components/UI/Card';

const SettingsDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 animate-fade-in" style={{ padding: '0 8px' }}>
      <div className="flex flex-col gap-2 mb-4">
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-primary)' }}>
          {t('settings')}
        </h1>
        <p style={{ color: 'var(--color-secondary)' }}>Manage your CRM preferences and account details.</p>
      </div>

      <Card>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '16px' }}>
          Profile Settings
        </h2>
        <p style={{ color: 'var(--color-secondary)' }}>Settings coming soon...</p>
      </Card>
    </div>
  );
};

export default SettingsDashboard;
