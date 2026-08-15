import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center text-black font-sans">
      <div className="w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center mb-6 animate-pulse-glow">
        <FileQuestion className="w-10 h-10" />
      </div>

      <h1 className="text-4xl font-extrabold text-black tracking-tight my-0 font-serif-heading">
        404 — Page Not Found
      </h1>

      <p className="text-sm text-zinc-600 max-w-sm mx-auto mt-2 mb-8">
        The requested knowledge base page or resource could not be found or has been moved.
      </p>

      <Link to="/dashboard">
        <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4 text-white" />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
