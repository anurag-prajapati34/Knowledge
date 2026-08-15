import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { kbApi } from '../api/kb';
import { documentsApi } from '../api/documents';
import type { KnowledgeBase, Document } from '../types';
import { formatApiError } from '../api/client';
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

  // Document Status Polling setup: Poll every 4 seconds if any doc is in 'PROCESSING' or 'PENDING' status
  useEffect(() => {
    const hasProcessingDocs = documents.some(
      (doc) => doc.doc_status === 'PROCESSING' || doc.doc_status === 'PENDING'
    );

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
      toast.success('Document deleted successfully.');
    } catch (err: any) {
      toast.error(formatApiError(err) || 'Failed to delete document.');
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
    <div className="min-h-screen flex bg-white text-black font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Navigation Bar */}
        <header className="h-16 px-8 border-b border-zinc-200 bg-white/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-zinc-500 hover:text-black p-2 rounded-xl hover:bg-zinc-100 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-4 w-px bg-zinc-200" />

            {isLoadingKB ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-black" />
                <h1 className="text-base font-bold text-black truncate max-w-xs sm:max-w-md my-0 font-serif-heading">
                  {kb?.name}
                </h1>
              </div>
            )}
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-zinc-100 border border-zinc-200 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-black text-white shadow-md'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Documents ({documents.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-black text-white shadow-md'
                  : 'text-zinc-600 hover:text-black'
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
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-black my-0 font-serif-heading">{kb?.name}</h2>
                <Badge variant="default">
                  <Layers className="w-3 h-3 text-black" />
                  <span>Knowledge Base</span>
                </Badge>
              </div>
              <p className="text-xs text-zinc-600">
                Vectorized Knowledge Base for fast document retrieval and RAG query processing.
              </p>
            </div>

            <div className="flex items-center space-x-4 text-xs text-zinc-600 shrink-0">
              <div className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-black" />
                <span>{documents.length} Docs</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-black" />
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
