import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { financialsApi } from '../../api/financials';
import type { ContractCreateDTO } from '../../types';

interface ContractModalProps {
  isOpen: boolean;
  onClose: (saved?: boolean) => void;
  customerId: string;
}

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onClose, customerId }) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<ContractCreateDTO>({
    title: '',
    total_amount: 0,
    signed_at: new Date().toISOString().split('T')[0] // Default to today (YYYY-MM-DD)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.total_amount <= 0) return;

    // Frontend future date validation
    if (formData.signed_at && new Date(formData.signed_at) > new Date()) {
      setError(t('future_date_error', 'Date cannot be in the future'));
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      // Ensure we send ISO string
      const payload = { 
        ...formData, 
        signed_at: formData.signed_at ? new Date(formData.signed_at).toISOString() : undefined 
      };
      await financialsApi.createContract(customerId, payload);
      onClose(true);
    } catch (err: any) {
      setError(err.response?.data?.message || t('error_saving', 'Error saving data'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => onClose(false)} 
      title={t('add_contract')}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="contract-form">
        <Input
          label={t('contract_title')}
          placeholder={t('contract_title_placeholder', 'e.g. Software Development')}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          fullWidth
        />
        
        <Input
          label={t('total_amount')}
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.total_amount || ''}
          onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) || 0 })}
          required
          fullWidth
        />

        <Input
          label={t('signed_at', 'Signed At')}
          type="date"
          value={formData.signed_at}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setFormData({ ...formData, signed_at: e.target.value })}
          required
          fullWidth
        />

        {error && <div className="form-error">{error}</div>}

        <div className="modal-actions" style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button type="button" variant="ghost" onClick={() => onClose(false)}>
            {t('cancel')}
          </Button>
          <Button type="submit" isLoading={isSaving} disabled={!formData.title || formData.total_amount <= 0}>
            {t('create_contract', 'Create Contract')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ContractModal;
