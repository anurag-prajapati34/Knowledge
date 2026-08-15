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
    (doc.file_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm text-black">
      {/* Table Header / Filter Bar */}
      <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-sm text-black placeholder-zinc-400 rounded-xl pl-9 pr-3 py-2 border border-zinc-300 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs text-zinc-600 self-end sm:self-auto">
          {isPolling && (
            <span className="flex items-center gap-1.5 text-black font-medium animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
              Syncing status...
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1 hover:text-black px-2 py-1 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          )}
          <span className="bg-white border border-zinc-200 px-2.5 py-1 rounded-full text-zinc-700 font-medium">
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
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-black font-serif-heading">
              {searchQuery ? 'No matching documents found' : 'No documents uploaded yet'}
            </h4>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto mt-1">
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
