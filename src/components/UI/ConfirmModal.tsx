import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'primary',
  isLoading = false
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ padding: '16px 0', color: 'var(--color-secondary)' }}>
        <p>{message}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginTop: '24px' }}>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelLabel || t('cancel', 'ביטול')}
        </Button>
        <Button 
          variant={variant === 'danger' ? 'danger' : 'primary'} 
          onClick={onConfirm} 
          isLoading={isLoading}
          style={variant === 'danger' ? { backgroundColor: 'var(--status-inactive-bg)', color: 'var(--status-inactive-text)' } : undefined}
        >
          {confirmLabel || t('confirm', 'אישור')}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
