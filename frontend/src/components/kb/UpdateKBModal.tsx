import React, { useEffect, useState } from 'react';
import { useKB } from '../../hooks/useKB';
import type { KnowledgeBase } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';

interface UpdateKBModalProps {
  kb: KnowledgeBase;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id: number | string) => void;
}

export const UpdateKBModal: React.FC<UpdateKBModalProps> = ({
  kb,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { updateKB } = useKB();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Knowledge Base name is required.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await updateKB(kb.id, {
        name: name.trim(),
        description: description.trim(),
      });

      setName('');
      setDescription('');
      onClose();

      // if (onSuccess) onSuccess(kb.id);
    } catch (err) {
      console.log("error", err)
      // Error toast shown by context
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setName(kb.name || '');
      setDescription(kb.description || '');
      setError('');
    }
  }, [isOpen, kb]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Knowledge Base"
      description="Knowledge bases isolate your documents and context for targeted AI questions."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Knowledge Base Name"
          placeholder="e.g. Product Engineering Docs"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoFocus
        />
        <Textarea
          label="Description (Optional)"
          placeholder="What kind of information does this knowledge base store?"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-200">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Update Knowledge Base
          </Button>
        </div>
      </form>
    </Modal>
  );
};
