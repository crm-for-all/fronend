import React from 'react';
import clsx from 'clsx';
import Card from './Card';
import Badge from './Badge';
import { useTranslation } from 'react-i18next';
import './OptionCard.scss';

interface OptionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  onClick?: () => void;
  className?: string;
  footer?: React.ReactNode;
}

const OptionCard: React.FC<OptionCardProps> = ({
  title,
  description,
  icon,
  selected,
  disabled,
  comingSoon,
  onClick,
  className,
  footer,
}) => {
  const { t } = useTranslation();

  return (
    <Card
      className={clsx(
        'option-card',
        {
          'option-card--selected': selected,
          'option-card--disabled': disabled || comingSoon,
        },
        className
      )}
      onClick={(!disabled && !comingSoon) ? onClick : undefined}
    >
      {comingSoon && (
        <Badge 
          label={t('coming_soon', 'Coming Soon')} 
          tone="gray" 
          className="option-card__badge" 
        />
      )}
      
      <div className="option-card__icon">{icon}</div>
      
      <div className="option-card__content">
        <h3 className="option-card__title">{title}</h3>
        <p className="option-card__description">{description}</p>
        
        {selected && (
          <div className="option-card__selected-indicator">
            <div className="option-card__check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
        )}
      </div>

      {footer && <div className="option-card__footer">{footer}</div>}
    </Card>
  );
};

export default OptionCard;
