import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { kbApi } from '../api/kb';
import { documentsApi } from '../api/documents';
import type { KnowledgeBase, Document } from '../types';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { DocumentList } from '../components/documents/DocumentList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Database,
  Calendar,
  Layers,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const KnowledgeBaseDetailPage: React.FC = () => {
  const { kbId } = useParams<{ kbId: string }>();
  const navigate = useNavigate();

  const [kb, setKb] = useState<KnowledgeBase | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<'documents' | 'chat'>('documents');
  const [isLoadingKB, setIsLoadingKB] = useState(true);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isPolling, setIsPolling] = useState(false);

  const pollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch KB meta information
  const fetchKBDetails = useCallback(async () => {
    if (!kbId) return;
    try {
      const data = await kbApi.getKB(kbId);
      setKb(data);
    } catch (err: any) {
      toast.error('Failed to load Knowledge Base details.');
      navigate('/dashboard');
    } finally {
      setIsLoadingKB(false);
    }
  }, [kbId, navigate]);

  // Fetch documents list
  const fetchDocs = useCallback(async () => {
    if (!kbId) return;
    try {
      const data = await documentsApi.getDocuments(kbId);
      setDocuments(data);
    } catch (err: any) {
      toast.error('Failed to fetch documents.');
    } finally {
      setIsLoadingDocs(false);
    }
  }, [kbId]);

  useEffect(() => {
    fetchKBDetails();
    fetchDocs();
  }, [fetchKBDetails, fetchDocs]);

  // Document Status Polling setup: Poll every 4 seconds if any doc is in 'processing' status
  useEffect(() => {
    const hasProcessingDocs = documents.some((doc) => doc.status === 'processing');

    if (hasProcessingDocs) {
      setIsPolling(true);
      pollingTimerRef.current = setInterval(() => {
        fetchDocs();
      }, 4000);
    } else {
      setIsPolling(false);
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    }

    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [documents, fetchDocs]);

  const handleDeleteDocument = async (docId: number | string) => {
    if (!kbId) return;
    try {
      await documentsApi.deleteDocument(kbId, docId);
      setDocuments((prev) => prev.filter((d) => String(d.id) !== String(docId)));
      toast.success('Document deleted.');
    } catch (err: any) {
      toast.error('Failed to delete document.');
    }
  };

  const handleUploadSuccess = (newDoc: Document) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const formattedDate = kb?.created_at
    ? new Date(kb.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen flex bg-[#090d16] text-slate-100">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Navigation Bar */}
        <header className="h-16 px-8 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-900 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-4 w-px bg-slate-800" />

            {isLoadingKB ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <h1 className="text-base font-bold text-slate-100 truncate max-w-xs sm:max-w-md my-0">
                  {kb?.name}
                </h1>
              </div>
            )}
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'documents'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Documents ({documents.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI / Query</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* KB Info Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-slate-100 my-0">{kb?.name}</h2>
                <Badge variant="info">
                  <Layers className="w-3 h-3" />
                  <span>Knowledge Base</span>
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                {kb?.description || 'No description provided for this knowledge base.'}
              </p>
            </div>

            <div className="flex items-center space-x-4 text-xs text-slate-400 shrink-0">
              <div className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>{documents.length} Docs</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Tab 1: Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-6 animate-fade-in">
              <DocumentUpload kbId={kbId!} onUploadSuccess={handleUploadSuccess} />

              <DocumentList
                documents={documents}
                isLoading={isLoadingDocs}
                onDeleteDocument={handleDeleteDocument}
                onRefresh={fetchDocs}
                isPolling={isPolling}
              />
            </div>
          )}

          {/* Tab 2: Chat / Query */}
          {activeTab === 'chat' && (
            <div className="animate-fade-in">
              <ChatWindow
                kbId={kbId!}
                kbName={kb?.name}
                hasDocuments={documents.length > 0}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
