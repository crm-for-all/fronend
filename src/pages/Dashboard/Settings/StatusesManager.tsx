import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Button from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';
import ConfirmModal from '../../../components/UI/ConfirmModal';
import { statusesApi } from '../../../api/statuses';
import type { Status } from '../../../types';

interface StatusesManagerProps {
  setIsDirty: (dirty: boolean) => void;
}

const StatusesManager: React.FC<StatusesManagerProps> = ({ setIsDirty }) => {
  const { t } = useTranslation();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit & Create State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Status>>({});
  
  // Delete Context
  const [statusToDelete, setStatusToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchStatuses();
  }, []);

  useEffect(() => {
    setIsDirty(editingId !== null || addingNew);
  }, [editingId, addingNew, setIsDirty]);

  const fetchStatuses = async () => {
    try {
      const data = await statusesApi.getAll();
      setStatuses(data);
    } catch (err) {
      console.error('Failed to fetch statuses', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (status: Status) => {
    setEditingId(status.id);
    setEditForm({ name: status.name, color: status.color });
    setAddingNew(false);
  };

  const handleAddNew = () => {
    setAddingNew(true);
    setEditingId(null);
    setEditForm({ name: '', color: '#3b82f6' }); // default blue
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setAddingNew(false);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editForm.name?.trim() || !editForm.color?.trim()) return;
    
    try {
      if (addingNew) {
        await statusesApi.create({ name: editForm.name, color: editForm.color });
      } else if (editingId) {
        await statusesApi.update(editingId, { name: editForm.name, color: editForm.color });
      }
      handleCancelEdit();
      fetchStatuses();
    } catch (err) {
      console.error('Failed to save status', err);
    }
  };

  const confirmDelete = async () => {
    if (!statusToDelete) return;
    setIsDeleting(true);
    try {
      await statusesApi.delete(statusToDelete);
      setStatusToDelete(null);
      fetchStatuses();
    } catch (err) {
      console.error('Failed to delete status', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <div>{t('loading', 'טוען...')}</div>;

  return (
    <div className="statuses-manager" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleAddNew} disabled={addingNew || editingId !== null}>
          <Plus size={16} style={{ margin: '0 4px' }} />
          {t('add_status', 'הוסף סטטוס')}
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {addingNew && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary)' }}>
            <Input 
              value={editForm.name || ''} 
              onChange={(e: any) => setEditForm((prev: any) => ({ ...prev, name: e.target.value }))}
              placeholder={t('name', 'שם')}
              style={{ margin: 0, flex: 1 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>{t('color', 'צבע')}</label>
              <input 
                type="color" 
                value={editForm.color || '#3b82f6'} 
                onChange={(e: any) => setEditForm((prev: any) => ({ ...prev, color: e.target.value }))}
                style={{ cursor: 'pointer', border: 'none', width: '30px', height: '30px', padding: 0, borderRadius: '4px' }}
              />
            </div>
            <Button variant="primary" onClick={handleSave} disabled={!editForm.name?.trim()}>{t('save', 'שמור')}</Button>
            <Button variant="outline" onClick={handleCancelEdit}>{t('cancel', 'ביטול')}</Button>
          </div>
        )}

        {statuses.map(status => (
          <div key={status.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            {editingId === status.id ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <Input 
                  value={editForm.name || ''} 
                  onChange={(e: any) => setEditForm((prev: any) => ({ ...prev, name: e.target.value }))}
                  style={{ margin: 0, flex: 1 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>{t('color', 'צבע')}</label>
                  <input 
                    type="color" 
                    value={editForm.color || '#000000'} 
                    onChange={(e: any) => setEditForm((prev: any) => ({ ...prev, color: e.target.value }))}
                    style={{ cursor: 'pointer', border: 'none', width: '30px', height: '30px', padding: 0, borderRadius: '4px' }}
                  />
                </div>
                <Button variant="primary" onClick={handleSave} disabled={!editForm.name?.trim()}>{t('save', 'שמור')}</Button>
                <Button variant="outline" onClick={handleCancelEdit}>{t('cancel', 'ביטול')}</Button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    color: 'var(--color-primary)',
                    textDecoration: 'underline', 
                    textDecorationColor: status.color,
                    textDecorationThickness: '2px',
                    textUnderlineOffset: '4px',
                    fontWeight: 500
                  }}>
                    {status.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button variant="outline" onClick={() => handleEdit(status)} disabled={addingNew || editingId !== null}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="danger" onClick={() => setStatusToDelete(status.id)} disabled={addingNew || editingId !== null}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
        {statuses.length === 0 && !addingNew && (
          <div style={{ textAlign: 'center', color: 'var(--color-secondary)', padding: '24px' }}>
            {t('no_statuses', 'אין סטטוסים')}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={statusToDelete !== null}
        onClose={() => setStatusToDelete(null)}
        onConfirm={confirmDelete}
        title={t('confirm_delete', 'אשר מחיקה')}
        message={t('confirm_delete_status_msg', 'האם אתה בטוח שברצונך למחוק סטטוס זה?')}
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default StatusesManager;
