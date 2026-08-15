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
      className="group relative flex flex-col justify-between p-6 cursor-pointer bg-white border-zinc-200 hover:border-black shadow-sm"
      onClick={() => navigate(`/kb/${kb.id}`)}
    >
      <div>
        {/* Top bar with Icon and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center group-hover:scale-105 transition-all shadow-md">
            <Database className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete Knowledge Base"
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-black p-1.5 rounded-lg hover:bg-zinc-100 transition-all cursor-pointer"
            >
              {isDeleting ? <Spinner size="sm" className="text-black" /> : <Trash2 className="w-4 h-4" />}
            </button>
            <div className="text-zinc-400 group-hover:text-black p-1.5 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-black group-hover:text-zinc-800 transition-colors line-clamp-1 font-serif-heading">
          {kb.name}
        </h3>
        <p className="text-xs text-zinc-600 mt-1.5 line-clamp-2 min-h-[36px]">
          Knowledge Base workspace for document search and context retrieval.
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
        <div className="flex items-center space-x-1.5">
          <Database className="w-3.5 h-3.5 text-black" />
          <span className="font-medium text-black">Knowledge Base</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </Card>
  );
};
