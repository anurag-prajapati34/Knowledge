import React from 'react';
import type { DocumentStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Clock, AlertCircle, FileCheck } from 'lucide-react';
import { Spinner } from '../ui/Spinner';

interface StatusBadgeProps {
  status: DocumentStatus;
  errorMessage?: string | null;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, errorMessage }) => {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="success">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Completed</span>
        </Badge>
      );
    case 'processing':
      return (
        <Badge variant="warning" className="animate-pulse">
          <Spinner size="sm" className="text-amber-400" />
          <span>Processing</span>
        </Badge>
      );
    case 'uploaded':
      return (
        <Badge variant="info">
          <Clock className="w-3 h-3 text-indigo-400" />
          <span>Uploaded</span>
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="danger" title={errorMessage || 'Processing failed'}>
          <AlertCircle className="w-3 h-3 text-rose-400" />
          <span>Failed</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="default">
          <FileCheck className="w-3 h-3" />
          <span>{status}</span>
        </Badge>
      );
  }
};
