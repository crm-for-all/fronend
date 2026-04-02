import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { Plus, Trash2, Check } from 'lucide-react';
import { customersApi } from '../../api/customers';
import { tagsApi } from '../../api/tags';
import { statusesApi } from '../../api/statuses';
import type { Customer, CustomerCreateDTO, CustomerUpdateDTO, Tag, Status } from '../../types';
import './CustomerModal.scss';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: (saved?: boolean) => void;
  customer?: Customer;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, customer }) => {
  const { t } = useTranslation();

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<Status[]>([]);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<CustomerCreateDTO>>({
    name: '',
    email: '',
    status_id: '',
    tag_ids: [],
    notes: '',
    last_event: '',
    phones: [{ phone_number: '', is_primary: true }]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeta = async () => {
      setIsFetchingMeta(true);
      try {
        const [fetchedTags, fetchedStatuses] = await Promise.all([
          tagsApi.getAll().catch(() => []),
          statusesApi.getAll().catch(() => [])
        ]);
        setAvailableTags(fetchedTags);
        setAvailableStatuses(fetchedStatuses);
      } finally {
        setIsFetchingMeta(false);
      }
    };
    if (isOpen) fetchMeta();
  }, [isOpen]);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email || '',
        status_id: customer.status_id || '',
        tag_ids: customer.tag_ids || customer.tags?.map(t => t.id) || [],
        notes: customer.notes || '',
        last_event: customer.last_event || '',
        phones: customer.phones?.length ? customer.phones : [{ phone_number: '', is_primary: true }]
      });
    } else {
      setFormData({
        name: '',
        email: '',
        status_id: '',
        tag_ids: [],
        notes: '',
        last_event: '',
        phones: [{ phone_number: '', is_primary: true }]
      });
    }
    setError('');
  }, [customer, isOpen, availableStatuses]);

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

  const handleAddPhone = () => {
    setFormData(prev => ({
      ...prev,
      phones: [...(prev.phones || []), { phone_number: '', is_primary: prev.phones?.length === 0 }]
    }));
  };

  const handleRemovePhone = (index: number) => {
    setFormData(prev => {
      const newPhones = [...(prev.phones || [])];
      newPhones.splice(index, 1);
      // If we removed the primary, make the first one primary
      if (newPhones.length > 0 && !newPhones.some(p => p.is_primary)) {
        newPhones[0].is_primary = true;
      }
      return { ...prev, phones: newPhones };
    });
  };

  const updatePhone = (index: number, val: string) => {
    setFormData(prev => {
      const newPhones = [...(prev.phones || [])];
      newPhones[index].phone_number = val;
      return { ...prev, phones: newPhones };
    });
  };

  const setPrimaryPhone = (index: number) => {
    setFormData(prev => {
      const newPhones = [...(prev.phones || [])].map((p, i) => ({ ...p, is_primary: i === index }));
      return { ...prev, phones: newPhones };
    });
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => {
      const currentTags = prev.tag_ids || [];
      if (currentTags.includes(tagId)) {
        return { ...prev, tag_ids: currentTags.filter(id => id !== tagId) };
      } else {
        return { ...prev, tag_ids: [...currentTags, tagId] };
      }
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => onClose(false)} 
      title={customer ? t('edit_customer', 'ערוך לקוח') : t('new_customer', 'לקוח חדש')}
    >
      <form className="customer-form" onSubmit={handleSubmit}>
        {error && <div className="customer-form__error">{error}</div>}
        
        <Input 
          label={t('full_name', 'שם מלא')} 
          value={formData.name || ''} 
          onChange={e => setFormData({ ...formData, name: e.target.value })} 
          required 
        />
        
        <Input 
          label={t('email_label', 'אימייל')} 
          type="email" 
          value={formData.email || ''} 
          onChange={e => setFormData({ ...formData, email: e.target.value })} 
        />
        
        <div className="input-group input-group--full">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="input-group__label" style={{ margin: 0 }}>{t('phone_label', 'טלפון')}</label>
            <Button type="button" variant="outline" onClick={handleAddPhone} style={{ padding: '4px 8px', height: 'auto', fontSize: '12px' }}>
              <Plus size={14} style={{ marginInlineEnd: '4px' }} />
              {t('add_phone', 'הוסף טלפון')}
            </Button>
          </div>
          
          <div className="phones-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {formData.phones?.map((phone, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="input-group__input"
                  style={{ flex: 1 }}
                  value={phone.phone_number}
                  onChange={(e) => updatePhone(idx, e.target.value)}
                  placeholder={t('phone_label', 'טלפון')}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="primary_phone"
                    checked={phone.is_primary}
                    onChange={() => setPrimaryPhone(idx)}
                  />
                  {t('primary', 'ראשי')}
                </label>
                {formData.phones!.length > 1 && (
                  <button type="button" onClick={() => handleRemovePhone(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="input-group input-group--full" style={{ position: 'relative' }}>
          <label className="input-group__label">{t('status_label', 'סטטוס')}</label>
          <div 
            className="input-group__input" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: isFetchingMeta || availableStatuses.length === 0 ? 'not-allowed' : 'pointer', opacity: isFetchingMeta || availableStatuses.length === 0 ? 0.5 : 1 }}
            onClick={() => { if (!isFetchingMeta && availableStatuses.length > 0) setIsStatusOpen(!isStatusOpen); }}
          >
            {isFetchingMeta ? (
              <span style={{ color: 'var(--color-secondary)' }}>{t('loading', 'טוען...')}</span>
            ) : availableStatuses.length === 0 ? (
              <span style={{ color: 'var(--color-secondary)' }}>{t('no_statuses', 'אין סטטוסים, הוסף בהגדרות')}</span>
            ) : formData.status_id ? (
              <Badge status={availableStatuses.find(s => s.id === formData.status_id)} />
            ) : (
              <span style={{ color: 'var(--color-secondary)' }}>{t('select_status', 'Select Status')}</span>
            )}
          </div>
          
          {isStatusOpen && availableStatuses.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '4px', maxHeight: '160px', overflowY: 'auto', backgroundColor: 'var(--color-surface)', zIndex: 10, boxShadow: 'var(--shadow-md)' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', cursor: 'pointer', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--color-muted)' }}
                onClick={() => { setFormData({ ...formData, status_id: '' }); setIsStatusOpen(false); }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t('no_status_option', 'No Status')}
              </div>
              {availableStatuses.map(status => (
                <div 
                  key={status.id} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                  onClick={() => { setFormData({ ...formData, status_id: status.id }); setIsStatusOpen(false); }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Badge status={status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="input-group input-group--full">
          <label className="input-group__label">{t('tags_label', 'תגיות')}</label>
          <div className="tags-dropdown" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px', maxHeight: '140px', overflowY: 'auto', backgroundColor: 'var(--color-surface)' }}>
            {isFetchingMeta ? (
              <span style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>{t('loading', 'טוען...')}</span>
            ) : availableTags.length === 0 ? (
              <span style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>{t('no_labels', 'אין תגיות, הוסף בהגדרות')}</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {availableTags.map(tag => {
                  const isSelected = formData.tag_ids?.includes(tag.id) || false;
                  return (
                    <label 
                      key={tag.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        padding: '6px 12px',
                        fontSize: '14px', 
                        cursor: 'pointer', 
                        backgroundColor: isSelected ? 'var(--color-sidebar-hover)' : 'transparent',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all 0.2s',
                        margin: 0
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleTagToggle(tag.id)}
                        style={{ display: 'none' }}
                      />
                      <div style={{ 
                        width: '18px', 
                        height: '18px', 
                        borderRadius: '4px', 
                        border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent'
                      }}>
                        {isSelected && <Check size={12} color="var(--color-surface)" strokeWidth={3} />}
                      </div>
                      <Badge tag={tag} />
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <Input 
          label={t('last_activity_help', 'פעולה אחרונה (למשל: שיחה - 24/05/2024)')} 
          value={formData.last_event || ''} 
          onChange={e => setFormData({ ...formData, last_event: e.target.value })} 
        />

        <div className="input-group input-group--full">
          <label className="input-group__label">{t('notes', 'הערות')}</label>
          <textarea 
            className="input-group__input"
            style={{ height: '100px', padding: '12px' }}
            value={formData.notes || ''}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="customer-form__actions">
          <Button type="button" variant="outline" onClick={() => onClose()}>
            {t('cancel', 'ביטול')}
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {customer ? t('save_changes', 'שמור שינויים') : t('create_customer', 'צור לקוח')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerModal;
