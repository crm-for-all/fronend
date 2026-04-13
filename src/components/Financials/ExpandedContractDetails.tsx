import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { financialsApi } from '../../api/financials';
import type { Payment, PaymentReportItem } from '../../types';
import Button from '../UI/Button';
import { formatCurrency } from '../../utils/format';
import './ExpandedContractDetails.scss';

interface ExpandedContractDetailsProps {
  contract: PaymentReportItem;
  isOpen: boolean;
  onOpenModal: () => void;
}

const ExpandedContractDetails: React.FC<ExpandedContractDetailsProps> = ({
  contract,
  isOpen,
  onOpenModal
}) => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      financialsApi.getPayments(contract.contract_id)
        .then((data) => {
          // Sort payments by date (oldest first for timeline)
          const sorted = [...data].sort((a, b) => new Date(a.paid_at).getTime() - new Date(b.paid_at).getTime());
          setPayments(sorted);
        })
        .catch((err) => {
          console.error('Error fetching payments:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, contract.contract_id]);

  const currencySymbol = t('currency_symbol', '₪');

  return (
    <div className={`expanded-contract-details ${isOpen ? 'open' : ''}`}>
      <div className="expanded-contract-details__inner">
        <div className="timeline-section">
          <h4 className="timeline-title">{t('payment_timeline', 'Payment Timeline')}</h4>
          
          {loading ? (
            <div className="timeline-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="timeline-empty">
              {t('no_payments_yet', 'No payments recorded yet.')}
            </div>
          ) : (
            <div className="timeline">
              {payments.map((payment, index) => (
                <div key={payment.id} className="timeline-item">
                  <div className="timeline-item__icon">
                    <CheckCircle2 size={16} />
                    {index < payments.length - 1 && <div className="timeline-line"></div>}
                  </div>
                  <div className="timeline-item__content">
                    <div className="timeline-item__header">
                      <span className="installment-num">{t('installment', 'Installment')} #{index + 1}</span>
                      <span className="installment-amount">{currencySymbol}{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="timeline-item__meta">
                      <span className="status-badge paid">{t('paid', 'PAID')}</span>
                      <span className="date"> • {new Date(payment.paid_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {contract.debt_left > 0 && (
                 <div className="timeline-item timeline-item--pending">
                  <div className="timeline-item__icon">
                    <Clock size={16} />
                  </div>
                  <div className="timeline-item__content">
                    <div className="timeline-item__header">
                      <span className="installment-num">{t('remaining_balance', 'Remaining Balance')}</span>
                      <span className="installment-amount pending">{currencySymbol}{formatCurrency(contract.debt_left)}</span>
                    </div>
                    <div className="timeline-item__meta">
                      <span className="status-badge pending">{t('unpaid', 'UNPAID')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="actions-section">
          <Button onClick={onOpenModal} className="open-contract-btn" variant="primary">
            {t('open_contract_details', 'Open Contract Details')} <ExternalLink size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpandedContractDetails;
