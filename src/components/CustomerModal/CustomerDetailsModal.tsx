import React from 'react';
import { useTranslation } from 'react-i18next';
import { Share2, Edit2, Mail, Phone, CalendarClock } from 'lucide-react';
import Modal from '../UI/Modal';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import type { Customer } from '../../types';
import './CustomerDetailsModal.scss';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  customer?: Customer;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ isOpen, onClose, onEdit, customer }) => {
  const { t } = useTranslation();

  if (!customer) return null;

  const primaryPhone = customer.phones?.find(p => p.is_primary)?.phone_number || customer.phones?.[0]?.phone_number;

  // Formatting date nicely (mocking "some time ago" or just showing date)
  const updatedAt = new Date(customer.updated_at || customer.created_at || Date.now());
  const dateString = updatedAt.toLocaleDateString(t('he') ? 'he-IL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="customer-details">
        <div className="customer-details__header">
          <div className="customer-details__header-content">
            <span className="customer-details__subtitle">פרופיל לקוח</span>
            <div className="customer-details__title-row">
              <h2>{customer.name}</h2>
              <Badge status={customer.status} />
            </div>
            <div className="customer-details__meta">
              <CalendarClock size={14} />
              <span>עודכן לאחרונה: {dateString}</span>
            </div>
          </div>
          <div className="customer-details__actions">
            <Button variant="outline" className="action-btn" disabled>
              <Share2 size={18} />
            </Button>
            <Button variant="secondary" className="action-btn" onClick={() => { onClose(); onEdit(customer); }}>
              <Edit2 size={18} />
            </Button>
          </div>
        </div>

        <div className="customer-details__body">
          <div className="customer-details__sidebar">
            <div className="info-card">
              <h3 className="info-card__title">פרטי התקשרות</h3>
              
              <div className="info-card__item">
                <div className="info-card__icon-box">
                  <Mail size={16} />
                </div>
                <div className="info-card__text">
                  <span>דואר אלקטרוני</span>
                  <strong>{customer.email || '---'}</strong>
                </div>
              </div>

              <div className="info-card__item">
                <div className="info-card__icon-box">
                  <Phone size={16} />
                </div>
                <div className="info-card__text">
                  <span>טלפון נייד</span>
                  <strong>{primaryPhone || '---'}</strong>
                </div>
              </div>
            </div>

            {customer.last_event && (
              <div className="info-card">
                <h3 className="info-card__title">פעולה אחרונה</h3>
                <div className="info-card__text">
                  <strong>{customer.last_event}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="customer-details__main">
            <div className="timeline">
              <h3 className="timeline__title">הערות ותיעוד</h3>
              
              <div className="timeline__item">
                <div className="timeline__content">
                  <p className="timeline__text">
                    {customer.notes || 'אין הערות מתועדות ללקוח זה.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerDetailsModal;
