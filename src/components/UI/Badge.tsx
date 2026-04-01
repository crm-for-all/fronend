import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { CustomerStatus, Status, StatusColor, Tag } from '../../types';
import './Badge.scss';

interface BadgeProps {
  status?: CustomerStatus | Status | string | null;
  tag?: Tag | null;
  tone?: StatusColor;
  type?: 'status' | 'tag';
  label?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  status, 
  tag, 
  tone: manualTone, 
  type: manualType, 
  label: manualLabel, 
  className 
}) => {
  const { t } = useTranslation();
  
  // 1. Determine Type
  const type = manualType || (tag ? 'tag' : 'status');

  // 2. Determine Label
  let label = manualLabel;
  if (!label) {
    if (tag) label = tag.name;
    else if (typeof status === 'string') {
      const isDefault = ['lead', 'contacted', 'qualified', 'customer', 'inactive'].includes(status);
      label = isDefault ? t(`status.${status}`) : status;
    } else if (status && typeof status === 'object') {
      label = status.name;
    }
  }

  if (!label) return null;

  // 3. Determine Tone/Color
  let tone = manualTone;
  if (!tone) {
    if (tag) tone = 'gray';
    else if (status && typeof status === 'object' && 'color' in status) tone = status.color;
  }

  // 4. Handle Legacy Status Strings
  const isLegacyStatus = typeof status === 'string' && ['lead', 'contacted', 'qualified', 'customer', 'inactive'].includes(status);

  return (
    <span 
      className={clsx(
        'badge', 
        `badge--${type}`, 
        tone ? `badge--tone-${tone}` : (isLegacyStatus ? `badge--${status}` : ''),
        className
      )}
    >
      {label}
    </span>
  );
};

export default Badge;
