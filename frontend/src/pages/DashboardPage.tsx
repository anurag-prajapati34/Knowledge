import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { useKB } from '../hooks/useKB';
import { KBCard } from '../components/kb/KBCard';
import { CreateKBModal } from '../components/kb/CreateKBModal';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Plus, Search, Database, Sparkles, FolderPlus } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { kbs, isLoading, fetchKBs, deleteKB } = useKB();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchKBs();
  }, [fetchKBs]);

  const filteredKBs = kbs.filter(
    (kb) =>
      kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (kb.description && kb.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex bg-[#090d16] text-slate-100">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="h-16 px-8 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight my-0">
              Knowledge Bases
            </h1>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Base
          </Button>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Dashboard Intro Banner */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-xl overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Isolated Knowledge Workspaces</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight my-0">
                Your Knowledge Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Organize documents into dedicated knowledge bases. Upload files, manage context, and query your LLM with grounded citations.
              </p>
            </div>
          </div>

          {/* Search Bar & Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search Knowledge Bases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 text-sm text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="text-xs text-slate-400 font-medium self-end sm:self-auto">
              Total Bases: <span className="text-indigo-400 font-bold">{kbs.length}</span>
            </div>
          </div>

          {/* Grid / List of Knowledge Bases */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : filteredKBs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKBs.map((kb) => (
                  <KBCard key={kb.id} kb={kb} onDelete={deleteKB} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="p-12 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-4">
                  <FolderPlus className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">
                  {searchQuery ? 'No matching Knowledge Bases' : 'No Knowledge Bases created yet'}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
                  {searchQuery
                    ? 'Try searching with a different keyword.'
                    : 'Get started by creating your first knowledge base to upload documents and start querying.'}
                </p>
                {!searchQuery && (
                  <Button
                    variant="primary"
                    size="md"
                    className="mt-6"
                    onClick={() => setIsModalOpen(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Create First Knowledge Base
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <CreateKBModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(id) => navigate(`/kb/${id}`)}
      />
    </div>
  );
};
