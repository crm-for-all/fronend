import React from 'react';
import { useTranslation } from 'react-i18next';
import { Share2, Edit2, Mail, Phone, CalendarClock, Copy } from 'lucide-react';
import Modal from '../UI/Modal';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import type { Customer, Contract } from '../../types';
import { financialsApi } from '../../api/financials';
import FinancialSummary from '../Financials/FinancialSummary';
import ContractDetailsModal from '../Financials/ContractDetailsModal';
import ContractModal from '../Financials/ContractModal';
import { useToast } from '../UI/ToastProvider';
import './CustomerDetailsModal.scss';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  customer?: Customer;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ isOpen, onClose, onEdit, customer }) => {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();

  const [contracts, setContracts] = React.useState<Contract[]>([]);
  const [isFinancialsLoading, setIsFinancialsLoading] = React.useState(false);
  const [selectedContract, setSelectedContract] = React.useState<Contract | null>(null);
  const [isAddingContract, setIsAddingContract] = React.useState(false);

  const fetchFinancials = React.useCallback(async () => {
    if (!customer?.id) return;
    setIsFinancialsLoading(true);
    try {
      const data = await financialsApi.getContracts(customer.id);
      setContracts(data);
    } catch (err) {
      console.error('Failed to fetch contracts', err);
    } finally {
      setIsFinancialsLoading(false);
    }
  }, [customer?.id]);

  React.useEffect(() => {
    if (isOpen && customer?.id) {
      fetchFinancials();
    }
  }, [isOpen, customer?.id, fetchFinancials]);

  const handleContractModalClose = () => {
    setSelectedContract(null);
  };

  const handleContractUpdate = () => {
    fetchFinancials();
  };

  const handleAddContractClose = (refresh?: boolean) => {
    setIsAddingContract(false);
    if (refresh) fetchFinancials();
  };

  if (!customer) return null;

  // Formatting date nicely
  const updatedAt = new Date(customer.updated_at || customer.created_at || Date.now());
  const locale = i18n.language === 'he' ? 'he-IL' : i18n.language === 'ru' ? 'ru-RU' : 'en-US';
  const dateString = updatedAt.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  const handleCopyPhone = (phoneStr: string) => {
    if (!phoneStr) return;
    navigator.clipboard.writeText(phoneStr);
    showToast(t('phone_copied', 'Phone copied!'), 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="customer-details">
        <div className="customer-details__header">
          <div className="customer-details__header-content">
            <span className="customer-details__subtitle">{t('customer_profile')}</span>
            <div className="customer-details__title-row">
              <h2>{customer.name}</h2>
              <Badge status={customer.status} />
            </div>
            <div className="customer-details__meta">
              <CalendarClock size={14} />
              <span>{t('last_updated')}: {dateString}</span>
            </div>
          </div>
          <div className="customer-details__actions">
            <Button variant="outline" className="action-btn" disabled title="Share (Disabled)">
              <Share2 size={18} />
            </Button>
            <Button variant="secondary" className="action-btn" onClick={() => { onClose(); onEdit(customer); }} title={t('edit', 'Edit')}>
              <Edit2 size={18} />
            </Button>
          </div>
        </div>

        <div className="customer-details__body">
          <div className="customer-details__sidebar">
            <div className="info-card">
              <h3 className="info-card__title">{t('contact_details')}</h3>

              <div className="info-card__item">
                <div className="info-card__icon-box">
                  <Mail size={16} />
                </div>
                <div className="info-card__text">
                  <span>{t('email_label')}</span>
                  <strong>{customer.email || '---'}</strong>
                </div>
              </div>

              <div className="info-card__item" style={{ alignItems: 'flex-start' }}>
                <div className="info-card__icon-box">
                  <Phone size={16} />
                </div>
                <div className="info-card__text" style={{ flex: 1 }}>
                  <span>{t('phone_label')}</span>
                  {customer.phones && customer.phones.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
                      {[...customer.phones].sort((a, b) => (a.is_primary === b.is_primary ? 0 : a.is_primary ? -1 : 1)).map((phone, idx) => {
                        const uniqueKey = ('id' in phone ? phone.id : undefined) ?? `${idx}-${phone.phone_number}`;
                        return (
                          <div 
                            key={uniqueKey} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '10px', 
                              cursor: 'pointer',
                              position: 'relative',
                            }}
                            className="phone-copy-item"
                            onClick={() => handleCopyPhone(phone.phone_number)}
                            title={t('click_to_copy', 'Click to copy')}
                          >
                            <strong style={{ 
                              fontSize: phone.is_primary ? '15px' : '14px', 
                              lineHeight: 1,
                              color: phone.is_primary ? 'var(--color-primary)' : 'var(--color-secondary)',
                              fontWeight: phone.is_primary ? 600 : 400
                            }}>
                              {phone.phone_number || '---'}
                            </strong>
                            <div className="copy-icon-hover" style={{ display: 'flex', alignItems: 'center', color: 'var(--tone-teal-text)' }}>
                              <Copy size={12} />
                            </div>
                            {phone.is_primary && customer.phones!.length > 1 && (
                              <span style={{ 
                                fontSize: '11px', 
                                backgroundColor: 'var(--tone-blue-bg)', 
                                color: 'var(--tone-blue-text)', 
                                padding: '3px 8px', 
                                borderRadius: '99px', 
                                fontWeight: 500,
                                lineHeight: 1
                              }}>
                                {t('primary', 'primary')}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <strong>---</strong>
                  )}
                </div>
              </div>
            </div>

            {customer.last_event && (
              <div className="info-card">
                <h3 className="info-card__title">{t('last_activity')}</h3>
                <div className="info-card__text">
                  <strong>{customer.last_event}</strong>
                </div>
              </div>
            )}

            <FinancialSummary
              contracts={contracts}
              onAddContract={() => setIsAddingContract(true)}
              onSelectContract={setSelectedContract}
              isLoading={isFinancialsLoading}
            />
          </div>

          <div className="customer-details__main">
            <div className="timeline">
              <h3 className="timeline__title">{t('notes_documentation')}</h3>

              <div className="timeline__item">
                <div className="timeline__content">
                  <p className="timeline__text">
                    {customer.notes || t('no_notes')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedContract && (
        <ContractDetailsModal
          isOpen={!!selectedContract}
          onClose={handleContractModalClose}
          onUpdate={handleContractUpdate}
          contract={selectedContract}
        />
      )}

      {isAddingContract && (
        <ContractModal
          isOpen={isAddingContract}
          onClose={handleAddContractClose}
          customerId={customer.id}
        />
      )}
    </Modal>
  );
};

export default CustomerDetailsModal;
