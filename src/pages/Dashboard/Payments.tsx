import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CreditCard, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { financialsApi } from '../../api/financials';
import type { PaymentReportItem, PaymentStats } from '../../types';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import CustomerDetailsModal from '../../components/CustomerModal/CustomerDetailsModal';
import { formatCurrency } from '../../utils/format';
import './Payments.scss';

const Payments: React.FC = () => {
  const { t } = useTranslation();
  const currencySymbol = t('currency_symbol', '₪');

  // State
  const [items, setItems] = useState<PaymentReportItem[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('unpaid_first');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modal state
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null); // For details modal

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await financialsApi.getPaymentsReport({
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        page,
        per_page: perPage,
        sort_by: sortBy
      });
      setItems(response.items);
      setStats(response.stats);
      setTotalPages(response.pages);
    } catch (err) {
      console.error('Failed to fetch payments report', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [page, perPage, sortBy, startDate, endDate]);

  const handleRowClick = (item: PaymentReportItem) => {
    // This assumes we have a way to fetch the full customer object
    // For now we'll pass a partial or add a helper to CustomersAPI
    setSelectedCustomer({ id: item.id, name: item.name, status: item.status } as any);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleDateString(undefined, { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric' 
    });
  };

  const formatDateShort = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, { 
      day: 'numeric', 
      month: 'short'
    });
  };

  return (
    <div className="payments-page">
      <div className="payments-page__header">
        <div className="payments-page__title">
          <h1>{t('payments_report')}</h1>
          <p>{t('payments_subtitle')}</p>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="payments-metrics">
        <div className="metric-card metric-card--primary">
          <div className="metric-card__icon"><TrendingUp size={20} /></div>
          <div className="metric-card__content">
            <span className="metric-card__label">{t('total_contract_value')}</span>
            <div className="metric-card__value">
              {currencySymbol}{formatCurrency(stats?.total_contract_amount || 0)}
            </div>
            <div className="metric-card__footer">
              <span className="contract-count">{stats?.contract_count || 0} {t('contracts')}</span>
              <span className="period-badge">
                {startDate || endDate 
                  ? `${startDate ? formatDateShort(startDate) : ''} - ${endDate ? formatDateShort(endDate) : '∞'}` 
                  : t('period_overall', 'Overall')}
              </span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card__icon"><Clock size={20} /></div>
          <div className="metric-card__content">
            <span className="metric-card__label">{t('debt_new', 'New Debt')}</span>
            <div className="metric-card__value">
              {currencySymbol}{formatCurrency(stats?.debt_aging?.range_0_30 || 0)}
            </div>
            <span className="metric-card__sub">0-30 {t('days')}</span>
          </div>
        </div>

        <div className="metric-card metric-card--warning">
          <div className="metric-card__icon"><AlertCircle size={20} /></div>
          <div className="metric-card__content">
            <span className="metric-card__label">{t('debt_overdue', 'Overdue')}</span>
            <div className="metric-card__value">
              {currencySymbol}{formatCurrency(stats?.debt_aging?.range_31_60 || 0)}
            </div>
            <span className="metric-card__sub">31-60 {t('days')}</span>
          </div>
        </div>

        <div className="metric-card metric-card--danger">
          <div className="metric-card__icon"><AlertCircle size={20} /></div>
          <div className="metric-card__content">
            <span className="metric-card__label">{t('debt_critical', 'Critical')}</span>
            <div className="metric-card__value">
              {currencySymbol}{formatCurrency(stats?.debt_aging?.range_60_plus || 0)}
            </div>
            <span className="metric-card__sub">60+ {t('days')}</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="payments-filters">
        <div className="filters-group filters-group--date">
          <div className="date-field">
            <label>{t('from', 'From')}</label>
            <div className="date-input">
              <Calendar size={16} />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }} 
              />
            </div>
          </div>
          <div className="date-field">
            <label>{t('to', 'To')}</label>
            <div className="date-input">
              <Calendar size={16} />
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }} 
              />
            </div>
          </div>
        </div>

        <div className="filters-group">
          <div className="select-wrapper">
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
              <option value="unpaid_first">{t('sort_unpaid_first')}</option>
              <option value="last_payment_asc">{t('sort_last_payment_asc')}</option>
              <option value="last_payment_desc">{t('sort_last_payment_desc')}</option>
            </select>
            <ChevronDown size={14} className="chevron" />
          </div>

          <div className="select-wrapper select-wrapper--per-page">
            <span>{t('per_page')}:</span>
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <ChevronDown size={14} className="chevron" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="payments-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <CreditCard size={48} />
            <h3>{t('no_payments_found', 'No payment records found.')}</h3>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>{t('col_name')}</th>
                    <th>{t('status')}</th>
                    <th>{t('debt_label')}</th>
                    <th>{t('last_payment')}</th>
                    <th className="actions-th"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr 
                      key={item.id} 
                      onClick={() => handleRowClick(item)}
                      className={item.has_unpaid_contracts ? 'row--has-debt' : ''}
                    >
                      <td data-label={t('col_name')}>
                        <div className="customer-name-cell">
                          <strong>{item.name}</strong>
                          {item.has_unpaid_contracts && (
                            <span className="debt-indicator" title={t('unpaid_contracts')}></span>
                          )}
                        </div>
                      </td>
                      <td data-label={t('status')}><Badge status={item.status} /></td>
                      <td data-label={t('debt_label')}>
                        <span className={item.total_owed > 0 ? 'debt-amount danger' : 'debt-amount'}>
                          {currencySymbol}{formatCurrency(item.total_owed)}
                        </span>
                      </td>
                      <td data-label={t('last_payment')}>
                        <div className="last-payment-cell">
                          <span className="amount">{currencySymbol}{formatCurrency(item.last_payment_amount)}</span>
                          <span className="date">{formatDate(item.last_payment_at)}</span>
                        </div>
                      </td>
                      <td className="actions-td">
                        <Button variant="ghost" size="sm">
                          <ExternalLink size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="payments-pagination">
              <div className="pagination-info">
                {t('showing_page', { page, total: totalPages })}
              </div>
              <div className="pagination-controls">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft size={16} />
                </Button>
                <div className="page-numbers">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i + 1} 
                      className={page === i + 1 ? 'active' : ''}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedCustomer && (
        <CustomerDetailsModal 
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onEdit={() => {}} // Handle if needed
          customer={selectedCustomer}
        />
      )}
    </div>
  );
};

export default Payments;
