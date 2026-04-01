import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, UserPlus } from 'lucide-react';
import { customersApi } from '../../api/customers';
import type { Customer } from '../../types';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import CustomerModal from '../../components/CustomerModal/CustomerModal';
import CustomerDetailsModal from '../../components/CustomerModal/CustomerDetailsModal';
import './Customers.scss';

const CustomersDashboard = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedCustomer(undefined);
    setIsCreateEditModalOpen(true);
  };

  const handleOpenDetailsModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(false);
    setIsCreateEditModalOpen(true);
  };

  const handleCreateEditModalClose = (saved?: boolean) => {
    setIsCreateEditModalOpen(false);
    if (saved) {
      fetchCustomers();
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customers-page">
      <div className="customers-page__header">
        <div className="customers-page__title">
          <h1>{t('customers')}</h1>
          <p>{t('customers_subtitle', 'Manage your customer relationships in a clean, fast, and action-oriented interface.')}</p>
        </div>
        <div className="customers-page__actions">
          <div className="search-box">
            <Search className="search-box__icon" />
            <input 
              type="text" 
              placeholder={t('search_placeholder', 'חיפוש לפי שם או פרטי קשר...')} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={handleOpenCreateModal} className="btn-new-customer">
            <UserPlus size={18} />
            {t('new_customer_btn', 'לקוח חדש')}
          </Button>
        </div>
      </div>

      <Card className="customers-list">
        <div className="customers-list__head">
          <div className="col-name">{t('col_name')}</div>
          <div className="col-contact">{t('col_contact')}</div>
          <div className="col-notes">{t('col_notes')}</div>
          <div className="col-tags">{t('col_tags')}</div>
          <div className="col-status">{t('col_status')}</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">{t('fetching_customers', 'Loading customers...')}</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t('no_customers_found', 'No customers found.')}</div>
        ) : (
          filteredCustomers.map(customer => {
            const primaryPhone = customer.phones?.find(p => p.is_primary)?.phone_number || customer.phones?.[0]?.phone_number || '';
            
            return (
                <div 
                  key={customer.id} 
                  className="customers-list__row"
                  onClick={() => handleOpenDetailsModal(customer)}
                >
                <div className="col-name">
                  <strong>{customer.name}</strong>
                  <span>{customer.email || t('no_company', 'No Company')}</span>
                </div>
                
                <div className="col-contact">
                  {primaryPhone && <span className="phone">{primaryPhone}</span>}
                  {customer.email && <span className="email">{customer.email}</span>}
                </div>
                
                <div className="col-notes">
                  <span className="truncate">{customer.notes || '\u2014'}</span>
                  {customer.notes && <span className="read-more">{t('read_more')}</span>}
                </div>

                <div className="col-tags">
                  {customer.tags && customer.tags.length > 0
                    ? customer.tags.map(tag => (
                        <Badge key={tag.id} tag={tag} />
                      ))
                    : <span className="no-tags">{t('no_tags')}</span>
                  }
                </div>

                <div className="col-status">
                  <Badge status={customer.status} />
                </div>
              </div>
            );
          })
        )}
      </Card>

      <CustomerModal 
        isOpen={isCreateEditModalOpen} 
        onClose={handleCreateEditModalClose} 
        customer={selectedCustomer} 
      />

      <CustomerDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        customer={selectedCustomer}
        onEdit={handleOpenEditModal}
      />
    </div>
  );
};

export default CustomersDashboard;
