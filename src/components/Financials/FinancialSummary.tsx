import React from 'react';
import { useTranslation } from 'react-i18next';
import { Receipt, Plus, CheckCircle2 } from 'lucide-react';
import type { Contract } from '../../types';
import Button from '../UI/Button';
import { formatCurrency } from '../../utils/format';

interface FinancialSummaryProps {
  contracts: Contract[];
  onAddContract: () => void;
  onSelectContract: (contract: Contract) => void;
  isLoading?: boolean;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ 
  contracts, 
  onAddContract, 
  onSelectContract,
  isLoading 
}) => {
  const { t } = useTranslation();
  const currencySymbol = t('currency_symbol', '$');

  return (
    <div className="info-card financial-summary">
      <div className="info-card__header-row">
        <h3 className="info-card__title">{t('contracts')}</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddContract}
          className="add-btn"
          disabled={isLoading}
        >
          <Plus size={14} />
        </Button>
      </div>

      <div className="contracts-list">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner--small"></div>
          </div>
        ) : contracts.length === 0 ? (
          <p className="no-data-msg">{t('no_contracts_found', 'No contracts found.')}</p>
        ) : (
          contracts.map(contract => (
            <div 
              key={contract.id} 
              className="contract-item"
              onClick={() => onSelectContract(contract)}
            >
              <div className="contract-item__header">
                <div className="contract-item__title-box">
                  <Receipt size={16} className="contract-icon" />
                  <span className="contract-title">{contract.title}</span>
                </div>
                {contract.is_fully_paid && (
                  <CheckCircle2 size={16} className="paid-icon" />
                )}
              </div>

              <div className="contract-progress">
                <div 
                  className="contract-progress__bar" 
                  style={{ width: `${(contract.total_paid / contract.total_amount) * 100}%` }}
                />
              </div>

              <div className="contract-footer">
                {!contract.is_fully_paid && (
                  <span className="remaining-label">
                    {t('remaining_balance')}: <strong>{currencySymbol}{formatCurrency(contract.remaining_balance)}</strong>
                  </span>
                )}
                <span className="total-label">
                  {currencySymbol}{formatCurrency(contract.total_amount)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FinancialSummary;
