import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import Input from '../../../components/UI/Input';
import Button from '../../../components/UI/Button';
import ColorPicker from '../../../components/UI/ColorPicker';
import { type OnboardingData } from '../types';
import { type StatusColor } from '../../../types';

interface StatusesSetupStepProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
}

const DEFAULT_STATUSES: { key: string; color: StatusColor }[] = [
  { key: 'status_active', color: 'green' },
  { key: 'status_not_active', color: 'red' },
  { key: 'status_irrelevant', color: 'red' },
  { key: 'status_done', color: 'purple' },
];

const StatusesSetupStep: React.FC<StatusesSetupStepProps> = ({
  data,
  updateData,
}) => {
  const { t } = useTranslation();
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState<StatusColor>('gray');

  // Initialize defaults if empty
  useEffect(() => {
    if (data.statuses.length === 0) {
      updateData({
        statuses: DEFAULT_STATUSES.map((ds) => ({
          name: t(`onboarding.${ds.key}`),
          color: ds.color,
        })),
      });
    }
  }, []);

  const addStatus = () => {
    if (!newStatusName.trim()) return;
    updateData({
      statuses: [...data.statuses, { name: newStatusName.trim(), color: newStatusColor }],
    });
    setNewStatusName('');
    setNewStatusColor('gray');
  };

  const removeStatus = (index: number) => {
    updateData({
      statuses: data.statuses.filter((_, i) => i !== index),
    });
  };

  const updateStatusName = (index: number, name: string) => {
    const newStatuses = [...data.statuses];
    newStatuses[index].name = name;
    updateData({ statuses: newStatuses });
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-title">{t('onboarding.setup_statuses')}</h1>
        <p className="step-subtitle">{t('onboarding.setup_statuses_subtitle')}</p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
        
        {/* Creation Bar - Consistent with other steps but enhanced */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Input
              placeholder={t('onboarding.status_name_placeholder')}
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addStatus()}
              fullWidth
              style={{ paddingInlineEnd: '52px' }} // Space for color picker
            />
            <div style={{ 
              position: 'absolute', 
              insetInlineEnd: '6px', 
              top: '20px', // Center of 40px input (since no label)
              transform: 'translateY(-50%)',
              zIndex: 10
            }}>
              <ColorPicker value={newStatusColor} onChange={(c) => setNewStatusColor(c)} />
            </div>
          </div>
          <Button 
            onClick={addStatus} 
            variant="secondary" 
            disabled={!newStatusName.trim()}
            style={{ height: '40px', padding: '0 24px' }}
          >
            <Plus size={18} style={{ marginInlineEnd: '8px' }} />
            {t('onboarding.add_status')}
          </Button>
        </div>

        {/* Professional Status List */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: 'var(--spacing-md)',
          textAlign: 'start'
        }}>
          {data.statuses.map((status, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                padding: '10px 14px',
                background: 'var(--color-surface)', // Solid background for better contrast
                border: '1.5px solid var(--color-muted)', // Darker border for visibility
                borderRadius: 'var(--radius-lg)',
                position: 'relative',
                zIndex: 100 + data.statuses.length - index,
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)', // Add subtle depth
              }}
              className="status-row-item"
            >
              <ColorPicker 
                value={status.color} 
                onChange={(newColor) => {
                  const newStatuses = [...data.statuses];
                  newStatuses[index].color = newColor;
                  updateData({ statuses: newStatuses });
                }}
              />
              <input
                type="text"
                value={status.name}
                onChange={(e) => updateStatusName(index, e.target.value)}
                maxLength={50}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                }}
              />
              <button 
                onClick={() => removeStatus(index)}
                style={{ 
                  color: 'var(--color-muted)', 
                  padding: '6px',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  opacity: 0.6
                }}
                className="hover-red-bg"
                aria-label="Remove status"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusesSetupStep;

