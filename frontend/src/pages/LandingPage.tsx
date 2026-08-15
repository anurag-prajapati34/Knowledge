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
    <div className="min-h-screen flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Subtle Accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-black/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs font-semibold animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Next-Generation AI Retrieval Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-black leading-[1.15] font-serif-heading">
            Turn your static documents into an{' '}
            <span className="underline underline-offset-8 decoration-zinc-400 decoration-2">
              Interactive Knowledge Engine
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Upload PDFs, Markdown, and text notes. Get precise, LLM-generated answers grounded in your personal data with verified source citations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/dashboard')}
                rightIcon={<ArrowRight className="w-5 h-5 text-white" />}
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
                  rightIcon={<ArrowRight className="w-5 h-5 text-white" />}
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
          <div className="mt-16 relative rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center space-x-2 px-3 py-2 border-b border-zinc-200 mb-4 text-xs text-zinc-500">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
              </div>
              <span className="font-mono text-zinc-600 ml-2 font-mono-text">knowledge-base.app/kb/engineering-docs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left p-2">
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black">Documents</span>
                  <span className="text-[10px] bg-white border border-zinc-300 text-black px-2 py-0.5 rounded-full font-mono font-mono-text font-semibold">3 uploaded</span>
                </div>
                <div className="space-y-2 text-xs text-zinc-600">
                  <div className="p-2 bg-white rounded-lg flex items-center justify-between border border-zinc-200">
                    <span className="text-black font-medium">architecture_specs.pdf</span>
                    <span className="text-black text-[10px] font-bold">Processed</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg flex items-center justify-between border border-zinc-200">
                    <span className="text-black font-medium">api_endpoints.md</span>
                    <span className="text-black text-[10px] font-bold">Processed</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-zinc-200 pb-2">
                  <span className="font-semibold text-black">Interactive RAG Query</span>
                  <span className="text-zinc-600 text-[10px] font-semibold">LLM + Vector Context</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-black text-white font-medium text-right ml-auto max-w-[80%]">
                    How is JWT authentication configured in our API services?
                  </div>
                  <div className="p-2.5 rounded-xl bg-white text-black border border-zinc-200 mr-auto max-w-[90%] space-y-2 shadow-sm">
                    <p>JWT auth uses HS256 tokens with automatic 401 response interceptors and Bearer header injection on every API call.</p>
                    <div className="p-1.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] text-black flex items-center justify-between font-mono font-mono-text">
                      <span>Source: api_endpoints.md</span>
                      <span className="font-bold">Chunk #4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-black font-serif-heading">
              Built for precision, privacy, and speed
            </h2>
            <p className="text-sm text-zinc-600">
              Everything you need to organize documents into queryable AI knowledge bases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-black transition-all group shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-black mb-2 font-serif-heading">{item.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{item.description}</p>
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
            <h2 className="text-3xl font-bold tracking-tight text-black font-serif-heading">
              How it works in 3 simple steps
            </h2>
            <p className="text-sm text-zinc-600">
              From raw documents to precise AI answers in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold font-mono text-zinc-400 font-mono-text">{item.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-black font-serif-heading">{item.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-4xl mx-auto text-center p-10 rounded-3xl bg-black text-white border border-black shadow-2xl space-y-6">
          <h2 className="text-3xl font-bold text-white tracking-tight font-serif-heading">
            Ready to query your personal knowledge base?
          </h2>
          <p className="text-sm text-zinc-300 max-w-xl mx-auto">
            Join thousands of researchers, engineers, and creators using KnowledgeBase to extract insights instantly.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-5 h-5 text-black" />}
              className="px-8 bg-white text-black hover:bg-zinc-100"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-zinc-200 bg-white text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-black" />
            <span className="font-bold text-black">KnowledgeBase RAG API</span>
          </div>
          <p>© {new Date().getFullYear()} Personal Knowledge Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
