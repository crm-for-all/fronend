import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, UserPlus } from 'lucide-react';
import { customersApi } from '../../api/customers';
import type { Customer } from '../../types';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import CustomerModal from '../../components/CustomerModal/CustomerModal';
import './Customers.scss';

const CustomersDashboard = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleModalClose = (saved?: boolean) => {
    setIsModalOpen(false);
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
          <p>נהל את קשרי הלקוחות שלך בממשק נקי, מהיר וממוקד פעולה.</p>
        </div>
        <div className="customers-page__actions">
          <div className="search-box">
            <Search className="search-box__icon" />
            <input 
              type="text" 
              placeholder="חיפוש לפי שם או פרטי קשר..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={handleOpenCreateModal} className="btn-new-customer">
            <UserPlus size={18} />
            לקוח חדש
          </Button>
        </div>
      </div>

      <Card className="customers-list">
        <div className="customers-list__head">
          <div className="col-name">שם הלקוח</div>
          <div className="col-contact">פרטי התקשרות</div>
          <div className="col-status">סטטוס</div>
          <div className="col-notes">הערות</div>
          <div className="col-action">פעולה אחרונה</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No customers found.</div>
        ) : (
          filteredCustomers.map(customer => {
            const primaryPhone = customer.phones?.find(p => p.is_primary)?.phone_number || customer.phones?.[0]?.phone_number || '';
            
            return (
              <div 
                key={customer.id} 
                className="customers-list__row"
                onClick={() => handleOpenEditModal(customer)}
              >
                <div className="col-name">
                  <strong>{customer.name}</strong>
                  <span>{customer.email || 'No Company'}</span>
                </div>
                
                <div className="col-contact">
                  {primaryPhone && <span className="phone">{primaryPhone}</span>}
                  {customer.email && <span className="email">{customer.email}</span>}
                </div>
                
                <div className="col-status">
                  <Badge status={customer.status} />
                </div>
                
                <div className="col-notes">
                  <span className="truncate">{customer.notes || '---'}</span>
                  {customer.notes && <span className="read-more">קרא עוד</span>}
                </div>
                
                <div className="col-action">
                  <strong>{customer.last_event || '---'}</strong>
                </div>
              </div>
            );
          })
        )}
      </Card>

      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        customer={selectedCustomer} 
      />
    </div>
  );
};

export default CustomersDashboard;
