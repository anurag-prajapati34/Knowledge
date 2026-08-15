import React, { useState } from 'react';
import { FileText, FileCode, File, Trash2, Calendar } from 'lucide-react';
import type { Document } from '../../types';
import { StatusBadge } from './StatusBadge';
import { Spinner } from '../ui/Spinner';

interface DocumentRowProps {
  document: Document;
  onDelete: (id: number | string) => Promise<void>;
}

export const DocumentRow: React.FC<DocumentRowProps> = ({ document: doc, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const filename = doc.file_name || '';

  const formattedDate = doc.created_at
    ? new Date(doc.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return <FileText className="w-4 h-4 text-rose-400" />;
    }
    if (ext === 'md') {
      return <FileCode className="w-4 h-4 text-indigo-400" />;
    }
    return <File className="w-4 h-4 text-slate-400" />;
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(doc.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="p-4 border-b border-slate-800/60 last:border-0 flex items-center justify-between hover:bg-slate-900/40 transition-colors group">
      {/* File Info */}
      <div className="flex items-center space-x-3 min-w-0 flex-1 pr-4">
        <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
          {getFileIcon(filename)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
            {filename}
          </p>
          <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
            <span className="uppercase tracking-wider font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">
              {filename.split('.').pop() || doc.file_type || 'file'}
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="px-4 shrink-0">
        <StatusBadge status={doc.doc_status} errorMessage={doc.description} />
      </div>

      {/* Actions */}
      <div className="shrink-0 pl-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete Document"
          className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors disabled:opacity-50"
        >
          {isDeleting ? <Spinner size="sm" className="text-rose-400" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
