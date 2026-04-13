import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, UserPlus, Filter, X, ChevronDown, ChevronUp, Download, Loader } from 'lucide-react';
import { customersApi } from '../../api/customers';
import { tagsApi } from '../../api/tags';
import { statusesApi } from '../../api/statuses';
import type { Customer, Tag, Status, CustomerFilters } from '../../types';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import CustomerModal from '../../components/CustomerModal/CustomerModal';
import CustomerDetailsModal from '../../components/CustomerModal/CustomerDetailsModal';
import { useToast } from '../../components/UI/ToastProvider';
import NotesPopover from '../../components/UI/NotesPopover';
import './Customers.scss';

const CustomersDashboard = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);

  // Filtering State
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<Status[]>([]);
  const { showToast } = useToast();
  
  // Export State
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Local state for debouncing textual inputs
  const [localSearch, setLocalSearch] = useState('');
  const [localEmail, setLocalEmail] = useState('');
  const [localPhone, setLocalPhone] = useState('');

  const fetchMetadata = useCallback(async () => {
    try {
      const [tags, statuses] = await Promise.all([
        tagsApi.getAll(),
        statusesApi.getAll()
      ]);
      setAvailableTags(tags);
      setAvailableStatuses(statuses);
    } catch (err) {
      console.error('Failed to fetch filter metadata', err);
    }
  }, []);

  const fetchCustomers = useCallback(async (currentFilters: CustomerFilters) => {
    try {
      setIsLoading(true);
      const data = await customersApi.getAll(currentFilters);
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  // Fetch when filters change
  useEffect(() => {
    fetchCustomers(filters);
  }, [filters, fetchCustomers]);

  // Debounced search for the main bar and advanced text filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ 
        ...prev, 
        name: localSearch || undefined,
        name_match: localSearch ? 'starts_with' : (prev.name_match || undefined),
        email: localEmail || undefined,
        email_match: localEmail ? 'starts_with' : undefined,
        phone: localPhone || undefined,
        phone_match: localPhone ? (prev.phone_match || 'starts_with') : undefined
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, localEmail, localPhone]);

  const handleUpdateFilter = (key: keyof CustomerFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  const clearFilters = () => {
    setFilters({});
    setLocalSearch('');
    setLocalEmail('');
    setLocalPhone('');
  };

  const removeFilter = (key: keyof CustomerFilters) => {
    setFilters(prev => {
      const next = { ...prev };
      delete next[key];
      // Also handle match types
      if (key === 'name') delete next.name_match;
      if (key === 'phone') delete next.phone_match;
      if (key === 'email') delete next.email_match;
      return next;
    });
    if (key === 'name') setLocalSearch('');
    if (key === 'email') setLocalEmail('');
    if (key === 'phone') setLocalPhone('');
  };

  const handleExport = async (format: 'csv') => {
    setIsExportDropdownOpen(false);
    setIsExporting(true);
    try {
      const blob = await customersApi.export(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers_export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed', error);
      showToast(t('export_failed', 'Export failed. Please try again.'), 'error');
    } finally {
      setIsExporting(false);
    }
  };

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
      fetchCustomers(filters);
    }
  };

  return (
    <div className="customers-page">
      <div className="customers-page__header">
        <div className="customers-page__title">
          <h1>{t('customers')}</h1>
          <p>{t('customers_subtitle', 'נהל את קשרי הלקוחות שלך בממשק נקי וממוקד פעולה.')}</p>
        </div>
        <div className="customers-page__actions">
          <Button onClick={handleOpenCreateModal} className="btn-new-customer shadow-sm">
            <UserPlus size={18} />
            {t('new_customer_btn', 'לקוח חדש')}
          </Button>
        </div>
      </div>

      <div className="search-and-filters">
        <div className="search-bar-row">
          <div className="search-box">
            <Search className="search-box__icon" />
            <input 
              type="text" 
              placeholder={t('search_name_placeholder', 'Search by name...')} 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)} 
            className={showFilters ? 'btn-filters-active' : ''}
          >
            <Filter size={18} />
            {t('filters', 'Filters')}
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          {(Object.keys(filters).length > 0) && (
            <Button variant="ghost" onClick={clearFilters} className="btn-clear-all">
              {t('clear_all', 'Clear All')}
            </Button>
          )}

          <div style={{ flex: 1 }} />
          
          <div className="export-container" style={{ position: 'relative' }}>
            <Button 
               variant="outline" 
               onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
               disabled={isExporting}
               className={isExportDropdownOpen ? 'btn-filters-active' : ''}
            >
              {isExporting ? <Loader size={18} className="animate-spin" /> : <Download size={18} />}
              <span style={{ marginInlineStart: '8px' }}>{t('export', 'Export')}</span>
              <ChevronDown size={16} style={{ marginInlineStart: '4px' }} />
            </Button>
            
            {isExportDropdownOpen && (
              <>
                <div onClick={() => setIsExportDropdownOpen(false)} style={{position: 'fixed', inset: 0, zIndex: 10}} />
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0, 
                  marginTop: '8px',
                  minWidth: '160px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--color-border)',
                  zIndex: 20,
                  padding: '6px'
                }}>
                  <button 
                    onClick={() => handleExport('csv')} 
                    style={{
                      width: '100%', textAlign: 'start', padding: '10px 14px', 
                      fontSize: '14px', color: 'var(--color-primary)', fontWeight: 500,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>{t('export_csv', 'Export as CSV')}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {showFilters && (
          <Card className="advanced-filters animate-slide-down">
            <div className="filters-grid">
              <div className="filters-grid__item">
                <label>{t('status_label', 'Status')}</label>
                <select 
                  value={filters.status || ''} 
                  onChange={(e) => handleUpdateFilter('status', e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('all_statuses', 'All Statuses')}</option>
                  {availableStatuses.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="filters-grid__item">
                <label>{t('tags_label', 'Tags')}</label>
                <select 
                  value={filters.tag || ''} 
                  onChange={(e) => handleUpdateFilter('tag', e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('all_tags', 'All Tags')}</option>
                  {availableTags.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="filters-grid__item">
                <label>{t('phone_label', 'Phone')}</label>
                <div className="filter-input-group">
                  <Input 
                    value={localPhone} 
                    onChange={(e) => setLocalPhone(e.target.value)}
                    placeholder="05..."
                    fullWidth
                  />
                  <select 
                    value={filters.phone_match || 'starts_with'} 
                    onChange={(e) => handleUpdateFilter('phone_match', e.target.value)}
                    className="match-select"
                  >
                    <option value="starts_with">{t('starts_with', 'Starts with')}</option>
                    <option value="ends_with">{t('ends_with', 'Ends with')}</option>
                  </select>
                </div>
              </div>

              <div className="filters-grid__item">
                <label>{t('email_label', 'Email')}</label>
                <Input 
                  value={localEmail} 
                  onChange={(e) => setLocalEmail(e.target.value)}
                  placeholder="name@..."
                  fullWidth
                />
              </div>
            </div>
          </Card>
        )}

        <div className="active-chips">
          {filters.status && (
            <div className="filter-chip">
              <span>{t('status_label')}: {availableStatuses.find(s => s.id === filters.status)?.name}</span>
              <button onClick={() => removeFilter('status')}><X size={14} /></button>
            </div>
          )}
          {filters.tag && (
            <div className="filter-chip">
              <span>{t('tags_label')}: {availableTags.find(t => t.id === filters.tag)?.name}</span>
              <button onClick={() => removeFilter('tag')}><X size={14} /></button>
            </div>
          )}
          {filters.phone && (
              <div className="filter-chip">
                <span>{t('phone_label')}: {filters.phone}</span>
                <button onClick={() => removeFilter('phone')}><X size={14} /></button>
              </div>
          )}
          {filters.email && (
              <div className="filter-chip">
                <span>{t('email_label')}: {filters.email}</span>
                <button onClick={() => removeFilter('email')}><X size={14} /></button>
              </div>
          )}
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
          <div className="p-8 text-center" style={{ padding: '80px 0' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '16px', color: 'var(--color-secondary)' }}>{t('fetching_customers', 'טוען לקוחות...')}</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-gray-500" style={{ padding: '80px 0' }}>{t('no_customers_found', 'לא נמצאו לקוחות.')}</div>
        ) : (
          customers.map(customer => {
            const primaryPhone = customer.phones?.find(p => p.is_primary)?.phone_number || customer.phones?.[0]?.phone_number || '';
            
            return (
                <div 
                  key={customer.id} 
                  className="customers-list__row"
                  onClick={() => handleOpenDetailsModal(customer)}
                >
                <div className="col-name">
                  <strong>{customer.name}</strong>
                  {customer.email && <span>{customer.email}</span>}
                </div>
                
                <div className="col-contact">
                  {primaryPhone && <span className="phone">{primaryPhone}</span>}
                </div>
                
                <div className="col-notes" onClick={(e) => e.stopPropagation()}>
                  <NotesPopover notes={customer.notes || ''}>
                    <div className="notes-trigger-area">
                      <span className="truncate">{customer.notes || '\u2014'}</span>
                      {customer.notes && <span className="read-more">{t('read_more')}</span>}
                    </div>
                  </NotesPopover>
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
