import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { CustomerStatus } from '../../types';
import './Badge.scss';

interface BadgeProps {
  status: CustomerStatus;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, className }) => {
  const { t } = useTranslation();
  
  return (
    <span className={clsx('badge', `badge--${status}`, className)}>
      {t(`status.${status}`)}
    </span>
  );
};

export default Badge;
