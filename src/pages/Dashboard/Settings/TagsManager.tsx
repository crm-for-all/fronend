import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Button from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';
import Badge from '../../../components/UI/Badge';
import ConfirmModal from '../../../components/UI/ConfirmModal';
import { tagsApi } from '../../../api/tags';
import type { Tag } from '../../../types';

interface TagsManagerProps {
  setIsDirty: (dirty: boolean) => void;
}

const TagsManager: React.FC<TagsManagerProps> = ({ setIsDirty }) => {
  const { t } = useTranslation();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit & Create State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Tag>>({});
  
  // Delete Context
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    setIsDirty(editingId !== null || addingNew);
  }, [editingId, addingNew, setIsDirty]);

  const fetchTags = async () => {
    try {
      const data = await tagsApi.getAll();
      setTags(data);
    } catch (err) {
      console.error('Failed to fetch tags', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditForm({ name: tag.name });
    setAddingNew(false);
  };

  const handleAddNew = () => {
    setAddingNew(true);
    setEditingId(null);
    setEditForm({ name: '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setAddingNew(false);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editForm.name?.trim()) return;
    
    try {
      if (addingNew) {
        await tagsApi.create({ name: editForm.name });
      } else if (editingId) {
        await tagsApi.update(editingId, { name: editForm.name });
      }
      handleCancelEdit();
      fetchTags();
    } catch (err) {
      console.error('Failed to save tag', err);
    }
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;
    setIsDeleting(true);
    try {
      await tagsApi.delete(tagToDelete);
      setTagToDelete(null);
      fetchTags();
    } catch (err) {
      console.error('Failed to delete tag', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <div>{t('loading', 'טוען...')}</div>;

  return (
    <div className="tags-manager" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleAddNew} disabled={addingNew || editingId !== null}>
          <Plus size={16} style={{ margin: '0 4px' }} />
          {t('add_tag', 'הוסף תגית')}
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {addingNew && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input 
                value={editForm.name || ''} 
                onChange={(e: any) => setEditForm((prev: any) => ({ ...prev, name: e.target.value }))}
                placeholder={t('name', 'שם')}
                style={{ margin: 0, flex: 1 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={handleCancelEdit}>{t('cancel', 'ביטול')}</Button>
              <Button variant="primary" onClick={handleSave} disabled={!editForm.name?.trim()}>{t('save', 'שמור')}</Button>
            </div>
          </div>
        )}

        {tags.map(tag => (
          <div key={tag.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            {editingId === tag.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input 
                    value={editForm.name || ''} 
                    onChange={(e: any) => setEditForm((prev: any) => ({ ...prev, name: e.target.value }))}
                    style={{ margin: 0, flex: 1 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Button variant="outline" onClick={handleCancelEdit}>{t('cancel', 'ביטול')}</Button>
                  <Button variant="primary" onClick={handleSave} disabled={!editForm.name?.trim()}>{t('save', 'שמור')}</Button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Badge tag={tag} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button variant="outline" onClick={() => handleEdit(tag)} disabled={addingNew || editingId !== null}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="danger" onClick={() => setTagToDelete(tag.id)} disabled={addingNew || editingId !== null}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
        {tags.length === 0 && !addingNew && (
          <div style={{ textAlign: 'center', color: 'var(--color-secondary)', padding: '24px' }}>
            {t('no_labels', 'אין תגיות')}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={tagToDelete !== null}
        onClose={() => setTagToDelete(null)}
        onConfirm={confirmDelete}
        title={t('confirm_delete', 'אשר מחיקה')}
        message={t('confirm_delete_tag_msg', 'האם אתה בטוח שברצונך למחוק תגית זו? פעולה זו בלתי הפיכה.')}
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TagsManager;
