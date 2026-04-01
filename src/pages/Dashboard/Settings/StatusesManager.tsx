import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Button from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';
import Badge from '../../../components/UI/Badge';
import ConfirmModal from '../../../components/UI/ConfirmModal';
import { statusesApi } from '../../../api/statuses';
import type { Status, StatusColor } from '../../../types';

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
    setEditForm({ name: '', color: 'gray' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setAddingNew(false);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editForm.name?.trim() || !editForm.color) return;
    
    try {
      if (addingNew) {
        await statusesApi.create({ name: editForm.name, color: editForm.color as StatusColor });
      } else if (editingId) {
        await statusesApi.update(editingId, { name: editForm.name, color: editForm.color as StatusColor });
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

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const renderColorSelect = () => {
    const colors: StatusColor[] = ['gray', 'blue', 'green', 'yellow', 'orange', 'red', 'purple', 'pink', 'teal'];
    
    return (
      <div style={{ position: 'relative', width: 'fit-content' }}>
        <button
          type="button"
          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            border: '2px solid var(--color-border)',
            backgroundColor: `var(--tone-${editForm.color || 'gray'}-bg)`,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: `var(--tone-${editForm.color || 'gray'}-text)` }} />
        </button>
        
        {isColorPickerOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            insetInlineEnd: 0,
            marginTop: '8px',
            padding: '8px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            zIndex: 100,
          }}>
            {colors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  setEditForm(prev => ({ ...prev, color }));
                  setIsColorPickerOpen(false);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: `var(--tone-${color}-bg)`,
                  border: `2px solid ${editForm.color === color ? 'var(--color-primary)' : 'var(--tone-${color}-border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <Input 
                  value={editForm.name || ''} 
                  onChange={(e: any) => setEditForm((prev: any) => ({ ...prev, name: e.target.value }))}
                  placeholder={t('status_label', 'סטטוס')}
                  style={{ margin: 0 }}
                />
              </div>
              <div style={{ paddingBottom: '4px' }}>
                {renderColorSelect()}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={handleCancelEdit}>{t('cancel', 'ביטול')}</Button>
              <Button variant="primary" onClick={handleSave} disabled={!editForm.name?.trim()}>{t('save', 'שמור')}</Button>
            </div>
          </div>
        )}

        {statuses.map(status => (
          <div key={status.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            {editingId === status.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <Input 
                      value={editForm.name || ''} 
                      onChange={(e: any) => setEditForm((prev: any) => ({ ...prev, name: e.target.value }))}
                      placeholder={t('status_label', 'סטטוס')}
                      style={{ margin: 0 }}
                    />
                  </div>
                  <div style={{ paddingBottom: '4px' }}>
                    {renderColorSelect()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Button variant="outline" onClick={handleCancelEdit}>{t('cancel', 'ביטול')}</Button>
                  <Button variant="primary" onClick={handleSave} disabled={!editForm.name?.trim()}>{t('save', 'שמור')}</Button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Badge status={status} />
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
