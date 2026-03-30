import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Card from '../../components/UI/Card';
import SettingsMenu from './Settings/SettingsMenu';
import TagsManager from './Settings/TagsManager';
import StatusesManager from './Settings/StatusesManager';
import ConfirmModal from '../../components/UI/ConfirmModal';

type SettingsView = 'main' | 'tags' | 'statuses';

const SettingsDashboard = () => {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<SettingsView>('main');
  const [isDirty, setIsDirty] = useState(false);
  const [pendingView, setPendingView] = useState<SettingsView | null>(null);

  const isRTL = i18n.language === 'he';
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const handleNavigate = (newView: SettingsView) => {
    if (isDirty) {
      setPendingView(newView);
    } else {
      setView(newView);
    }
  };

  const confirmNavigation = () => {
    if (pendingView) {
      setView(pendingView);
      setPendingView(null);
      setIsDirty(false);
    }
  };

  const cancelNavigation = () => {
    setPendingView(null);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in" style={{ padding: '0 8px' }}>
      
      {/* Breadcrumbs Header */}
      <div className="flex flex-col gap-2 mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '32px', fontWeight: 700, color: 'var(--color-primary)' }}>
          <span 
            onClick={() => handleNavigate('main')}
            style={{ cursor: view !== 'main' ? 'pointer' : 'default', opacity: view !== 'main' ? 0.6 : 1, transition: 'opacity 0.2s' }}
          >
            {t('settings')}
          </span>
          
          {view === 'tags' && (
            <>
              <ChevronIcon size={24} style={{ opacity: 0.5 }} />
              <span>{t('settings_tags', 'ניהול תגיות')}</span>
            </>
          )}

          {view === 'statuses' && (
            <>
              <ChevronIcon size={24} style={{ opacity: 0.5 }} />
              <span>{t('settings_statuses', 'ניהול סטטוסים')}</span>
            </>
          )}
        </div>
        
        <p style={{ color: 'var(--color-secondary)' }}>
          {view === 'main' && t('settings_subtitle', 'נהל את הגדרות ה-CRM והחשבון שלך.')}
          {view === 'tags' && t('settings_tags_desc', 'הוסף, ערוך ומחק תגיות לשימוש בסיווג לקוחות.')}
          {view === 'statuses' && t('settings_statuses_desc', 'צור ונהל סטטוסים דינמיים ובחר להם צבעים מותאמים.')}
        </p>
      </div>

      {/* Main Content Area */}
      {view === 'main' && (
        <SettingsMenu onSelect={handleNavigate} />
      )}

      {view === 'tags' && (
        <Card>
          <TagsManager setIsDirty={setIsDirty} />
        </Card>
      )}

      {view === 'statuses' && (
        <Card>
          <StatusesManager setIsDirty={setIsDirty} />
        </Card>
      )}

      {/* Navigation Confirm Modal for Unsaved Changes */}
      <ConfirmModal
        isOpen={pendingView !== null}
        onClose={cancelNavigation}
        onConfirm={confirmNavigation}
        title={t('unsaved_changes', 'שינויים שלא נשמרו')}
        message={t('confirm_discard_msg', 'יש לך שינויים שלא נשמרו. האם אתה בטוח שברצונך לעזוב מסך זה?')}
        variant="danger"
        confirmLabel={t('leave', 'עזוב')}
      />
    </div>
  );
};

export default SettingsDashboard;
