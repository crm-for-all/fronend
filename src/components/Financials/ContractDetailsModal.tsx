import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Trash2, 
  History, 
  TrendingUp, 
  AlertCircle,
  Clock,
  ArrowDownCircle
} from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import ConfirmModal from '../UI/ConfirmModal';
import { financialsApi } from '../../api/financials';
import type { Contract, Payment } from '../../types';
import { formatCurrency } from '../../utils/format';
import './ContractDetailsModal.scss';

interface ContractDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  contract: Contract;
}

const ContractDetailsModal: React.FC<ContractDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpdate,
  contract 
}) => {
  const { t, i18n } = useTranslation();
  const currencySymbol = t('currency_symbol', '$');

  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentContract, setCurrentContract] = useState<Contract>(contract);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Deletion state
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Payment Form State
  const [amount, setAmount] = useState('');
  const [paidAt, setPaidAt] = useState(new Date().toISOString().split('T')[0]); // Default to today (YYYY-MM-DD for input type="date")

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [paymentsData, contractData] = await Promise.all([
        financialsApi.getPayments(contract.id),
        financialsApi.getContract(contract.id)
      ]);
      
      // Sort payments by date desc (newest first)
      const sortedPayments = [...paymentsData].sort((a, b) => {
        const timeA = new Date(a.paid_at || a.created_at).getTime();
        const timeB = new Date(b.paid_at || b.created_at).getTime();
        return timeB - timeA;
      });

      setPayments(sortedPayments);
      setCurrentContract(contractData);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  }, [contract.id]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setAmount('');
      setPaidAt(new Date().toISOString().split('T')[0]);
      setError('');
    }
  }, [isOpen, fetchData]);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    if (paidAt && new Date(paidAt) > new Date()) {
      setError(t('future_date_error', 'Payment date cannot be in the future'));
      return;
    }

    setIsSaving(true);
    setError('');

    // Frontend Validation
    if (val > contract.remaining_balance) {
      const msg = t('payment_exceeds_balance_detail', 'Payment amount ({{val}}) exceeds remaining balance ({{balance}})')
        .replace('{{val}}', `${currencySymbol}${formatCurrency(val)}`)
        .replace('{{balance}}', `${currencySymbol}${formatCurrency(contract.remaining_balance)}`);
      
      setError(msg);
      setIsSaving(false);
      return;
    }

    try {
      // If user selected today, we can just omit or send it. 
      // The local date input usually gives YYYY-MM-DD which is valid.
      await financialsApi.createPayment(contract.id, { 
        amount: val,
        paid_at: paidAt ? new Date(paidAt).toISOString() : undefined
      });
      setAmount('');
      setPaidAt(new Date().toISOString().split('T')[0]);
      await fetchData(); // Refresh local data (stats + list)
      onUpdate(); // Signal parent to refresh its summary, but don't close MODAL internally
    } catch (err: any) {
      setError(err.response?.data?.message || t('error_saving_payment', 'Failed to save payment'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    
    setIsDeleting(true);
    try {
      await financialsApi.deletePayment(paymentToDelete);
      setPaymentToDelete(null);
      await fetchData();
      onUpdate();
    } catch (err) {
      console.error('Failed to delete payment', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const locale = i18n.language === 'he' ? 'he-IL' : i18n.language === 'ru' ? 'ru-RU' : 'en-US';
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={currentContract.title} size="md">
      <div className="contract-modal">
        {/* Statistics Header */}
        <div className="contract-modal__stats">
          <div className="stat-box">
            <div className="stat-box__label">
              <TrendingUp size={14} />
              {t('total_amount')}
            </div>
            <div className="stat-box__value">{currencySymbol}{formatCurrency(currentContract.total_amount)}</div>
          </div>
          <div className="stat-box stat-box--success">
            <div className="stat-box__label">
              <ArrowDownCircle size={14} />
              {t('amount_paid')}
            </div>
            <div className="stat-box__value">{currencySymbol}{formatCurrency(currentContract.total_paid)}</div>
          </div>
          {!currentContract.is_fully_paid && (
            <div className="stat-box stat-box--warning">
              <div className="stat-box__label">
                <AlertCircle size={14} />
                {t('remaining_balance')}
              </div>
              <div className="stat-box__value">{currencySymbol}{formatCurrency(currentContract.remaining_balance)}</div>
            </div>
          )}
        </div>

        {/* Quick Add Payment */}
        {!currentContract.is_fully_paid && (
          <form className="quick-pay" onSubmit={handleAddPayment}>
            <div className="quick-pay__inputs-row">
              <div className="quick-pay__input">
                <span className="currency-prefix">{currencySymbol}</span>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder={t('payment_amount')}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="quick-pay__date">
                <input 
                  type="date" 
                  value={paidAt}
                  onChange={(e) => setPaidAt(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            <Button type="submit" isLoading={isSaving} disabled={!amount}>
              <Plus size={18} />
              {t('add_payment')}
            </Button>
          </form>
        )}
        
        {error && <div className="contract-modal__error">{error}</div>}

        {/* Payment History */}
        <div className="payment-history">
          <div className="section-title">
            <History size={16} />
            {t('payments')}
          </div>

          <div className="payment-list">
            {isLoading ? (
              <div className="sidebar-loading-box">
                <div className="loading-spinner--small"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="no-payments">
                <Clock size={32} />
                <p>{t('no_payments_yet', 'No payments recorded yet.')}</p>
              </div>
            ) : (
              payments.map(payment => (
                <div key={payment.id} className="payment-row">
                  <div className="payment-row__info">
                    <span className="amount">{currencySymbol}{formatCurrency(payment.amount)}</span>
                    <span className="date">{formatDate(payment.paid_at)}</span>
                  </div>
                  <div className="payment-row__actions">
                    <button 
                      className="delete-btn" 
                      onClick={() => setPaymentToDelete(payment.id)}
                      title={t('delete')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!paymentToDelete}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={handleDeletePayment}
        title={t('confirm_delete')}
        message={t('delete_payment_confirm')}
        variant="danger"
        isLoading={isDeleting}
      />
    </Modal>
  );
};

export default ContractDetailsModal;
