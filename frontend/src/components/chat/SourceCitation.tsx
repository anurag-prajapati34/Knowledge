import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Layers } from 'lucide-react';
import type { SourceCitation as SourceCitationType } from '../../types';

interface SourceCitationProps {
  sources: SourceCitationType[];
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-800/60">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
      >
        <Layers className="w-3.5 h-3.5" />
        <span>
          {sources.length} {sources.length === 1 ? 'Source Citation' : 'Source Citations'}
        </span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="mt-2.5 space-y-2 animate-fade-in">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300"
            >
              <div className="flex items-center space-x-2 min-w-0 pr-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate font-medium text-slate-200">{src.filename}</span>
              </div>
              <span className="shrink-0 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md font-mono text-[10px]">
                Chunk #{src.chunk_index}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
