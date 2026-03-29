import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { customersApi } from '../../api/customers';
import type { Customer, CustomerCreateDTO, CustomerStatus, CustomerUpdateDTO } from '../../types';
import './CustomerModal.scss';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: (saved?: boolean) => void;
  customer?: Customer;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, customer }) => {
  const { t } = useTranslation();

  const STATUS_OPTIONS = [
    { value: 'lead', label: t('status.lead') },
    { value: 'contacted', label: t('status.contacted') },
    { value: 'qualified', label: t('status.qualified') },
    { value: 'customer', label: t('status.customer') },
    { value: 'inactive', label: t('status.inactive') }
  ];

  const [formData, setFormData] = useState<Partial<CustomerCreateDTO>>({
    name: '',
    email: '',
    status: 'lead',
    notes: '',
    last_event: '',
    phones: [{ phone_number: '', is_primary: true }]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email || '',
        status: customer.status,
        notes: customer.notes || '',
        last_event: customer.last_event || '',
        phones: customer.phones?.length ? customer.phones : [{ phone_number: '', is_primary: true }]
      });
    } else {
      setFormData({
        name: '',
        email: '',
        status: 'lead',
        notes: '',
        last_event: '',
        phones: [{ phone_number: '', is_primary: true }]
      });
    }
    setError('');
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (customer) {
        await customersApi.update(customer.id, formData as CustomerUpdateDTO);
      } else {
        await customersApi.create(formData as CustomerCreateDTO);
      }
      onClose(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      phones: [{ phone_number: val, is_primary: true }]
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => onClose(false)} 
      title={customer ? 'ערוך לקוח' : 'לקוח חדש'}
    >
      <form className="customer-form" onSubmit={handleSubmit}>
        {error && <div className="customer-form__error">{error}</div>}
        
        <Input 
          label="שם מלא" 
          value={formData.name || ''} 
          onChange={e => setFormData({ ...formData, name: e.target.value })} 
          required 
        />
        
        <Input 
          label="אימייל" 
          type="email" 
          value={formData.email || ''} 
          onChange={e => setFormData({ ...formData, email: e.target.value })} 
        />
        
        <Input 
          label="טלפון ראשי" 
          value={formData.phones?.[0]?.phone_number || ''} 
          onChange={e => handlePhoneChange(e.target.value)} 
        />
        
        <div className="input-group input-group--full">
          <label className="input-group__label">סטטוס</label>
          <select 
            className="input-group__input"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value as CustomerStatus })}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <Input 
          label="פעולה אחרונה (למשל: שיחה - 24/05/2024)" 
          value={formData.last_event || ''} 
          onChange={e => setFormData({ ...formData, last_event: e.target.value })} 
        />

        <div className="input-group input-group--full">
          <label className="input-group__label">הערות</label>
          <textarea 
            className="input-group__input"
            style={{ height: '100px', padding: '12px' }}
            value={formData.notes || ''}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="customer-form__actions">
          <Button type="button" variant="outline" onClick={() => onClose()}>
            ביטול
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {customer ? 'שמור שינויים' : 'צור לקוח'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerModal;
