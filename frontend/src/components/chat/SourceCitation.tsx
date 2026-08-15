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
    <div className="mt-3 pt-3 border-t border-zinc-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-xs font-semibold text-black hover:underline transition-colors focus:outline-none cursor-pointer"
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
              className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between text-xs text-zinc-700 shadow-sm"
            >
              <div className="flex items-center space-x-2 min-w-0 pr-2">
                <FileText className="w-3.5 h-3.5 text-black shrink-0" />
                <span className="truncate font-medium text-black">{src.filename}</span>
              </div>
              <span className="shrink-0 bg-zinc-100 text-zinc-800 border border-zinc-300 px-2 py-0.5 rounded-md font-mono text-[10px] font-mono-text">
                Chunk #{src.chunk_index}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
