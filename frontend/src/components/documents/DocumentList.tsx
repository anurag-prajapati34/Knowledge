import React, { useState } from 'react';
import type { Document } from '../../types';
import { DocumentRow } from './DocumentRow';
import { Search, FileText, RefreshCw } from 'lucide-react';
import { TableRowSkeleton } from '../ui/Skeleton';

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDeleteDocument: (id: number | string) => Promise<void>;
  onRefresh?: () => void;
  isPolling?: boolean;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  onDeleteDocument,
  onRefresh,
  isPolling = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Table Header / Filter Bar */}
      <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-sm text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-400 self-end sm:self-auto">
          {isPolling && (
            <span className="flex items-center gap-1.5 text-amber-400 font-medium animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Syncing status...
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          )}
          <span className="bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-medium">
            {documents.length} {documents.length === 1 ? 'document' : 'documents'}
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div>
        {isLoading ? (
          <div>
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div>
            {filteredDocuments.map((doc) => (
              <DocumentRow key={doc.id} document={doc} onDelete={onDeleteDocument} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">
              {searchQuery ? 'No matching documents found' : 'No documents uploaded yet'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchQuery
                ? 'Try adjusting your search query.'
                : 'Upload PDF, Markdown, or Text files above to train your knowledge base.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
