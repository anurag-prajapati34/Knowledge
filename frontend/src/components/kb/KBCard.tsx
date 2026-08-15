import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Calendar, Trash2, ArrowUpRight } from 'lucide-react';
import type { KnowledgeBase } from '../../types';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

interface KBCardProps {
  kb: KnowledgeBase;
  onDelete: (id: number | string) => Promise<void>;
}

export const KBCard: React.FC<KBCardProps> = ({ kb, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(kb.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${kb.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(kb.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card
      hoverable
      className="group relative flex flex-col justify-between p-6 cursor-pointer bg-slate-900/60 border-slate-800 hover:border-indigo-500/40"
      onClick={() => navigate(`/kb/${kb.id}`)}
    >
      <div>
        {/* Top bar with Icon and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600/20 transition-all">
            <Database className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete Knowledge Base"
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
            >
              {isDeleting ? <Spinner size="sm" className="text-rose-400" /> : <Trash2 className="w-4 h-4" />}
            </button>
            <div className="text-slate-400 group-hover:text-indigo-400 p-1.5 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
          {kb.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 min-h-[36px]">
          Knowledge Base workspace for document search and context retrieval.
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-1.5">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>Knowledge Base</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </Card>
  );
};
