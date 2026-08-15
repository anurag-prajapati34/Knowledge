import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useKB } from '../../hooks/useKB';

interface CreateKBModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id: number | string) => void;
}

export const CreateKBModal: React.FC<CreateKBModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createKB } = useKB();
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
      const newKb = await createKB({
        name: name.trim(),
      });
      setName('');
      setDescription('');
      onClose();
      if (onSuccess) onSuccess(newKb.id);
    } catch (err) {
      // Error toast shown by context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Knowledge Base"
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
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Knowledge Base
          </Button>
        </div>
      </form>
    </Modal>
  );
};
