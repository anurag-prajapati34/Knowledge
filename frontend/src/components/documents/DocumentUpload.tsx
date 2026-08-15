import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { documentsApi } from '../../api/documents';
import { formatApiError } from '../../api/client';
import type { Document } from '../../types';
import { toast } from 'react-toastify';

interface DocumentUploadProps {
  kbId: string | number;
  onUploadSuccess: (newDoc: Document) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ kbId, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = ['.pdf', '.docx', '.txt', '.md'];

  const validateFile = (file: File): boolean => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setDragError(`Unsupported file format. Please upload ${allowedExtensions.join(', ')}`);
      toast.error(`Invalid file type: ${file.name}. Only PDF, DOCX, TXT, and MD files are supported.`);
      return false;
    }
    if (file.size > 25 * 1024 * 1024) {
      setDragError('File size exceeds 25MB limit.');
      toast.error('File size exceeds 25MB limit.');
      return false;
    }
    setDragError(null);
    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    try {
      const newDoc = await documentsApi.uploadDocument(kbId, file);
      toast.success(`Successfully uploaded "${file.name}"! Processing document...`);
      onUploadSuccess(newDoc);
    } catch (err: any) {
      const msg = formatApiError(err);
      toast.error(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 scale-[1.01]'
          : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.md,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-200">
            <span className="text-indigo-400 underline underline-offset-4">Click to upload</span> or drag and drop files
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supports <span className="font-mono text-slate-300">PDF, Markdown (.md), Text (.txt)</span> up to 25MB
          </p>
        </div>

        {dragError && (
          <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {dragError}
          </p>
        )}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          isLoading={isUploading}
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          {isUploading ? 'Uploading Document...' : 'Browse Computer'}
        </Button>
      </div>
    </div>
  );
};
