import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import Input from '../../../components/UI/Input';
import Button from '../../../components/UI/Button';
import { type OnboardingData } from '../types';

interface TagsSetupStepProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SUGGESTED_TAG_KEYS = ['tag_vip', 'tag_urgent', 'tag_wholesale', 'tag_interested', 'tag_partner'];

const TagsSetupStep: React.FC<TagsSetupStepProps> = ({
  data,
  updateData,
  onNext,
  onBack,
}) => {
  const { t } = useTranslation();
  const [newTagName, setNewTagName] = useState('');

  const addTag = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || data.tags.includes(trimmed)) return;
    updateData({
      tags: [...data.tags, trimmed],
    });
    setNewTagName('');
  };

  const removeTag = (name: string) => {
    updateData({
      tags: data.tags.filter((t) => t !== name),
    });
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-title">{t('onboarding.setup_tags')}</h1>
        <p className="step-subtitle">{t('onboarding.setup_tags_subtitle')}</p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Input
            placeholder={t('onboarding.tag_name_placeholder')}
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag(newTagName)}
            maxLength={50}
            fullWidth
          />
          <Button 
            onClick={() => addTag(newTagName)} 
            variant="secondary" 
            style={{ height: '40px', padding: '0 24px' }}
            disabled={!newTagName.trim()}
          >
            <Plus size={18} style={{ marginInlineEnd: '8px' }} />
            {t('onboarding.add_tag')}
          </Button>
        </div>

        <div style={{ textAlign: 'start' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {t('onboarding.suggested_tags')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {SUGGESTED_TAG_KEYS
              .filter(key => !data.tags.includes(t(`onboarding.${key}`)))
              .map((key) => {
                const tagName = t(`onboarding.${key}`);
                return (
                  <button
                    key={key}
                    onClick={() => addTag(tagName)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-xl)',
                    border: '2px solid var(--color-border)',
                    background: 'transparent',
                    color: 'var(--color-secondary)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-tertiary)';
                    e.currentTarget.style.color = 'var(--color-tertiary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.color = 'var(--color-secondary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {tagName}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '0' }}>
          {data.tags.map((tag) => (
            <div 
              key={tag}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                boxShadow: 'var(--shadow-sm)',
                animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <span>{tag}</span>
              <button 
                onClick={() => removeTag(tag)}
                style={{ color: 'var(--color-muted)', display: 'flex', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-red)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
                aria-label={`Remove tag ${tag}`}
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

export default TagsSetupStep;
