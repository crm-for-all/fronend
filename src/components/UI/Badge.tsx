import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { CustomerStatus, Status } from '../../types';
import './Badge.scss';

interface BadgeProps {
  status: CustomerStatus | Status | string | null;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, className }) => {
  const { t } = useTranslation();
  
  if (!status) return null;

  // Handle object status from API
  if (typeof status === 'object' && 'name' in status) {
    return (
      <span 
        className={clsx('badge', 'badge--dynamic', className)}
        style={{ 
          backgroundColor: `${status.color}20`, // 20 is hex for ~12% opacity
          color: status.color,
          borderColor: `${status.color}40`
        } as React.CSSProperties}
      >
        {status.name}
      </span>
    );
  }

  // Handle string status (legacy/default)
  const isDefaultStatus = ['lead', 'contacted', 'qualified', 'customer', 'inactive'].includes(status as string);
  
  return (
    <span className={clsx('badge', `badge--${isDefaultStatus ? status : 'dynamic'}`, className)}>
      {isDefaultStatus ? t(`status.${status}`) : status}
    </span>
  );
};

export default Badge;
