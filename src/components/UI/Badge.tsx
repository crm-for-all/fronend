import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { CustomerStatus } from '../../types';
import './Badge.scss';

interface BadgeProps {
  status: CustomerStatus | string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, className }) => {
  const { t } = useTranslation();
  
  // If status isn't one of the hardcoded enum values, it's a dynamic one.
  const isDefaultStatus = ['lead', 'contacted', 'qualified', 'customer', 'inactive'].includes(status);
  
  return (
    <span className={clsx('badge', `badge--${isDefaultStatus ? status : 'dynamic'}`, className)}>
      {isDefaultStatus ? t(`status.${status}`) : status}
    </span>
  );
};

export default Badge;
