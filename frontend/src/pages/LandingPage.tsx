import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import {
  Brain,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Layers,
  ArrowRight,
  UploadCloud,
  Cpu,
  MessageSquareQuote,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: ShieldCheck,
      title: 'Isolated Knowledge Bases',
      description: 'Keep client projects, personal notes, and team documentation strictly segmented with zero context leakage.',
    },
    {
      icon: FileCheck,
      title: 'Multi-Format Ingestion',
      description: 'Upload PDF files, Markdown notes, or plain text documents with real-time text chunking and status tracking.',
    },
    {
      icon: Sparkles,
      title: 'AI Retrieval-Augmented Generation',
      description: 'Ask natural language questions and receive accurate, hallucination-resistant answers grounded in your data.',
    },
    {
      icon: Layers,
      title: 'Exact Source Citations',
      description: 'Every answer links directly back to the document filename and exact text chunk index for instant verification.',
    },
  ];

  const steps = [
    {
      step: '01',
      icon: UploadCloud,
      title: 'Create & Upload',
      description: 'Initialize an isolated knowledge base and drop in your PDF, Markdown, or text files.',
    },
    {
      step: '02',
      icon: Cpu,
      title: 'Automatic Processing',
      description: 'Our engine extracts text, generates vector embeddings, and builds instant semantic indices.',
    },
    {
      step: '03',
      icon: MessageSquareQuote,
      title: 'Ask & Verify',
      description: 'Query your knowledge base in plain English and view instant answers with clickable source citations.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Generation AI Retrieval Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Turn your static documents into an{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-300 to-purple-400">
              Interactive Knowledge Engine
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload PDFs, Markdown, and text notes. Get precise, LLM-generated answers grounded in your personal data with verified source citations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/dashboard')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto px-8"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/register')}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full sm:w-auto px-8"
                >
                  Start Building Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8"
                >
                  Sign In to Account
                </Button>
              </>
            )}
          </div>

          {/* Hero Visual Mockup Preview */}
          <div className="mt-16 relative rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4 shadow-2xl shadow-indigo-950/40 backdrop-blur-md">
            <div className="flex items-center space-x-2 px-3 py-2 border-b border-slate-800 mb-4 text-xs text-slate-400">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="font-mono text-slate-400 ml-2">knowledge-base.app/kb/engineering-docs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left p-2">
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Documents</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono">3 uploaded</span>
                </div>
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="p-2 bg-slate-900 rounded-lg flex items-center justify-between border border-slate-800/60">
                    <span>architecture_specs.pdf</span>
                    <span className="text-emerald-400 text-[10px]">Processed</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg flex items-center justify-between border border-slate-800/60">
                    <span>api_endpoints.md</span>
                    <span className="text-emerald-400 text-[10px]">Processed</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-2">
                  <span className="font-semibold text-slate-200">Interactive RAG Query</span>
                  <span className="text-indigo-400 text-[10px]">LLM + Vector Context</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-100 border border-indigo-500/30 text-right ml-auto max-w-[80%]">
                    How is JWT authentication configured in our API services?
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 mr-auto max-w-[90%] space-y-2">
                    <p>JWT auth uses HS256 tokens with automatic 401 response interceptors and Bearer header injection on every API call.</p>
                    <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-indigo-300 flex items-center justify-between font-mono">
                      <span>Source: api_endpoints.md</span>
                      <span>Chunk #4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Built for precision, privacy, and speed
            </h2>
            <p className="text-sm text-slate-400">
              Everything you need to organize documents into queryable AI knowledge bases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              How it works in 3 simple steps
            </h2>
            <p className="text-sm text-slate-400">
              From raw documents to precise AI answers in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold font-mono text-indigo-400/80">{item.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 bg-gradient-to-b from-slate-950 to-[#090d16]">
        <div className="max-w-4xl mx-auto text-center p-10 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-2xl shadow-indigo-950/30 space-y-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Ready to query your personal knowledge base?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of researchers, engineers, and creators using KnowledgeBase to extract insights instantly.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="px-8"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-slate-800/80 bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">KnowledgeBase RAG API</span>
          </div>
          <p>© {new Date().getFullYear()} Personal Knowledge Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
